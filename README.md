# biotea
Jogo educativo de biologia pensado para pessoas com TEA: previsível, calmo e acessível.

## Rodar no computador

```bash
npm install      # só na primeira vez
npm run dev      # abre em http://localhost:5173/biotea/
```

`npm run build` gera o site final na pasta `dist/`.

## Onde fica cada coisa

| Pasta | O que tem |
|---|---|
| `src/content/` | **Conteúdo** (JSON e SVG). Tema novo = pasta nova aqui, sem mexer em código. |
| `src/engines/` | Motores de atividade reutilizáveis (Explorar, Classificar, Montar). |
| `src/components/` | Topo, Pausa, BarraProgresso, Feedback, BotaoVoz. |
| `src/settings/` | Configurações (modo calmo, texto, voz, contraste). |
| `src/research/` | Registro das interações para a pesquisa. |
| `src/pages/` | Telas: Início, Tema, Atividade, Configurações. |

Nos SVGs, cada parte clicável é um `<g data-parte="id">`, com o mesmo `id` usado em `organelas.json`.
