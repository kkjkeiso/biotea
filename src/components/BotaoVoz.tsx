import { useConfig } from "../settings/ConfigContext";
import { falar, temAudio } from "./fala";
import { Icone } from "./Icone";

export function BotaoVoz({ texto, rotulo = "Ouvir", naFaixa }: { texto: string; rotulo?: string; naFaixa?: boolean }) {
  const { config } = useConfig();
  if (!config.voz || !temAudio(texto)) return null;
  return (
    <button type="button" className={`botao ${naFaixa ? "botao--vidro" : "botao--suave botao--pequeno"}`} onClick={() => falar(texto)}>
      <Icone nome="som" />
      <span>{rotulo}</span>
    </button>
  );
}
