import type { ReactNode } from "react";
import { Link } from "react-router";
import { Icone } from "./Icone";

interface Props {
  titulo: string;
  sobretitulo?: string;
  subtitulo?: string;
  centralizado?: boolean;
  compacto?: boolean;
  voltarPara?: string;
  onVoltar?: () => void;
  rotuloVoltar?: string;
  acoes?: ReactNode;
}

export function Cabecalho({ titulo, sobretitulo, subtitulo, centralizado, compacto, voltarPara, onVoltar, rotuloVoltar = "Voltar", acoes }: Props) {
  const voltar = (
    <>
      <Icone nome="voltar" />
      <span>{rotuloVoltar}</span>
    </>
  );
  return (
    <header className={`cabecalho conteudo${centralizado ? " cabecalho--centro" : ""}${compacto ? " cabecalho--compacto" : ""}`}>
      {voltarPara && <Link to={voltarPara} className="cabecalho__voltar surgir">{voltar}</Link>}
      {onVoltar && <button type="button" className="cabecalho__voltar surgir" onClick={onVoltar}>{voltar}</button>}
      {sobretitulo && <p className="cabecalho__sobre surgir">{sobretitulo}</p>}
      <div className="cabecalho__linha surgir">
        <h1>{titulo}</h1>
        {acoes}
      </div>
      {subtitulo && <p className="cabecalho__sub surgir">{subtitulo}</p>}
    </header>
  );
}
