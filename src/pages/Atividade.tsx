import { useParams } from "react-router";
import { obterTema } from "../content";
import { MOTORES } from "../engines";
import { Cabecalho } from "../components/Cabecalho";
import { NaoEncontrado } from "./NaoEncontrado";

export function Atividade() {
  const { tema: temaId = "", atividade: atividadeId = "" } = useParams();
  const tema = obterTema(temaId);
  const atividade = tema?.atividades.find((a) => a.id === atividadeId);
  const Motor = atividade && MOTORES[atividade.motor];
  if (!tema || !atividade || !Motor || atividade.status !== "ativo") return <NaoEncontrado />;

  return (
    <main id="conteudo" tabIndex={-1} className="pagina-atividade">
      <Cabecalho centralizado compacto titulo={atividade.titulo} voltarPara={`/tema/${tema.id}`} rotuloVoltar={tema.titulo} />
      <div className="conteudo">
        <Motor key={`${tema.id}/${atividade.id}`} tema={tema} atividade={atividade} config={atividade.config} />
      </div>
    </main>
  );
}
