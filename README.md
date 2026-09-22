# Iguaçu Alerta 🌊

PWA de alerta de enchentes para **União da Vitória (PR)**. No celular parece um app
nativo (bottom tab bar, tela cheia, "adicionar à tela inicial"); no desktop é um site
responsivo com sidebar e layouts próprios (split-view de mapa, grids de 2–3 colunas).

> Protótipo de hackathon: níveis, vagas e horários são dados ilustrativos.
> Os locais citados são reais de União da Vitória.

## Stack

- React + Vite (JavaScript puro)
- Tailwind CSS (tokens de design em `tailwind.config.js`)
- React Router v6
- react-leaflet + OpenStreetMap (sem chave de API)
- lucide-react (ícones) · Plus Jakarta Sans (Google Fonts)
- vite-plugin-pwa (manifest + service worker, funciona offline)

## Rodando

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # gera dist/ com o PWA (sw.js + manifest)
npm run preview    # serve o build de produção
```

## Telas

| Rota | Tela |
| --- | --- |
| `/` | Nível do rio (gauge de 4 faixas), botão de emergência, atalhos |
| `/meu-bairro` | Cota de alagamento por bairro + checklist "Prepare sua saída" |
| `/abrigos` | Mapa Leaflet + lista com filtros (split-view no desktop) |
| `/abrigos/:id` | Detalhe do abrigo: vagas, estrutura, "Estou indo" |
| `/alimentacao` | Abas "Onde comer" / "Quero ajudar" (doações) |
| `/oferecer-abrigo` | Formulário em 6 etapas com stepper + protocolo |
| `/el-nino` | Conteúdo educativo + espaço do assistente de IA (placeholder) |
| `/menu` | Atalhos e telefones de emergência (199 · 193 · 192) |

Truques de demonstração:

- `/abrigos?demo=vazio` mostra o estado "Nenhum abrigo aberto".
- Ficar sem internet (ou simular offline no DevTools) ativa o banner
  "Sem conexão" e a tela inicial offline com os telefones de emergência.