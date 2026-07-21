# Estoque Inteligente — Client (v1)

Front-end web **app-first** da fatia atual da API: autenticação local + produtos + entrada por texto.

## Stack

- React 18 + Vite 5
- Material UI 6 + Nunito
- react-router-dom
- react-hook-form + yup
- notistack

## Como rodar

Com a API em `http://localhost:3001`:

```bash
cd estoque-inteligente/estoque-inteligente-client
npm install
npm run dev
```

Abre em **http://localhost:5173**. O Vite faz proxy de `/api` para a API.

## Telas desta fatia

| Rota | Função |
|------|--------|
| `/login` | Login e-mail/senha + Google/Apple (se configurados) |
| `/cadastro` | Cadastro + atalho social |
| `/dashboard` | Resumo ok/low/out + atalhos |
| `/entrada` | Entrada por texto (interpretar compra) |
| `/entrada/:id/preview` | Conferir itens e confirmar no estoque |
| `/baixa` | Baixa por texto (interpretar consumo) |
| `/baixa/:id/preview` | Conferir e confirmar baixa |
| `/lista-compras` | Lista de compras (regras + modo paper) |
| `/produtos` | Lista em cards + filtros |
| `/produtos/novo` | Cadastro manual |
| `/produtos/:id` | Detalhe, baixa, marcar acabou, histórico |
| `/minha-conta` | Perfil, senha, vincular Google/Apple, logout |

## OAuth no front

Preencha no `.env` (e reinicie o Vite):

```
VITE_GOOGLE_CLIENT_ID=...
VITE_APPLE_CLIENT_ID=...
VITE_APPLE_REDIRECT_URI=http://localhost:5173
```

Sem Client IDs, os botões sociais ficam ocultos e o login local continua normal.

## Ainda não nesta fatia

Chat, QR/foto, PWA completa, centro de notificações.
