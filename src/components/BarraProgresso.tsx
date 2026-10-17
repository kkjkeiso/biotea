export function BarraProgresso({ atual, total, rotulo }: { atual: number; total: number; rotulo: string }) {
  const pct = total > 0 ? Math.round((atual / total) * 100) : 0;
  return (
    <div className="progresso">
      <div
        className="progresso__trilho"
        role="progressbar"
        aria-label={rotulo}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={atual}
        aria-valuetext={`${atual} de ${total}`}
      >
        <div className="progresso__barra" style={{ width: `${pct}%` }} />
      </div>
      <span className="progresso__texto" aria-hidden="true">
        {atual} de {total}
      </span>
    </div>
  );
}
