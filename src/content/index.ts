import type { Tema, TemaResumo } from "../types";
import listaTemas from "./temas.json";

const temas = import.meta.glob<Tema>("./*/tema.json", { eager: true, import: "default" });
const jsons = import.meta.glob("./*/*.json", { eager: true, import: "default" });
const svgsBrutos = import.meta.glob<string>("./*/*.svg", { eager: true, query: "?raw", import: "default" });
const svgsUrl = import.meta.glob<string>("./*/*.svg", { eager: true, query: "?url", import: "default" });

export function listarTemas(): TemaResumo[] {
  return listaTemas as TemaResumo[];
}

export function obterTema(temaId: string): Tema | undefined {
  return temas[`./${temaId}/tema.json`];
}

export function lerJson<T>(temaId: string, arquivo: string): T | undefined {
  return jsons[`./${temaId}/${arquivo}`] as T | undefined;
}

export function lerSvg(temaId: string, arquivo: string): string | undefined {
  return svgsBrutos[`./${temaId}/${arquivo}`];
}

export function urlSvg(temaId: string, arquivo: string): string | undefined {
  return svgsUrl[`./${temaId}/${arquivo}`];
}
