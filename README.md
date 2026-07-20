# Estoque Inteligente — Client (v1)

Front-end web **app-first** da fatia atual da API: autenticação local + produtos.

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
| `/login` | Login e-mail/senha |
| `/cadastro` | Cadastro |
| `/dashboard` | Resumo ok/low/out + atalhos |
| `/produtos` | Lista em cards + filtros |
| `/produtos/novo` | Cadastro manual |
| `/produtos/:id` | Detalhe, baixa, marcar acabou, histórico |
| `/minha-conta` | Perfil, senha, logout |

## Ainda não nesta fatia

Login Google/Apple, intake/baixa por IA, lista paper, chat, financeiro, PWA completa.
