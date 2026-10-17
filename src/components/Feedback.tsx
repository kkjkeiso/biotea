import type { ReactNode } from "react";
import { Icone } from "./Icone";

export function Feedback({ tipo, children }: { tipo: "certo" | "tente"; children: ReactNode }) {
  return (
    <div className={`feedback feedback--${tipo}`} role="status">
      <Icone nome={tipo} />
      <div>{children}</div>
    </div>
  );
}
