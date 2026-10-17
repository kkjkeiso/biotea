import type { CSSProperties } from "react";
import { Link } from "react-router";
import { listarTemas } from "../content";
import { Icone, IlustracaoTema } from "../components/Icone";
import { FALAS } from "../content/falas";
import { BotaoVoz } from "../components/BotaoVoz";
import { Cabecalho } from "../components/Cabecalho";

export function Jogos() {
  const temas = listarTemas();
  return (
    <main id="conteudo" tabIndex={-1}>
      <Cabecalho
        centralizado
        sobretitulo="Jogos"
        titulo={FALAS.escolhaTema}
        subtitulo="Cada tema tem atividades curtas, para fazer no seu ritmo."
        acoes={<BotaoVoz texto={FALAS.escolhaTema} />}
      />
      <div className="conteudo conteudo--estreito">
        <ul className="grade-cards">
          {temas.map((t, i) =>
            t.status === "ativo" ? (
              <li key={t.id} style={{ "--i": i } as CSSProperties}>
                <Link to={`/tema/${t.id}`} className="card">
                  <span className="card__icone"><IlustracaoTema nome={t.icone} /></span>
                  <span className="card__titulo">{t.titulo}</span>
                  <span className="card__texto">{t.descricao}</span>
                  <span className="card__acao">Abrir <Icone nome="seta" /></span>
                </Link>
              </li>
            ) : (
              <li key={t.id} style={{ "--i": i } as CSSProperties}>
                <div className="card card--breve" aria-disabled="true">
                  <span className="card__icone"><IlustracaoTema nome={t.icone} /></span>
                  <span className="card__titulo">{t.titulo}</span>
                  <span className="card__texto">{t.descricao}</span>
                  <span className="etiqueta">Em breve</span>
                </div>
              </li>
            ),
          )}
        </ul>
      </div>
    </main>
  );
}
