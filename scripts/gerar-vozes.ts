import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { FALAS, textoDaParte } from "../src/content/falas.ts";

if (existsSync(".env")) process.loadEnvFile(".env");

const chave = process.env.AZURE_SPEECH_KEY;
const regiao = process.env.AZURE_SPEECH_REGION || "brazilsouth";
const voz = process.env.AZURE_SPEECH_VOZ || "pt-BR-FranciscaNeural";
const velocidade = "-10%";

const PASTA_AUDIO = "public/audio";
const PASTA_CONTEUDO = "src/content";
const MANIFESTO = join(PASTA_CONTEUDO, "vozes.json");

function textos() {
  const lista = new Set<string>(Object.values(FALAS));
  for (const tema of readdirSync(PASTA_CONTEUDO, { withFileTypes: true })) {
    if (!tema.isDirectory()) continue;
    for (const arquivo of readdirSync(join(PASTA_CONTEUDO, tema.name))) {
      if (!arquivo.endsWith(".json")) continue;
      const dados = JSON.parse(readFileSync(join(PASTA_CONTEUDO, tema.name, arquivo), "utf8"));
      if (!Array.isArray(dados)) continue;
      for (const item of dados) {
        if (item?.nome && item?.descricao && item?.funcao) lista.add(textoDaParte(item));
      }
    }
  }
  return [...lista];
}

function nomeDoArquivo(texto: string) {
  return createHash("sha1").update(`${voz}|${velocidade}|${texto}`).digest("hex").slice(0, 16) + ".mp3";
}

function escaparXml(texto: string) {
  return texto.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

async function sintetizar(texto: string) {
  const ssml =
    `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="pt-BR">` +
    `<voice name="${voz}"><prosody rate="${velocidade}">${escaparXml(texto)}</prosody></voice></speak>`;
  const resposta = await fetch(`https://${regiao}.tts.speech.microsoft.com/cognitiveservices/v1`, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": chave!,
      "Content-Type": "application/ssml+xml",
      "X-Microsoft-OutputFormat": "audio-24khz-96kbitrate-mono-mp3",
      "User-Agent": "biotea",
    },
    body: ssml,
  });
  if (!resposta.ok) throw new Error(`Azure respondeu ${resposta.status}: ${await resposta.text()}`);
  return Buffer.from(await resposta.arrayBuffer());
}

const lista = textos();
const manifesto: Record<string, string> = {};
const faltando = lista.filter((t) => !existsSync(join(PASTA_AUDIO, nomeDoArquivo(t))));

if (faltando.length && !chave) {
  console.error("Falta AZURE_SPEECH_KEY no arquivo .env (veja .env.example).");
  process.exit(1);
}

mkdirSync(PASTA_AUDIO, { recursive: true });
for (const texto of faltando) {
  const arquivo = nomeDoArquivo(texto);
  writeFileSync(join(PASTA_AUDIO, arquivo), await sintetizar(texto));
  console.log(`gerado  ${arquivo}  ${texto.slice(0, 60)}`);
}

for (const texto of lista.sort()) manifesto[texto] = nomeDoArquivo(texto);
const usados = new Set(Object.values(manifesto));
for (const arquivo of readdirSync(PASTA_AUDIO)) {
  if (arquivo.endsWith(".mp3") && !usados.has(arquivo)) {
    unlinkSync(join(PASTA_AUDIO, arquivo));
    console.log(`removido ${arquivo}`);
  }
}

writeFileSync(MANIFESTO, JSON.stringify(manifesto, null, 2) + "\n");
console.log(`${lista.length} falas, ${faltando.length} novas. Voz: ${voz}.`);
