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
3. Em **Build → Firestore Database**, crie o banco no modo **production**.
4. Em **Project settings → General → Your apps**, registre um **app Web** e copie as
   chaves do `firebaseConfig`.
5. Cole as chaves em `.env.local` seguindo o mapeamento de `.env.example`.
6. Publique as regras de segurança (`firestore.rules`) — veja seção abaixo.

## Regras de segurança Firestore

O arquivo `firestore.rules` contém as regras de produção:

- Cada usuário só lê/escreve documentos sob `users/{uid}/**`
- Validação de tipos e ranges (calorias 0–20000, meta 500–10000, etc.)
- `delete` no doc raiz `users/{uid}` proibido (preserva o vínculo)
- `default deny` em todo o resto

**Publicar via Console** (mais simples):

1. Firebase Console → **Build → Firestore Database → Rules**
2. Copie o conteúdo de `firestore.rules`, cole no editor, clique **Publish**

**Publicar via CLI** (alternativa):

```bash
npm install -g firebase-tools
firebase login
firebase use <seu-project-id>
firebase deploy --only firestore:rules
```

O `firebase.json` já está configurado apontando pro `firestore.rules`.

## Variáveis de ambiente

Veja `.env.example`. Todas as chaves Firebase Web são `NEXT_PUBLIC_*` (executam no
cliente — esse é o comportamento esperado do Firebase Web SDK; a proteção real fica nas
regras do Firestore).