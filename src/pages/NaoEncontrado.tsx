import { Link } from "react-router";
import { Cabecalho } from "../components/Cabecalho";

export function NaoEncontrado() {
  return (
    <main id="conteudo" tabIndex={-1}>
      <Cabecalho titulo="Esta página não existe." />
      <div className="conteudo">
        <Link to="/" className="botao botao--primario">Ir para o início</Link>
      </div>
    </main>
  );
}
