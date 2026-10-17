import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { lerConfig, salvarConfig, type Config } from "./config";

interface ValorConfig {
  config: Config;
  mudar: (parcial: Partial<Config>) => void;
}

const ConfigContext = createContext<ValorConfig | null>(null);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<Config>(lerConfig);

  const mudar = useCallback((parcial: Partial<Config>) => {
    setConfig((atual) => {
      const nova = { ...atual, ...parcial };
      salvarConfig(nova);
      return nova;
    });
  }, []);

  const valor = useMemo(() => ({ config, mudar }), [config, mudar]);
  return <ConfigContext.Provider value={valor}>{children}</ConfigContext.Provider>;
}

export function useConfig() {
  const valor = useContext(ConfigContext);
  if (!valor) throw new Error("useConfig precisa estar dentro de <ConfigProvider>");
  return valor;
}
