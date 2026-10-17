export type TamanhoTexto = "normal" | "grande" | "muito-grande";

export type Aparencia = "sistema" | "claro" | "escuro";

export type VelocidadeVoz = "devagar" | "normal";

export interface Config {
  calmo: boolean;
  texto: TamanhoTexto;
  voz: boolean;
  vozVelocidade: VelocidadeVoz;
  contraste: boolean;
  aparencia: Aparencia;
}

export const PADRAO: Config = { calmo: false, texto: "normal", voz: false, vozVelocidade: "devagar", contraste: false, aparencia: "sistema" };

const CHAVE = "biotea:config";

export function lerConfig(): Config {
  try {
    return { ...PADRAO, ...JSON.parse(localStorage.getItem(CHAVE) ?? "{}") };
  } catch {
    return { ...PADRAO };
  }
}

export function salvarConfig(c: Config) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(c));
  } catch {
  }
  aplicarNoHtml(c);
}

export function aplicarNoHtml(c: Config) {
  const html = document.documentElement;
  html.dataset.calmo = c.calmo ? "sim" : "nao";
  html.dataset.texto = c.texto;
  html.dataset.contraste = c.contraste ? "alto" : "normal";
  html.dataset.voz = c.voz ? "sim" : "nao";
  html.dataset.aparencia = c.aparencia;
}

export function podeAnimar(c: Config = lerConfig()) {
  return !c.calmo && !matchMedia("(prefers-reduced-motion: reduce)").matches;
}
