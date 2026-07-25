# Estoque Inteligente — Client (Fase 1)

Front-end web **app-first** da Fase 1: autenticação, estoque, entrada/baixa por texto, lista de compras, financeiro e notificações in-app.

A visão completa do produto (chat, OCR, NF-e, etc.) está em [`DOCUMENTACAO.md`](../DOCUMENTACAO.md) na raiz do monorepo — este README descreve **o que o client entrega hoje**.

## Stack

- React 18 + Vite 5
- Material UI 6 + Nunito
- react-router-dom
- react-hook-form + yup
- notistack
- PWA básico (Vite PWA / manifesto)

## Como rodar

Com a API em `http://localhost:3001`:

```bash
cd estoque-inteligente-client
npm install
npm run dev
```

Abre em **http://localhost:5173**. Em dev, o Vite faz proxy de `/api` para a API (deixe `VITE_API_BASE_URL` vazio).

## Telas da Fase 1

| Rota | Função |
|------|--------|
| `/login` | Login e-mail/senha + Google/Apple (se configurados) |
| `/cadastro` | Cadastro local + atalho social |
| `/dashboard` | Resumo ok/low/out + atalhos |
| `/entrada` | Entrada por texto (compra) + rascunhos |
| `/entrada/:id/preview` | Conferir itens, preço opcional e confirmar no estoque |
| `/baixa` | Baixa por texto (consumo) |
| `/baixa/:id/preview` | Conferir e confirmar baixa |
| `/lista-compras` | Lista gerada por regras + modo lista/paper |
| `/financeiro` | Gastos do mês, série do ano, categorias e dicas |
| `/notificacoes` | Alertas in-app (estoque baixo/zerado, nudges) |
| `/produtos` | Lista em cards + filtros |
| `/produtos/novo` | Cadastro manual |
| `/produtos/:id` | Detalhe, baixa, marcar acabou, histórico |
| `/minha-conta` | Perfil, senha, preferências, vincular Google/Apple, logout |

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

## Fora desta entrega (Fase 2+)

Chat, foto/OCR, QR de NF-e, push, compartilhar lista, conta familiar. Detalhes e roadmap em `DOCUMENTACAO.md`.
