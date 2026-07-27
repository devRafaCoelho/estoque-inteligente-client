# Estoque Inteligente — Client

Front-end web **app-first**: autenticação, estoque, entrada/baixa por texto e voz, lista de compras, financeiro, notificações in-app e chat com assistente (tools + CTAs).

A visão completa do produto (OCR, NF-e, push, etc.) está em [`DOCUMENTACAO.md`](../DOCUMENTACAO.md) na raiz do monorepo — este README descreve **o que o client entrega hoje**.

## Stack

- React 18 + Vite 5
- Material UI 6 + Nunito (+ Caveat no modo paper)
- react-router-dom
- react-hook-form + yup
- notistack
- Web Speech API (STT pt-BR no browser)
- PWA básico (Vite PWA / manifesto)

## Como rodar

Com a API em `http://localhost:3001`:

```bash
cd estoque-inteligente-client
npm install
npm run dev
```

Abre em **http://localhost:5173**. Em dev, o Vite faz proxy de `/api` para a API (deixe `VITE_API_BASE_URL` vazio).

## Telas entregues

| Rota | Função |
|------|--------|
| `/login` | Login e-mail/senha + Google/Apple (se configurados) |
| `/cadastro` | Cadastro local + atalho social |
| `/dashboard` | Resumo ok/low/out, card do assistente e atalhos |
| `/entrada` | Entrada por texto, voz ou foto do cupom + rascunhos |
| `/entrada/:id/preview` | Conferir itens, preço opcional e confirmar no estoque |
| `/baixa` | Baixa por texto/voz (consumo) + rascunhos |
| `/baixa/:id/preview` | Conferir e confirmar baixa |
| `/lista-compras` | Lista por regras, add por texto/voz, modos lista/paper |
| `/chat` | Assistente: perguntas, proposta de baixa/lista, dicas financeiras |
| `/financeiro` | Gastos do mês, série do ano, categorias e dicas |
| `/notificacoes` | Alertas in-app (estoque baixo/zerado, recompra, nudges) |
| `/produtos` | Lista em cards + filtros |
| `/produtos/novo` | Cadastro manual |
| `/produtos/:id` | Detalhe, baixa, marcar acabou, histórico |
| `/minha-conta` | Perfil, senha, preferências, vincular Google/Apple, logout |

## Fase 2 já no client (Sprints 1–3)

| Área | O que há |
|------|----------|
| **Recompra / nudges** | Preferências e handlers de notificação (deep link produto / baixa) |
| **Voz** | `SpeechTextField` + `useSpeechToText` em entrada, baixa, lista e chat; fallback para teclado |
| **Foto / OCR** | `/entrada` Texto \| Voz \| Foto; “Lendo cupom…”; erros com retry / usar texto |
| **Chat** | UI conversacional, cards de proposta com CTA (Revisar baixa / Salvar lista / Ver financeiro) |
| **Composer** | Campo compacto com mic + seta de envio nos fluxos de texto |

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

## Fora desta entrega

QR de NF-e, push/e-mail, compartilhar lista, conta familiar, STT no servidor (Whisper/Gemini). Roadmap em `DOCUMENTACAO.md`.
