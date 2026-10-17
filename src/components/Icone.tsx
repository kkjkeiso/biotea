const TRACOS: Record<string, string> = {
  pausa: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M9.5 9v6 M14.5 9v6",
  config:
    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z",
  voltar: "M15 18l-6-6 6-6",
  avancar: "M9 18l6-6-6-6",
  seta: "M5 12h14 M13 6l6 6-6 6",
  som: "M11 5 6 9H3v6h3l5 4V5Z M15.5 8.5a5 5 0 0 1 0 7 M18.5 5.5a9 9 0 0 1 0 13",
  certo: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M8 12.5l2.8 2.8L16.5 9.5",
  tente: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M12 8v5 M12 16.5v.01",
  casa: "M3 11 12 4l9 7 M5 10v10h14V10",
  fechar: "M6 6l12 12 M18 6 6 18",
  lupa: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z M20 20l-4-4",
  pergunta: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6 M12 17v.01",
  pecas: "M4 4h7v7H4Z M13 13h7v7h-7Z M13 4h7v7h-7Z M4 13h7v7H4Z",
  sol: "M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z M12 2v2 M12 20v2 M4.9 4.9l1.4 1.4 M17.7 17.7l1.4 1.4 M2 12h2 M20 12h2 M4.9 19.1l1.4-1.4 M17.7 6.3l1.4-1.4",
  lua: "M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11Z",
};

export function Icone({ nome, className }: { nome: string; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={TRACOS[nome] ?? TRACOS.pergunta} />
    </svg>
  );
}

export function IlustracaoTema({ nome }: { nome: string }) {
  switch (nome) {
    case "celula":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <defs>
            <radialGradient id="il-cel" cx="38%" cy="32%" r="70%">
              <stop offset="0" stopColor="#f0f7fd" />
              <stop offset="1" stopColor="#8db7df" />
            </radialGradient>
            <radialGradient id="il-nuc" cx="35%" cy="30%" r="70%">
              <stop offset="0" stopColor="#f1e1f7" />
              <stop offset="1" stopColor="#8d68b0" />
            </radialGradient>
          </defs>
          <circle cx="32" cy="32" r="27" fill="url(#il-cel)" stroke="#6e9ccb" strokeWidth="2.5" />
          <circle cx="35" cy="29" r="10" fill="url(#il-nuc)" />
          <ellipse cx="18" cy="40" rx="6" ry="3" fill="#f19163" transform="rotate(25 18 40)" />
          <ellipse cx="44" cy="45" rx="5" ry="2.5" fill="#f19163" transform="rotate(-20 44 45)" />
          <circle cx="22" cy="22" r="2.5" fill="#bba5e8" />
        </svg>
      );
    case "corpo":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="32" cy="13" r="8" fill="#e9b99a" />
          <path d="M20 26c0-3 3-5 6-5h12c3 0 6 2 6 5v14h-6v19h-12V40h-6Z" fill="#9bb7d4" />
          <path d="M29 30c-2 2-2 5 0 7s4 1 5-1c1 2 3 3 5 1s2-5 0-7-4-1-5 1c-1-2-3-3-5-1Z" fill="#e07f8f" />
        </svg>
      );
    case "planta":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path d="M20 44h24l-3 14H23Z" fill="#d49a6a" />
          <path d="M32 44V22" stroke="#5a8f37" strokeWidth="3" strokeLinecap="round" />
          <path d="M32 30c-10 0-15-6-15-14 9 0 15 5 15 14Z" fill="#86b95c" />
          <path d="M32 24c0-9 6-14 15-14 0 8-5 14-15 14Z" fill="#a6d07a" />
        </svg>
      );
    case "animal":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <ellipse cx="34" cy="38" rx="18" ry="12" fill="#e3b77e" />
          <circle cx="16" cy="28" r="9" fill="#e3b77e" />
          <path d="M10 21l-2-7 7 4Z M20 20l3-7 2 8Z" fill="#c9965a" />
          <circle cx="14" cy="27" r="1.6" fill="#3b2a1a" />
          <path d="M22 48v8 M30 49v8 M40 49v8 M47 47v8" stroke="#c9965a" strokeWidth="4" strokeLinecap="round" />
          <path d="M52 34c5-2 7-6 6-10" stroke="#c9965a" strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
      );
    default:
      return <Icone nome={nome} />;
  }
}
