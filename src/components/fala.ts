import vozes from "../content/vozes.json";
import { lerConfig, type VelocidadeVoz } from "../settings/config";

const arquivos: Record<string, string> = vozes;

const VELOCIDADE: Record<VelocidadeVoz, number> = { devagar: 0.85, normal: 1 };

let tocando: HTMLAudioElement | null = null;

export function temAudio(texto: string) {
  return texto in arquivos;
}

export function falar(texto: string) {
  const arquivo = arquivos[texto];
  if (!arquivo) return;
  pararFala();
  const audio = new Audio(`${import.meta.env.BASE_URL}audio/${arquivo}`);
  audio.preservesPitch = true;
  audio.playbackRate = VELOCIDADE[lerConfig().vozVelocidade] ?? VELOCIDADE.devagar;
  tocando = audio;
  audio.play().catch(() => {});
}

export function pararFala() {
  tocando?.pause();
  tocando = null;
}
