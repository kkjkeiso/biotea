import { useState, useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import { Link, NavLink, matchPath, useLocation } from "react-router";
import { useConfig } from "../settings/ConfigContext";
import { podeAnimar } from "../settings/config";
import { IlustracaoTema, Icone } from "./Icone";
import { Pausa } from "./Pausa";

const ESCURO_NO_SISTEMA = "(prefers-color-scheme: dark)";

function useSistemaEscuro() {
  return useSyncExternalStore(
    (avisar) => {
      const mq = matchMedia(ESCURO_NO_SISTEMA);
      mq.addEventListener("change", avisar);
      return () => mq.removeEventListener("change", avisar);
    },
    () => matchMedia(ESCURO_NO_SISTEMA).matches,
  );
}

export function Topo() {
  const [pausaAberta, setPausaAberta] = useState(false);
  const { config, mudar } = useConfig();
  const sistemaEscuro = useSistemaEscuro();
  const { pathname } = useLocation();
  const rota = matchPath("/tema/:tema/:atividade?", pathname);
  const contexto = { tema: rota?.params.tema ?? "", atividade: rota?.params.atividade ?? "" };

  const escuro = config.aparencia === "escuro" || (config.aparencia === "sistema" && sistemaEscuro);
  const trocarAparencia = () => {
    const mudanca = () => mudar({ aparencia: escuro ? "claro" : "escuro" });
    if (podeAnimar(config) && document.startViewTransition) {
      document.startViewTransition(() => flushSync(mudanca));
    } else {
      mudanca();
    }
  };

  return (
    <header className={`topo${pathname === "/" ? " topo--sobre" : ""}`}>
      <div className="conteudo topo__interno">
        <Link to="/" className="topo__logo" aria-label="biotea, ir para o início">
          <IlustracaoTema nome="celula" />
          <span aria-hidden="true">BioTEA</span>
        </Link>
        <nav className="topo__nav" aria-label="Principal">
          <NavLink to="/" end className="topo__link topo__link--inicio">Início</NavLink>
          <NavLink to="/jogos" className="topo__link">Jogos</NavLink>
        </nav>
        <div className="topo__acoes">
          <button type="button" className="botao botao--topo" onClick={() => setPausaAberta(true)}>
            <Icone nome="pausa" />
            <span className="botao__texto">Pausa</span>
          </button>
          <Link to="/configuracoes" className="botao botao--topo botao--icone" aria-label="Configurações">
            <Icone nome="config" />
          </Link>
          <button
            type="button"
            className="botao botao--topo botao--icone"
            aria-label="Modo escuro"
            aria-pressed={escuro}
            onClick={trocarAparencia}
          >
            <Icone nome={escuro ? "sol" : "lua"} />
          </button>
        </div>
      </div>
      <Pausa aberta={pausaAberta} onFechar={() => setPausaAberta(false)} contexto={contexto} />
    </header>
  );
}
