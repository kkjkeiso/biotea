import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { BotaoVoz } from "../components/BotaoVoz";
import { Icone } from "../components/Icone";
import { APRESENTACAO, FALAS } from "../content/falas";
import { useConfig } from "../settings/ConfigContext";
import { podeAnimar } from "../settings/config";

const ONDAS = [
  {
    formas: [
      "M380 980 C600 780 700 560 900 470 C1080 390 1240 420 1560 190 V980 Z",
      "M340 980 C580 800 720 600 930 500 C1100 420 1270 380 1560 230 V980 Z",
      "M420 980 C620 760 690 540 880 450 C1060 370 1220 440 1560 170 V980 Z",
    ],
    duracao: 26,
    inverter: false,
  },
  {
    formas: [
      "M-120 980 V700 C200 640 380 780 640 700 C880 626 1000 500 1200 500 C1320 500 1420 540 1560 515 V980 Z",
      "M-120 980 V680 C220 690 400 740 660 680 C900 620 1020 530 1220 520 C1340 515 1430 520 1560 545 V980 Z",
      "M-120 980 V720 C180 620 360 800 620 720 C860 640 990 480 1180 480 C1300 485 1410 560 1560 500 V980 Z",
    ],
    duracao: 32,
    inverter: true,
  },
  {
    formas: [
      "M-120 980 V820 C240 760 500 860 800 800 C1060 748 1260 660 1560 685 V980 Z",
      "M-120 980 V800 C260 800 520 830 820 780 C1080 735 1280 690 1560 665 V980 Z",
      "M-120 980 V835 C220 740 480 880 780 815 C1040 760 1240 640 1560 700 V980 Z",
    ],
    duracao: 22,
    inverter: false,
  },
];

const SUAVE = "0.45 0 0.55 1";

function OndasApresentacao() {
  const { config } = useConfig();
  const ref = useRef<SVGSVGElement>(null);
  const animar = podeAnimar(config);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    if (animar) {
      svg.unpauseAnimations();
    } else {
      svg.pauseAnimations();
      svg.setCurrentTime(0);
    }
  }, [animar]);

  return (
    <svg ref={ref} className="apresentacao__ondas" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <defs>
        {ONDAS.map((onda, i) => (
          <linearGradient key={i} id={`onda-grad-${i}`} x1="0" y1={onda.inverter ? "1" : "0"} x2="1" y2={onda.inverter ? "0" : "1"}>
            <stop offset="0" className="onda-clara" />
            <stop offset="1" className="onda-escura" />
          </linearGradient>
        ))}
      </defs>
      {ONDAS.map((onda, i) => {
        const valores = [...onda.formas, onda.formas[0]].join(";");
        const movimento = (
          <animate
            attributeName="d"
            dur={`${onda.duracao}s`}
            repeatCount="indefinite"
            values={valores}
            keyTimes="0;0.33;0.67;1"
            calcMode="spline"
            keySplines={`${SUAVE};${SUAVE};${SUAVE}`}
          />
        );
        return (
          <g key={i} className={`onda onda--${i + 1}`}>
            <path className="onda__corpo" fill={`url(#onda-grad-${i})`} d={onda.formas[0]}>{movimento}</path>
          </g>
        );
      })}
    </svg>
  );
}

export function Inicio() {
  return (
    <main id="conteudo" tabIndex={-1} className="apresentacao">
      <OndasApresentacao />
      <div className="conteudo apresentacao__conteudo">
        <h1 className="surgir">BioTEA</h1>
        <p className="apresentacao__subtitulo surgir">Biologia no seu ritmo.</p>
        <p className="apresentacao__texto surgir">{APRESENTACAO}</p>
        <div className="apresentacao__acoes surgir">
          <Link to="/jogos" className="botao botao--claro">Começar <Icone nome="seta" /></Link>
          <Link to="/configuracoes" className="botao botao--vidro">Configurações</Link>
          <BotaoVoz naFaixa texto={FALAS.apresentacao} />
        </div>
      </div>
    </main>
  );
}
