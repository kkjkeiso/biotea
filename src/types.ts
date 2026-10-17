export type Status = "ativo" | "em-breve";

export interface TemaResumo {
  id: string;
  titulo: string;
  descricao: string;
  icone: string;
  status: Status;
}

export interface AtividadeDef {
  id: string;
  motor: string;
  titulo: string;
  descricao: string;
  status: Status;
  config?: unknown;
}

export interface Tema {
  id: string;
  titulo: string;
  descricao: string;
  atividades: AtividadeDef[];
}

export interface Item {
  id: string;
  nome: string;
  descricao: string;
  funcao: string;
  grupos: string[];
  validar?: string;
}

export interface MotorProps<C = unknown> {
  tema: Tema;
  atividade: AtividadeDef;
  config: C;
}
