# Calorias & Jejum

Aplicação web para acompanhamento de consumo calórico e jejum intermitente. Trabalho final
da disciplina — Senac 2026/1 TSI DSW.

> ⚠️ **Aviso**: este aplicativo é um exercício acadêmico e não substitui orientação médica
> ou nutricional.

## Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Auth**: Firebase Authentication (e-mail/senha)
- **Banco de dados**: Cloud Firestore
- **UI**: Tailwind CSS v4 + shadcn/ui
- **Validação**: Zod
- **Gráficos**: Recharts
- **Deploy**: Vercel

## Setup local

```bash
npm install
cp .env.example .env.local   # preencha as variáveis após criar o projeto Firebase
npm run dev
```

Abra <http://localhost:3000>.

## Variáveis de ambiente

Veja `.env.example`. Todas as chaves Firebase Web são `NEXT_PUBLIC_*` (executam no cliente).