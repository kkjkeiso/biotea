import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type RefObject } from "react";
import { flushSync } from "react-dom";
import { Link } from "react-router";
import type { Item, MotorProps } from "../../types";
import { lerJson, lerSvg, urlSvg } from "../../content";
import { criarCronometro, registrar } from "../../research/logger";
import { podeAnimar } from "../../settings/config";
import { BarraProgresso } from "../../components/BarraProgresso";
import { BotaoVoz } from "../../components/BotaoVoz";
import { FALAS, textoDaParte } from "../../content/falas";
import { Feedback } from "../../components/Feedback";
import { Icone } from "../../components/Icone";
import { explodirSvg } from "./explosao";

interface Cena {
  id: string;
  titulo: string;
  imagem: string;
}

export interface ConfigExplorar {
  itens: string;
  cenas: Cena[];
}

type Origem = "mouse" | "toque" | "lista" | "proxima";

const TEMPO_PARA_CONTAR_MS = 600;
const LARGURA_CARTAO = 320;

function idsDoSvg(svg: string) {
  return new Set([...svg.matchAll(/data-parte="([^"]+)"/g)].map((m) => m[1]));
}

function trocarTela(mudanca: () => void) {
  if (podeAnimar() && document.startViewTransition) {
    document.startViewTransition(() => flushSync(mudanca));
  } else {
    mudanca();
  }
}

function useCartaoFixo() {
  const consulta = "(hover: none), (max-width: 760px)";
  const [fixo, setFixo] = useState(() => matchMedia(consulta).matches);
  useEffect(() => {
    const mq = matchMedia(consulta);
    const mudar = () => setFixo(mq.matches);
    mq.addEventListener("change", mudar);
    return () => mq.removeEventListener("change", mudar);
  }, []);
  return fixo;
}

interface Destaque {
  id: string;
  pos: CSSProperties;
}

const FOLGA = 12;

function useAreaDeTrabalho(ref: RefObject<HTMLElement | null>, cenaId: string | null) {
  useLayoutEffect(() => {
    const figura = ref.current;
    const area = figura?.closest(".explorar");
    const inicio = area?.querySelector(".progresso");
    if (!figura || !area || !inicio) return;

    const alturaTopo = () => document.querySelector(".topo")?.getBoundingClientRect().height ?? 0;
    const medir = () => {
      const fim = area.lastElementChild;
      if (!fim) return;
      const bloco = fim.getBoundingClientRect().bottom - inicio.getBoundingClientRect().top;
      const resto = bloco - figura.getBoundingClientRect().height;
      const altura = Math.max(260, Math.floor(window.innerHeight - alturaTopo() - resto - 3 * FOLGA));
      if (figura.style.getPropertyValue("--altura-cena") !== `${altura}px`) figura.style.setProperty("--altura-cena", `${altura}px`);
    };
    medir();

    const destino = inicio.getBoundingClientRect().top + window.scrollY - alturaTopo() - FOLGA;
    window.scrollTo({ top: destino, behavior: podeAnimar() ? "smooth" : "auto" });

    const observador = new ResizeObserver(medir);
    observador.observe(area);
    window.addEventListener("resize", medir);
    return () => {
      observador.disconnect();
      window.removeEventListener("resize", medir);
    };
  }, [ref, cenaId]);
}

export function Explorar({ tema, atividade, config }: MotorProps<ConfigExplorar>) {
  const contexto = { tema: tema.id, atividade: atividade.id };
  const cartaoFixo = useCartaoFixo();

  const cenas = useMemo(() => {
    const itens = lerJson<Item[]>(tema.id, config.itens) ?? [];
    return config.cenas.map((cena) => {
      const svg = lerSvg(tema.id, cena.imagem) ?? "";
      const ids = idsDoSvg(svg);
      return { ...cena, svg, url: urlSvg(tema.id, cena.imagem), partes: itens.filter((i) => ids.has(i.id)) };
    });
  }, [tema.id, config]);

  const [cenaId, setCenaId] = useState<string | null>(null);
  const [fixada, setFixada] = useState<Destaque | null>(null);
  const [previa, setPrevia] = useState<Destaque | null>(null);
  const [vistas, setVistas] = useState<Record<string, string[]>>({});
  const [separada, setSeparada] = useState(true);
  const vistasRef = useRef(vistas);

  const cronometro = useRef(criarCronometro());
  const inicioCena = useRef(0);
  const timerMouse = useRef<number>(undefined);
  const figuraRef = useRef<HTMLElement>(null);
  const svgRef = useRef<HTMLDivElement>(null);

  const cena = cenas.find((c) => c.id === cenaId);
  const vistasCena = cena ? (vistas[cena.id] ?? []) : [];
  const mostrada = previa ?? fixada;
  const parteMostrada = cena?.partes.find((p) => p.id === mostrada?.id);
  const concluida = !!cena && vistasCena.length === cena.partes.length;
  useAreaDeTrabalho(figuraRef, cena?.id ?? null);

  function abrirCena(id: string) {
    trocarTela(() => {
      setCenaId(id);
      setFixada(null);
      setPrevia(null);
      setSeparada(true);
    });
    inicioCena.current = performance.now();
    registrar({ ...contexto, evento: "abrir_cena", item: id, tempo_ms: cronometro.current.marcar() });
  }

  function marcarVista(parteId: string, origem: Origem) {
    if (!cena) return;
    const ja = vistasRef.current[cena.id] ?? [];
    const novas = ja.includes(parteId) ? ja : [...ja, parteId];
    vistasRef.current = { ...vistasRef.current, [cena.id]: novas };
    setVistas(vistasRef.current);
    registrar({
      ...contexto,
      evento: "ver_parte",
      item: parteId,
      resposta: origem,
      tentativa: novas.length,
      tempo_ms: cronometro.current.marcar(),
    });
    if (novas.length === cena.partes.length && ja.length < cena.partes.length) {
      registrar({
        ...contexto,
        evento: "concluir_cena",
        item: cena.id,
        tempo_ms: Math.round(performance.now() - inicioCena.current),
      });
    }
  }

  function posicaoCartao(peca: Element): CSSProperties {
    const fig = figuraRef.current?.getBoundingClientRect();
    if (!fig) return {};
    const r = peca.getBoundingClientRect();
    const largura = Math.min(LARGURA_CARTAO, fig.width - 16);
    let left = r.right - fig.left + 16;
    if (left + largura > fig.width - 8) left = r.left - fig.left - 16 - largura;
    left = Math.max(8, Math.min(left, fig.width - largura - 8));
    const top = Math.max(8, Math.min(r.top - fig.top, fig.height - 260));
    return { left, top, width: largura };
  }

  function pecaDe(alvo: Element | null) {
    const parte = alvo?.closest<SVGElement>("[data-parte]");
    const id = parte?.dataset.parte;
    if (!parte || !id || !cena?.partes.some((p) => p.id === id)) return null;
    return { id, peca: alvo!.closest(".explode") ?? parte };
  }

  function fixar(id: string, origem: Origem, peca?: Element) {
    const el = peca ?? svgRef.current?.querySelector(`[data-parte="${id}"] .explode`) ?? svgRef.current?.querySelector(`[data-parte="${id}"]`);
    setFixada({ id, pos: el ? posicaoCartao(el) : {} });
    setPrevia(null);
    marcarVista(id, origem);
  }

  function proxima() {
    if (!cena) return;
    const partes = cena.partes;
    const atual = partes.findIndex((p) => p.id === fixada?.id);
    const naOrdem = [...partes.slice(atual + 1), ...partes.slice(0, atual + 1)];
    const alvo = naOrdem.find((p) => !vistasCena.includes(p.id)) ?? naOrdem[0];
    if (alvo) fixar(alvo.id, "proxima");
  }

  useLayoutEffect(() => {
    const svg = svgRef.current?.querySelector("svg");
    if (!svg || !cena) return;
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", cena.titulo);
    explodirSvg(svg);
  }, [cena]);

  useEffect(() => {
    const svg = svgRef.current?.querySelector("svg");
    if (!svg) return;
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => svg.classList.toggle("separada", separada)),
    );
    return () => cancelAnimationFrame(id);
  }, [cena, separada]);

  useEffect(() => {
    const svg = svgRef.current?.querySelector("svg");
    if (!svg) return;
    svg.classList.toggle("tem-selecao", !!mostrada);
    svg.querySelectorAll<SVGElement>("[data-parte]").forEach((el) => {
      const id = el.dataset.parte!;
      el.classList.add("parte");
      el.classList.toggle("ativa", id === mostrada?.id);
      el.classList.toggle("vista", vistasCena.includes(id));
    });
  }, [cena, mostrada, vistasCena]);

  useEffect(() => () => clearTimeout(timerMouse.current), []);

  if (!cena) {
    return (
      <div className="explorar__escolha">
        <p className="instrucao">
          {FALAS.toqueCelula}
          <BotaoVoz texto={FALAS.toqueCelula} />
        </p>
        <ul className="grade-cenas">
          {cenas.map((c) => (
            <li key={c.id}>
              <button type="button" className="card card--cena" onClick={() => abrirCena(c.id)}>
                <img src={c.url} alt="" style={{ viewTransitionName: `cena-${c.id}` }} />
                <span className="card__titulo">{c.titulo}</span>
                <span className="card__texto">
                  {(vistas[c.id] ?? []).length} de {c.partes.length} partes vistas
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const outraPendente = cenas.find((c) => c.id !== cena.id && (vistas[c.id] ?? []).length < c.partes.length);
  const ondeAparece = (p: Item) => p.grupos.map((g) => cenas.find((c) => c.id === g)?.titulo ?? g);
  const instrucao = cartaoFixo ? FALAS.toqueParte : FALAS.passeMouse;
  const ehPrevia = !!previa && previa.id !== fixada?.id;

  const cartao = parteMostrada && (
    <section
      className={`cartao-parte ${cartaoFixo ? "cartao-parte--fixo" : "cartao-parte--flutuante"} ${ehPrevia ? "cartao-parte--previa" : ""}`}
      style={cartaoFixo ? undefined : mostrada?.pos}
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="cartao-parte__topo">
        <h2>{parteMostrada.nome}</h2>
        {!ehPrevia && (
          <button type="button" className="botao botao--suave cartao-parte__fechar" aria-label="Fechar" onClick={() => setFixada(null)}>
            <Icone nome="fechar" />
          </button>
        )}
      </div>
      <h3>O que é</h3>
      <p>{parteMostrada.descricao}</p>
      <h3>Para que serve</h3>
      <p>{parteMostrada.funcao}</p>
      <h3>Onde aparece</h3>
      <ul className="etiquetas">
        {ondeAparece(parteMostrada).map((g) => (
          <li key={g} className="etiqueta">{g}</li>
        ))}
      </ul>
      {!ehPrevia && (
        <div className="cartao-parte__acoes">
          <BotaoVoz texto={textoDaParte(parteMostrada)} />
        </div>
      )}
    </section>
  );

  return (
    <div className="explorar">
      <div className="abas" role="tablist" aria-label="Escolha a célula">
        {cenas.map((c) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            id={`aba-${c.id}`}
            className="aba"
            aria-selected={c.id === cena.id}
            aria-controls="painel-cena"
            onClick={() => c.id !== cena.id && abrirCena(c.id)}
          >
            {c.titulo}
          </button>
        ))}
      </div>

      <div id="painel-cena" role="tabpanel" aria-labelledby={`aba-${cena.id}`}>
        <BarraProgresso atual={vistasCena.length} total={cena.partes.length} rotulo="Partes vistas" />

        <div className="explorar__barra">
          <p className="instrucao">
            {instrucao}
            <BotaoVoz texto={instrucao} />
          </p>
          <div className="explorar__botoes">
            <button type="button" className="botao" aria-pressed={!separada} onClick={() => setSeparada(!separada)}>
              {separada ? "Juntar" : "Separar"}
            </button>
            {!concluida && (
              <button type="button" className="botao botao--primario" onClick={proxima}>
                Próxima parte
                <Icone nome="avancar" />
              </button>
            )}
          </div>
        </div>

        <figure ref={figuraRef} className="cena" style={{ viewTransitionName: `cena-${cena.id}` }}>
          <div
            ref={svgRef}
            className="cena__svg"
            onPointerOver={(e) => {
              if (e.pointerType !== "mouse") return;
              const achou = pecaDe(e.target as Element);
              if (achou?.id === previa?.id) return;
              clearTimeout(timerMouse.current);
              if (!achou) return setPrevia(null);
              setPrevia({ id: achou.id, pos: posicaoCartao(achou.peca) });
              timerMouse.current = window.setTimeout(() => marcarVista(achou.id, "mouse"), TEMPO_PARA_CONTAR_MS);
            }}
            onPointerLeave={() => {
              clearTimeout(timerMouse.current);
              setPrevia(null);
            }}
            onClick={(e) => {
              const achou = pecaDe(e.target as Element);
              if (achou) fixar(achou.id, cartaoFixo ? "toque" : "mouse", achou.peca);
            }}
            dangerouslySetInnerHTML={{ __html: cena.svg }}
          />
          {!cartaoFixo && cartao}
        </figure>

        {cartaoFixo &&
          (cartao ?? <p className="cartao-parte cartao-parte--fixo cartao-parte__vazio">Toque em uma parte para ver o nome dela.</p>)}

        {concluida && (
          <div className="explorar__fim">
            <Feedback tipo="certo">Você viu todas as partes da {cena.titulo.toLowerCase()}.</Feedback>
            <div className="explorar__fim-acoes">
              {outraPendente && (
                <button type="button" className="botao botao--primario" onClick={() => abrirCena(outraPendente.id)}>
                  Ver a {outraPendente.titulo.toLowerCase()}
                  <Icone nome="avancar" />
                </button>
              )}
              <Link to={`/tema/${tema.id}`} className={`botao ${outraPendente ? "" : "botao--primario"}`}>
                Voltar para {tema.titulo}
              </Link>
            </div>
          </div>
        )}

        <h2 className="lista-partes__titulo">Partes da {cena.titulo.toLowerCase()}</h2>
        <ul className="lista-partes">
          {cena.partes.map((p) => {
            const vista = vistasCena.includes(p.id);
            return (
              <li key={p.id}>
                <button
                  type="button"
                  className="chip"
                  aria-pressed={p.id === fixada?.id}
                  onClick={() => fixar(p.id, "lista")}
                >
                  {vista && <Icone nome="certo" />}
                  {p.nome}
                  {vista && <span className="visualmente-oculto"> (já vista)</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
