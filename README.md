# Estoque Inteligente — Client

Front-end web **app-first**: autenticação, estoque, entrada/baixa por texto e voz, foto/OCR, QR NF-e, lista de compras (share + estimativa), financeiro, notificações in-app, **Web Push (PWA)**, conta familiar e chat com assistente.

Visão de produto: [`../documentacoes/DOCUMENTACAO.md`](../documentacoes/DOCUMENTACAO.md). Este README descreve **como rodar o client**.

## Stack

- React 18 + Vite 5
- Material UI 6 + Nunito (+ Caveat no modo paper)
- react-router-dom
- react-hook-form + yup
- notistack
- Web Speech API (STT pt-BR no browser)
- PWA com service worker custom (`src/sw.js` via Vite PWA / injectManifest) para Web Push

## Como rodar

Com a API em `http://localhost:3001`:

```bash
cd estoque-inteligente-client
npm install
npm run dev
```

Abre em **http://localhost:5173**. Em dev, o Vite faz proxy de `/api` para a API (deixe `VITE_API_BASE_URL` vazio).

> Push em desenvolvimento: o service worker fica ativo também no `npm run dev`. Após mudar a PWA, faça hard refresh (`Ctrl+Shift+R`).

## Telas entregues

| Rota | Função |
|------|--------|
| `/login` | Login e-mail/senha + Google/Apple (se configurados) |
| `/cadastro` | Cadastro local + atalho social |
| `/esqueci-senha` | Pedido de reset de senha |
| `/resetar-senha` | Nova senha via token do e-mail (`?token=`) |
| `/dashboard` | Resumo ok/low/out, card do assistente e atalhos |
| `/entrada` | Entrada: Texto \| Foto \| Manual (+ rascunhos IA / QR) |
| `/entrada/:id/preview` | Conferir itens, preço opcional e confirmar no estoque |
| `/baixa` | Baixa por texto/voz (consumo) + rascunhos |
| `/baixa/:id/preview` | Conferir e confirmar baixa |
| `/lista-compras` | Lista por regras, share, estimativa, modos lista/paper |
| `/lista-compartilhada/:token` | Lista compartilhada (visão controlada) |
| `/chat` | Assistente: perguntas, proposta de baixa/lista/compra, dicas |
| `/financeiro` | Gastos do mês, série do ano, categorias e dicas |
| `/notificacoes` | Alertas in-app (estoque baixo/zerado, recompra, nudges) |
| `/produtos` | Lista em cards + filtros |
| `/produtos/novo` | Cadastro manual (`repurchaseDays` opcional) |
| `/produtos/:id` | Detalhe, baixa, marcar acabou, histórico |
| `/minha-conta` | Perfil, preferências, push, quiet hours, digest, conta familiar |
| `/conta-familiar/convite` | Aceite de convite familiar |

Arquitetura: `pages/` → `components/` → `hooks/` → `services/` → `apiClient`. Visão geral em [`../documentacoes/FRONTEND.md`](../documentacoes/FRONTEND.md).

## Variáveis de ambiente

Copie `.env.example` → `.env`:

```env
# Em dev deixe vazio para usar o proxy do Vite (/api → localhost:3001)
VITE_API_BASE_URL=

VITE_GOOGLE_CLIENT_ID=
VITE_APPLE_CLIENT_ID=
VITE_APPLE_REDIRECT_URI=http://localhost:5173
```

Sem Client IDs, os botões sociais ficam ocultos e o login local continua normal.

Voz depende do suporte do navegador à Web Speech API (melhor em Chrome/Edge). Push depende de HTTPS (ou localhost), permissão do navegador e VAPID na API.

## Próximos passos

Landing page de marketing, app nativo nas lojas, offline parcial, etc. — [`../documentacoes/PROXIMOS-PASSOS.md`](../documentacoes/PROXIMOS-PASSOS.md).
