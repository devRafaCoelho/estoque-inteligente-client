# Estoque Inteligente — Client

Front-end web **mobile-first** (PWA) do Estoque Inteligente: autenticação, estoque, entrada e baixa, lista de compras, financeiro, chat, notificações, Web Push e conta familiar.

Consome a API em `estoque-inteligente-service-api`.

## Stack

| Item | Tecnologia |
|------|------------|
| UI | React 18 + Vite 5 |
| Componentes | Material UI 6 + Emotion |
| Fontes | Nunito (app) + Caveat (modo paper da lista) |
| Rotas | react-router-dom 6 |
| Formulários | react-hook-form + yup |
| Feedback | notistack |
| QR | `@zxing/browser` |
| OAuth UI | Google Identity (GIS) / botão Apple quando configurado |
| PWA / Push | `vite-plugin-pwa` + `src/sw.js` (injectManifest) |
| Voz | Web Speech API (pt-BR no browser) |

## Arquitetura

```
pages/          # telas por domínio
components/     # UI reutilizável
hooks/          # lógica de tela / speech / notificações
context/        # AuthContext (sessão)
services/       # apiClient + clientes por domínio
utils/          # NF, erros, Google Identity, etc.
config/         # constantes, tema
```

Fluxo típico de mutação de estoque: **captura (texto/voz/foto/QR) → chamada de parse na API → preview → confirmar**.

## Como rodar

1. API local em `http://localhost:3001` **ou** API remota (ex.: Render).
2. Configure o `.env` (veja abaixo).
3. Instale e suba:

```bash
npm install
npm run dev
```

Abre em **http://localhost:5173**.

| Cenário | `VITE_API_BASE_URL` |
|---------|---------------------|
| API local | vazio — o Vite faz proxy de `/api` → `localhost:3001` |
| API remota | URL absoluta da API (sem barra no final), ex. `https://…onrender.com` |

Outros scripts:

```bash
npm run build      # build de produção
npm run preview    # serve o build
```

> Após mudar o service worker / PWA, faça hard refresh (`Ctrl+Shift+R`).

## Variáveis de ambiente

Copie `.env.example` → `.env`:

```env
VITE_API_BASE_URL=
VITE_GOOGLE_CLIENT_ID=
VITE_APPLE_CLIENT_ID=
VITE_APPLE_REDIRECT_URI=http://localhost:5173
```

| Variável | Uso |
|----------|-----|
| `VITE_API_BASE_URL` | Base da API; vazio = proxy em dev |
| `VITE_GOOGLE_CLIENT_ID` | Exibe login Google (mesmo Client ID da API) |
| `VITE_APPLE_CLIENT_ID` / `VITE_APPLE_REDIRECT_URI` | Login Apple (quando configurado) |

Sem Client IDs sociais, os botões ficam ocultos e o login e-mail/senha segue normal.

Em produção (ex.: Vercel), defina as mesmas `VITE_*` no painel e faça **redeploy** (elas entram no build).

## Rotas da aplicação

| Rota | Função |
|------|--------|
| `/login` | E-mail/senha + Google/Apple |
| `/cadastro` | Cadastro local |
| `/esqueci-senha` / `/resetar-senha` | Fluxo de reset |
| `/dashboard` | Resumo do estoque e atalhos |
| `/entrada` | Texto, foto/QR, manual + rascunhos |
| `/entrada/:id/preview` | Revisar e confirmar compra |
| `/baixa` | Consumo por texto/voz + rascunhos |
| `/baixa/:id/preview` | Revisar e confirmar baixa |
| `/produtos` | Lista em cards + filtros |
| `/produtos/novo` | Cadastro manual |
| `/produtos/:id` | Detalhe, baixa, marcar acabou, histórico |
| `/lista-compras` | Lista, paper, share, estimativa de gasto |
| `/lista-compartilhada/:token` | Visualização pública controlada |
| `/chat` | Assistente com CTAs para preview |
| `/financeiro` | Gastos, categorias, série, dicas |
| `/notificacoes` | Centro de alertas |
| `/minha-conta` | Perfil, preferências, push, quiet hours, família |
| `/conta-familiar/convite` | Aceite de convite |

## Funcionalidades (visão técnica)

- **Sessão:** JWT em `sessionStorage` via `apiClient`; `AuthContext` hidrata o usuário.
- **Entrada/baixa:** serviços de intake/stock-out; preview obrigatório antes de confirmar.
- **Voz:** `SpeechTextField` / hooks de STT no browser (Chrome/Edge melhores).
- **NF-e:** leitura de QR/chave; se UF não suportada ou SEFAZ falhar, UI sugere foto.
- **Lista:** modos lista/paper; compartilhar gera link; estimativa usa `avg_unit_price`.
- **Família:** criar casa, convidar, aceitar; estoque/lista no escopo da casa.
- **Push:** toggle em Minha conta; SW escuta `push` e navega para notificações (HTTPS ou localhost; VAPID na API).
- **Proxy Vite:** em `vite.config` o `/api` local evita CORS em desenvolvimento.

## Como testar

```bash
# Teste de lógica de share (sem browser)
npm run test:shopping-share

# Manual sugerido
# 1. API no ar (local ou Render com CORS incluindo http://localhost:5173)
# 2. npm run dev
# 3. Cadastro/login → entrada texto → preview → confirmar
# 4. Lista, baixa, chat, Minha conta (preferências / família)
```

Para Google em localhost: origem `http://localhost:5173` autorizada no Google Cloud Console e o mesmo Client ID na API e no client.

## Estrutura de pastas (resumo)

```
src/
  pages/          # por domínio (auth, products, shopping, …)
  components/     # intake, shopping, auth, layout, …
  services/       # apiClient + *Service.js
  hooks/ context/ utils/ config/
  sw.js           # service worker (push)
tests/
```

## Integração com a API

- Em erros HTTP, `ApiError` expõe `status` e `body` (mensagens/`details` da API).
- Rotas públicas (login, share, aceite de convite) vs rotas autenticadas (Bearer JWT).
- Preferências (push, quiet hours, digest) espelham `GET/PATCH /api/users/me/preferences`.
