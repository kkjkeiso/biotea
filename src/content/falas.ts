export const APRESENTACAO =
  "Um jogo educativo de biologia pensado para pessoas com TEA: previsível, calmo e acessível. " +
  "Explore a célula animal e a célula vegetal, parte por parte, sem pressa.";

export const FALAS = {
  escolhaTema: "Escolha um tema.",
  escolhaAtividade: "Escolha uma atividade.",
  toqueCelula: "Toque em uma célula.",
  toqueParte: "Toque em uma parte da célula.",
  passeMouse: "Passe o mouse em uma parte da célula.",
  apresentacao: `BioTEA. ${APRESENTACAO}`,
  teste: "Olá. Esta é a leitura em voz do BioTEA.",
};

export function textoDaParte(p: { nome: string; descricao: string; funcao: string }) {
  return `${p.nome}. ${p.descricao} ${p.funcao}`;
}
