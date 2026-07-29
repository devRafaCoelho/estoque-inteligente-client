# Estoque Inteligente — Client

Front-end web **app-first**: autenticação, estoque, entrada/baixa por texto e voz, foto/OCR, QR NF-e, lista de compras, financeiro, notificações in-app, **Web Push (PWA)**, e-mail de reset/boas-vindas e chat com assistente (tools + CTAs).

A visão completa do produto está em [`DOCUMENTACAO.md`](../DOCUMENTACAO.md) na raiz do monorepo — este README descreve **o que o client entrega hoje** (Fases 1 e 2).

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
| `/lista-compras` | Lista por regras, add por texto/voz, modos lista/paper |
| `/chat` | Assistente: perguntas, proposta de baixa/lista, dicas financeiras |
| `/financeiro` | Gastos do mês, série do ano, categorias e dicas |
| `/notificacoes` | Alertas in-app (estoque baixo/zerado, recompra, nudges) |
| `/produtos` | Lista em cards + filtros |
| `/produtos/novo` | Cadastro manual (`repurchaseDays` opcional) |
| `/produtos/:id` | Detalhe, baixa, marcar acabou, histórico |
| `/minha-conta` | Perfil, senha, preferências de alerta/push/quiet hours/digest, social, logout |

## Fase 2 no client (Sprints 1–6)

| Área | O que há |
|------|----------|
| **Recompra / nudges** | `repurchaseDays` no produto; preferências; handlers de notificação (deep link produto / baixa) |
| **Voz** | `SpeechTextField` + `useSpeechToText` em entrada, baixa, lista e chat; fallback para teclado |
| **Foto / OCR** | `/entrada` Texto \| Foto \| Manual; câmera, galeria |
| **QR NF-e** | Na aba Foto → QR; se a SEFAZ falhar, fallback para foto/OCR |
| **Chat** | UI conversacional, cards de proposta com CTA (Revisar baixa / Salvar lista / Ver financeiro) |
| **Composer** | Campo compacto com mic + seta de envio nos fluxos de texto |
| **Web Push** | Toggle em Minha Conta; SW recebe `push` e abre `/notificacoes` |
| **Quiet hours** | Início/fim do silêncio nas preferências (API deixa de enviar push/digest à noite) |
| **E-mail auth** | Fluxos `/esqueci-senha` e `/resetar-senha` |
| **Digest** | Opt-in “Receber digest por e-mail” em Minha Conta |

Arquitetura de pastas: `pages/` (telas), `components/` (UI reutilizável), `hooks/`, `services/` → `apiClient`. Detalhes em [`FRONTEND.md`](../FRONTEND.md).

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

Voz depende do suporte do navegador à Web Speech API (melhor em Chrome/Edge). Sem mic/permissão, o teclado segue disponível.

Push depende de HTTPS (ou localhost), permissão do navegador e VAPID configurado na API.

## Fora desta entrega

Compartilhar lista, conta familiar, STT no servidor (Whisper/Gemini), mais UFs no collector NF-e, push nativo (React Native), modo offline completo. Roadmap em `DOCUMENTACAO.md` (Fases 3–4).
