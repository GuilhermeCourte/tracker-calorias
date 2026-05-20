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

## Configurando o Firebase

1. Crie um projeto em <https://console.firebase.google.com>.
2. Em **Build → Authentication → Sign-in method**, habilite **Email/Password**.
3. Em **Build → Firestore Database**, crie o banco no modo **production** (as regras de
   segurança virão na Etapa 10).
4. Em **Project settings → General → Your apps**, registre um **app Web** e copie as
   chaves do `firebaseConfig`.
5. Cole as chaves em `.env.local` seguindo o mapeamento de `.env.example`.

## Variáveis de ambiente

Veja `.env.example`. Todas as chaves Firebase Web são `NEXT_PUBLIC_*` (executam no
cliente — esse é o comportamento esperado do Firebase Web SDK; a proteção real fica nas
regras do Firestore).