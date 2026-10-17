import { useEffect, useRef, useState } from "react";
import { registrar } from "../research/logger";
import { pararFala } from "./fala";

function Ondas() {
  return (
    <svg className="pausa__ondas" viewBox="0 0 1440 320" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path className="onda-1" d="M520 320 C720 230 800 130 1030 112 S1300 40 1440 0 V320Z" />
      <path className="onda-2" d="M0 320 V246 C250 200 430 288 700 238 S1170 140 1440 168 V320Z" />
    </svg>
  );
}

const FASES = [
  { id: "puxar", frase: "Puxe o ar pelo nariz.", segundos: 4 },
  { id: "soltar", frase: "Solte o ar pela boca.", segundos: 6 },
] as const;

interface Props {
  aberta: boolean;
  onFechar: () => void;
  contexto: { tema: string; atividade: string };
}

export function Pausa({ aberta, onFechar, contexto }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const [fase, setFase] = useState(0);
  const [conta, setConta] = useState<number>(FASES[0].segundos);

  useEffect(() => {
    const dialogo = ref.current;
    if (!dialogo || !aberta) return;
    pararFala();
    dialogo.showModal();
    const inicio = performance.now();
    registrar({ ...contexto, evento: "pausa_inicio" });
    return () => {
      dialogo.close();
      registrar({ ...contexto, evento: "pausa_fim", tempo_ms: Math.round(performance.now() - inicio) });
    };
  }, [aberta]);

  useEffect(() => {
    if (!aberta) return;
    setFase(0);
    setConta(FASES[0].segundos);
    let f = 0;
    let c: number = FASES[0].segundos;
    const id = setInterval(() => {
      c -= 1;
      if (c <= 0) {
        f = (f + 1) % FASES.length;
        c = FASES[f].segundos;
        setFase(f);
      }
      setConta(c);
    }, 1000);
    return () => clearInterval(id);
  }, [aberta]);

  const atual = FASES[fase];
  return (
    <dialog
      ref={ref}
      className="pausa"
      aria-labelledby="pausa-titulo"
      onCancel={(e) => {
        e.preventDefault();
        onFechar();
      }}
    >
      {aberta && (
        <>
          <h2 id="pausa-titulo">Pausa</h2>
          <div className="pausa__circulo" data-fase={atual.id} aria-hidden="true">
            {conta}
          </div>
          <p className="pausa__frase" aria-live="polite">
            {atual.frase}
          </p>
          <button type="button" className="botao botao--claro" onClick={onFechar} autoFocus>
            Voltar
          </button>
          <Ondas />
        </>
      )}
    </dialog>
  );
}
