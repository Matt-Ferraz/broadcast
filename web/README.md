# Broadcast

Plataforma SaaS para gerenciamento de conexões, contatos e envio de mensagens em massa com agendamento.

## Tecnologias

- **Frontend:** React 18, TypeScript, Vite, Material UI v5, Tailwind CSS v3
- **Backend:** Firebase Auth, Firestore, Firebase Functions v2
- **Formulários:** React Hook Form
- **Roteamento:** React Router DOM v6
- **Datas:** date-fns

## Estrutura de pastas

```
web/src/
├── components/   # Componentes reutilizáveis
├── contexts/     # Contextos globais (ex: AuthContext)
├── hooks/        # Hooks customizados
├── lib/          # Configuração do Firebase
├── pages/        # Páginas da aplicação
├── services/     # Acesso ao Firestore
└── types/        # Tipagem
```

## Como rodar localmente

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/broadcast.git
cd broadcast/web
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Abra o arquivo `.env` e preencha com os valores do seu projeto Firebase:

| Variável | Onde encontrar |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase Console → Configurações do projeto → Seus apps |
| `VITE_FIREBASE_AUTH_DOMAIN` | idem |
| `VITE_FIREBASE_PROJECT_ID` | idem |
| `VITE_FIREBASE_STORAGE_BUCKET` | idem |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | idem |
| `VITE_FIREBASE_APP_ID` | idem |

> **Pré-requisitos no Firebase Console:**
> - Authentication com **E-mail/senha** habilitado
> - Firestore Database criado (modo produção)
> - Plano **Blaze** ativo (necessário para Firebase Functions)

### 4. Rode o projeto

```bash
npm run dev
```

## Deploy

O projeto é hospedado no Firebase Hosting. Para fazer o deploy:

```bash
npm run build
firebase deploy
```
