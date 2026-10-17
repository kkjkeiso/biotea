import { HashRouter, Route, Routes } from "react-router";
import { ConfigProvider } from "./settings/ConfigContext";
import { Topo } from "./components/Topo";
import { Inicio } from "./pages/Inicio";
import { Jogos } from "./pages/Jogos";
import { Tema } from "./pages/Tema";
import { Atividade } from "./pages/Atividade";
import { Configuracoes } from "./pages/Configuracoes";
import { NaoEncontrado } from "./pages/NaoEncontrado";

export function App() {
  return (
    <ConfigProvider>
      <HashRouter>
        <a href="#conteudo" className="pular-conteudo" onClick={(e) => {
          e.preventDefault();
          document.getElementById("conteudo")?.focus();
        }}>
          Pular para o conteúdo
        </a>
        <Topo />
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/jogos" element={<Jogos />} />
          <Route path="/tema/:tema" element={<Tema />} />
          <Route path="/tema/:tema/:atividade" element={<Atividade />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="*" element={<NaoEncontrado />} />
        </Routes>
      </HashRouter>
    </ConfigProvider>
  );
}
