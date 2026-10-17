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
const MAX_PALAVRAS = 10;

interface Fala {
  texto: string;
  nome: string;
}

interface Manifesto {
  voz: string;
  velocidade: string;
  falas: Record<string, string>;
}

function slug(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(" ")
    .slice(0, MAX_PALAVRAS)
    .join("-");
}

function falas() {
  const lista = new Map<string, Fala>();
  for (const texto of Object.values(FALAS)) lista.set(texto, { texto, nome: slug(texto) });
  for (const tema of readdirSync(PASTA_CONTEUDO, { withFileTypes: true })) {
    if (!tema.isDirectory()) continue;
    for (const arquivo of readdirSync(join(PASTA_CONTEUDO, tema.name))) {
      if (!arquivo.endsWith(".json")) continue;
      const dados = JSON.parse(readFileSync(join(PASTA_CONTEUDO, tema.name, arquivo), "utf8"));
      if (!Array.isArray(dados)) continue;
      for (const item of dados) {
        if (!(item?.nome && item?.descricao && item?.funcao)) continue;
        const texto = textoDaParte(item);
        lista.set(texto, { texto, nome: slug(item.nome) });
      }
    }
  }
  return [...lista.values()];
}

function nomearArquivos(lista: Fala[]) {
  const usados = new Set<string>();
  const arquivos = new Map<string, string>();
  for (const { texto, nome } of [...lista].sort((a, b) => a.texto.localeCompare(b.texto))) {
    let arquivo = `${nome}.mp3`;
    for (let i = 2; usados.has(arquivo); i++) arquivo = `${nome}-${i}.mp3`;
    usados.add(arquivo);
    arquivos.set(texto, arquivo);
  }
  return arquivos;
}

function lerManifesto(): Manifesto | null {
  if (!existsSync(MANIFESTO)) return null;
  const dados = JSON.parse(readFileSync(MANIFESTO, "utf8"));
  return dados?.falas ? dados : null;
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

const arquivos = nomearArquivos(falas());
const anterior = lerManifesto();
const mesmaVoz = anterior?.voz === voz && anterior?.velocidade === velocidade;
const faltando = [...arquivos].filter(
  ([texto, arquivo]) => !mesmaVoz || anterior!.falas[texto] !== arquivo || !existsSync(join(PASTA_AUDIO, arquivo)),
);

if (faltando.length && !chave) {
  console.error("Falta AZURE_SPEECH_KEY no arquivo .env (veja .env.example).");
  process.exit(1);
}

mkdirSync(PASTA_AUDIO, { recursive: true });
for (const [texto, arquivo] of faltando) {
  writeFileSync(join(PASTA_AUDIO, arquivo), await sintetizar(texto));
  console.log(`gerado  ${arquivo}`);
}

const usados = new Set(arquivos.values());
for (const arquivo of readdirSync(PASTA_AUDIO)) {
  if (arquivo.endsWith(".mp3") && !usados.has(arquivo)) {
    unlinkSync(join(PASTA_AUDIO, arquivo));
    console.log(`removido ${arquivo}`);
  }
}

const manifesto: Manifesto = { voz, velocidade, falas: Object.fromEntries([...arquivos].sort(([a], [b]) => a.localeCompare(b))) };
writeFileSync(MANIFESTO, JSON.stringify(manifesto, null, 2) + "\n");
console.log(`${arquivos.size} falas, ${faltando.length} novas. Voz: ${voz}.`);
