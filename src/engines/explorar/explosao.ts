const NS = "http://www.w3.org/2000/svg";

function numeros(texto: string | undefined, padrao: number[]) {
  const n = texto?.trim().split(/\s+/).map(Number);
  return n && n.length === padrao.length && n.every(Number.isFinite) ? n : padrao;
}

function envolver(el: Element) {
  const g = document.createElementNS(NS, "g");
  el.parentNode!.insertBefore(g, el);
  g.appendChild(el);
  return g;
}

function areaDeToque(b: DOMRect) {
  const folga = 8;
  const r = document.createElementNS(NS, "rect");
  r.setAttribute("x", (b.x - folga).toFixed(1));
  r.setAttribute("y", (b.y - folga).toFixed(1));
  r.setAttribute("width", (b.width + 2 * folga).toFixed(1));
  r.setAttribute("height", (b.height + 2 * folga).toFixed(1));
  r.setAttribute("fill", "transparent");
  return r;
}

export function explodirSvg(svg: SVGSVGElement) {
  if (svg.dataset.explodido) return;
  svg.dataset.explodido = "sim";

  const tudo = svg.getBBox();
  const limites = { x1: tudo.x, y1: tudo.y, x2: tudo.x + tudo.width, y2: tudo.y + tudo.height };

  const fator = Number(svg.dataset.explodirFator ?? 1.5);
  const caixa = svg.viewBox.baseVal;
  const [cx, cy] = numeros(svg.dataset.explodirCentro, [caixa.x + caixa.width / 2, caixa.y + caixa.height / 2]);

  const linhas = document.createElementNS(NS, "g");
  linhas.setAttribute("class", "linhas-explosao");
  linhas.setAttribute("aria-hidden", "true");
  let primeiraMovel: Element | null = null;

  svg.querySelectorAll<SVGGElement>("[data-parte]").forEach((parte) => {
    if (parte.hasAttribute("data-fixa")) return;
    primeiraMovel ??= parte;
    const [ex, ey] = numeros(parte.dataset.explodirExtra, [0, 0]);
    const pecas = [...parte.querySelectorAll(":scope > .peca")];

    let moveis: SVGGElement[];
    if (pecas.length) {
      moveis = pecas.map(envolver);
    } else {
      const g = document.createElementNS(NS, "g");
      while (parte.firstChild) g.appendChild(parte.firstChild);
      parte.appendChild(g);
      moveis = [g];
    }

    for (const g of moveis) {
      const b = g.getBBox();
      const mx = b.x + b.width / 2;
      const my = b.y + b.height / 2;
      const dx = (mx - cx) * (fator - 1) + ex;
      const dy = (my - cy) * (fator - 1) + ey;
      g.classList.add("explode");
      limites.x1 = Math.min(limites.x1, b.x + dx);
      limites.y1 = Math.min(limites.y1, b.y + dy);
      limites.x2 = Math.max(limites.x2, b.x + b.width + dx);
      limites.y2 = Math.max(limites.y2, b.y + b.height + dy);

      if (b.width * b.height < 8000) g.insertBefore(areaDeToque(b), g.firstChild);
      g.style.setProperty("--dx", `${dx.toFixed(1)}px`);
      g.style.setProperty("--dy", `${dy.toFixed(1)}px`);

      const linha = document.createElementNS(NS, "line");
      linha.setAttribute("x1", mx.toFixed(1));
      linha.setAttribute("y1", my.toFixed(1));
      linha.setAttribute("x2", (mx + dx).toFixed(1));
      linha.setAttribute("y2", (my + dy).toFixed(1));
      linhas.appendChild(linha);
    }
  });

  if (primeiraMovel) svg.insertBefore(linhas, primeiraMovel);

  const margem = 12;
  svg.setAttribute(
    "viewBox",
    svg.dataset.viewboxAberta ??
      [limites.x1 - margem, limites.y1 - margem, limites.x2 - limites.x1 + 2 * margem, limites.y2 - limites.y1 + 2 * margem]
        .map((n) => n.toFixed(1))
        .join(" "),
  );
}
