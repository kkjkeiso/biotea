import type { CSSProperties } from "react";
import { Link, useParams } from "react-router";
import { obterTema } from "../content";
import { Icone } from "../components/Icone";
import { FALAS } from "../content/falas";
import { BotaoVoz } from "../components/BotaoVoz";
import { Cabecalho } from "../components/Cabecalho";
import { NaoEncontrado } from "./NaoEncontrado";

const ICONE_MOTOR: Record<string, string> = { explorar: "lupa", classificar: "pergunta", montar: "pecas" };

export function Tema() {
  const { tema: temaId = "" } = useParams();
  const tema = obterTema(temaId);
  if (!tema) return <NaoEncontrado />;

  return (
    <main id="conteudo" tabIndex={-1}>
      <Cabecalho
        centralizado
        sobretitulo={tema.titulo}
        titulo={FALAS.escolhaAtividade}
        voltarPara="/jogos"
        rotuloVoltar="Temas"
        acoes={<BotaoVoz texto={FALAS.escolhaAtividade} />}
      />
      <div className="conteudo conteudo--estreito">
        <ul className="grade-cards">
          {tema.atividades.map((a, i) => {
            const ativa = a.status === "ativo";
            const conteudo = (
              <>
                <span className="card__icone card__icone--pequeno"><Icone nome={ICONE_MOTOR[a.motor] ?? "pergunta"} /></span>
                <span className="card__titulo">{a.titulo}</span>
                <span className="card__texto">{a.descricao}</span>
                {ativa ? (
                  <span className="card__acao">Começar <Icone nome="seta" /></span>
                ) : (
                  <span className="etiqueta">Em breve</span>
                )}
              </>
            );
            return (
              <li key={a.id} style={{ "--i": i } as CSSProperties}>
                {ativa ? (
                  <Link to={`/tema/${tema.id}/${a.id}`} className="card">{conteudo}</Link>
                ) : (
                  <div className="card card--breve" aria-disabled="true">{conteudo}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
