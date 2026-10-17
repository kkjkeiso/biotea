const CHAVE_EVENTOS = "biotea:eventos";
const CHAVE_PARTICIPANTE = "biotea:participante";
const CHAVE_SESSAO = "biotea:sessao";

export const COLUNAS = [
  "sessao", "participante", "data_hora", "tema", "atividade",
  "evento", "item", "resposta", "correta", "acerto", "tentativa", "tempo_ms",
] as const;

export type Coluna = (typeof COLUNAS)[number];
export type Evento = Record<Coluna, string | number | boolean>;
export type NovoEvento = Partial<Omit<Evento, "sessao" | "participante" | "data_hora">> & {
  evento: string;
};

function novoId() {
  return crypto.randomUUID?.().slice(0, 8) ?? Math.random().toString(36).slice(2, 10);
}

export function sessaoAtual() {
  let id = sessionStorage.getItem(CHAVE_SESSAO);
  if (!id) {
    id = novoId();
    sessionStorage.setItem(CHAVE_SESSAO, id);
  }
  return id;
}

export function participanteAtual() {
  return localStorage.getItem(CHAVE_PARTICIPANTE) ?? "";
}

export function definirParticipante(codigo: string) {
  localStorage.setItem(CHAVE_PARTICIPANTE, codigo.trim().toUpperCase());
  sessionStorage.removeItem(CHAVE_SESSAO);
}

export function lerEventos(): Evento[] {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_EVENTOS) ?? "[]");
  } catch {
    return [];
  }
}

export function apagarEventos() {
  localStorage.removeItem(CHAVE_EVENTOS);
}

export function registrar(e: NovoEvento): Evento {
  const linha: Evento = {
    sessao: sessaoAtual(),
    participante: participanteAtual(),
    data_hora: new Date().toISOString(),
    tema: "", atividade: "", item: "", resposta: "",
    correta: "", acerto: "", tentativa: "", tempo_ms: "",
    ...e,
  };
  try {
    localStorage.setItem(CHAVE_EVENTOS, JSON.stringify([...lerEventos(), linha]));
  } catch (erro) {
    console.warn("biotea: não foi possível salvar o registro", erro);
  }
  return linha;
}

export function criarCronometro() {
  let inicio = performance.now();
  return {
    marcar() {
      const agora = performance.now();
      const ms = Math.round(agora - inicio);
      inicio = agora;
      return ms;
    },
  };
}
