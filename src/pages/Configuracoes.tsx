import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import { useConfig } from "../settings/ConfigContext";
import type { Aparencia, TamanhoTexto, VelocidadeVoz } from "../settings/config";
import { Icone } from "../components/Icone";
import { Cabecalho } from "../components/Cabecalho";
import { falar } from "../components/fala";
import { FALAS } from "../content/falas";

const TAMANHOS: { valor: TamanhoTexto; rotulo: string }[] = [
  { valor: "normal", rotulo: "Normal" },
  { valor: "grande", rotulo: "Grande" },
  { valor: "muito-grande", rotulo: "Muito grande" },
];

const APARENCIAS: { valor: Aparencia; rotulo: string }[] = [
  { valor: "sistema", rotulo: "Automático" },
  { valor: "claro", rotulo: "Claro" },
  { valor: "escuro", rotulo: "Escuro" },
];

const VELOCIDADES: { valor: VelocidadeVoz; rotulo: string }[] = [
  { valor: "devagar", rotulo: "Devagar" },
  { valor: "normal", rotulo: "Normal" },
];

function Interruptor({ id, ligado, onMudar }: { id: string; ligado: boolean; onMudar: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      className="interruptor"
      aria-checked={ligado}
      aria-labelledby={`${id}-titulo`}
      aria-describedby={`${id}-ajuda`}
      onClick={() => onMudar(!ligado)}
    />
  );
}

function Segmentado<T extends string>({ id, opcoes, valor, onMudar }: {
  id: string;
  opcoes: { valor: T; rotulo: string }[];
  valor: T;
  onMudar: (v: T) => void;
}) {
  return (
    <div className="segmentado" role="group" aria-labelledby={`${id}-titulo`}>
      {opcoes.map((o) => (
        <button key={o.valor} type="button" aria-pressed={valor === o.valor} onClick={() => onMudar(o.valor)}>
          {o.rotulo}
        </button>
      ))}
    </div>
  );
}

function Opcao({ id, titulo, ajuda, children }: { id: string; titulo: string; ajuda: string; children: ReactNode }) {
  return (
    <li className="opcao">
      <div className="opcao__texto">
        <span className="opcao__titulo" id={`${id}-titulo`}>{titulo}</span>
        <span className="opcao__ajuda" id={`${id}-ajuda`}>{ajuda}</span>
      </div>
      <div className="opcao__controle">{children}</div>
    </li>
  );
}

export function Configuracoes() {
  const { config, mudar } = useConfig();
  const navegar = useNavigate();

  return (
    <main id="conteudo" tabIndex={-1} className="pagina-config">
      <Cabecalho
        titulo="Configurações"
        subtitulo="Ajuste o biotea do seu jeito. Tudo fica salvo neste aparelho."
        onVoltar={() => navegar(-1)}
      />
      <div className="conteudo">
        <section className="grupo" aria-labelledby="grupo-tela">
          <h2 className="grupo__titulo" id="grupo-tela">Tela</h2>
          <ul className="lista-opcoes">
            <Opcao id="aparencia" titulo="Aparência" ajuda="Automático segue o modo claro ou escuro do aparelho.">
              <Segmentado id="aparencia" opcoes={APARENCIAS} valor={config.aparencia} onMudar={(v) => mudar({ aparencia: v })} />
            </Opcao>
            <Opcao id="texto" titulo="Tamanho do texto" ajuda="Escolha o tamanho das letras.">
              <Segmentado id="texto" opcoes={TAMANHOS} valor={config.texto} onMudar={(v) => mudar({ texto: v })} />
            </Opcao>
            <Opcao id="calmo" titulo="Desabilitar animações" ajuda="Nada se mexe na tela.">
              <Interruptor id="calmo" ligado={config.calmo} onMudar={(v) => mudar({ calmo: v })} />
            </Opcao>
            <Opcao id="contraste" titulo="Alto contraste" ajuda="Cores mais fortes e bordas pretas.">
              <Interruptor id="contraste" ligado={config.contraste} onMudar={(v) => mudar({ contraste: v })} />
            </Opcao>
          </ul>
        </section>

        <section className="grupo" aria-labelledby="grupo-voz">
          <h2 className="grupo__titulo" id="grupo-voz">Leitura em voz</h2>
          <ul className="lista-opcoes">
            <Opcao id="voz" titulo="Mostrar botão Ouvir" ajuda="Lê em voz alta as instruções e os textos.">
              <Interruptor id="voz" ligado={config.voz} onMudar={(v) => mudar({ voz: v })} />
            </Opcao>
            {config.voz && (
              <Opcao id="velocidade" titulo="Velocidade" ajuda="Devagar é mais fácil de entender.">
                <Segmentado id="velocidade" opcoes={VELOCIDADES} valor={config.vozVelocidade} onMudar={(v) => mudar({ vozVelocidade: v })} />
                <button type="button" className="botao botao--suave botao--pequeno" onClick={() => falar(FALAS.teste)}>
                  <Icone nome="som" />
                  Testar
                </button>
              </Opcao>
            )}
          </ul>
        </section>
      </div>
    </main>
  );
}
