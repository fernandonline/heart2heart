# Heart2Heart (em desenvolvimento)

Plataforma para expressar seu carinho através de cartões digitais compartilháveis via QR Code.

## Sobre o projeto

Permite que pessoas criem mensagens personalizadas com:
- Upload de imagem
- Mensagem personalizada
- Link único compartilhável
- QR Code para compartilhamento físico

Quem cria precisa fazer login. Quem recebe acessa diretamente pelo link, sem cadastro.

## Tecnologias

- **Frontend:** Nuxt 4, Vue 3
- **Backend:** Nuxt Server Routes, Mongoose
- **Banco de dados:** MongoDB
- **Autenticação:** OAuth Google
- **Upload de imagens:** Cloudinary

## Pré-requisitos

- Node.js 18+
- MongoDB Atlas
- Credenciais OAuth do Google Cloud
- Conta no Cloudinary

## Como rodar localmente

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/heart2heart.git
cd heart2heart
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:
```env
MONGODB_URI=sua_string_de_conexao_mongodb
NUXT_OAUTH_GOOGLE_CLIENT_ID=seu_client_id
NUXT_OAUTH_GOOGLE_CLIENT_SECRET=seu_client_secret
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_UPLOAD_PRESET=seu_preset
NUXT_PUBLIC_SITE_URL=http://localhost:3000
```

Em produção, defina `NUXT_PUBLIC_SITE_URL` como a URL HTTPS pública do site.

### 4. Configure o OAuth do Google

- Acesse o [Google Cloud Console](https://console.cloud.google.com)
- Crie um projeto
- Ative a Google+ API
- Crie credenciais OAuth 2.0
- Adicione `http://localhost:3000/auth/google` como URI de redirecionamento

### 5. Rode o projeto
```bash
npm run dev
```

Acesse em `http://localhost:3000`

## Estrutura do projeto
```
heart2heart/
├── server/
│   ├── api/
│   │   ├── cards/
│   │   │   ├── create.post.ts       # Criar card
│   │   │   ├── meus.get.ts          # Listar meus cards
│   │   │   └── [publicId].get.ts    # Ver card público
│   │   └── auth/
│   │       └── logout.post.ts       # Logout
│   ├── models/
│   │   ├── User.ts                  # Model do usuário
│   │   └── Card.ts                  # Model do card
│   ├── routes/
│   │   └── auth/
│   │       └── google.get.ts        # OAuth Google
│   ├── utils/
│   │   ├── mongoose.ts              # Conexão MongoDB
│   │   └── generatePublicId.ts      # Gera ID único
│   └── types/
│       └── session.d.ts             # Tipos da sessão
├── pages/
│   ├── index.vue                    # Página inicial
│   ├── form.vue                     # Criar card (3 etapas)
│   ├── dashboard.vue                # Listar meus cards
│   └── card/
│       └── [id].vue                 # Visualizar card público
├── components/
│   ├── formImage.vue                # Etapa 1: Upload
│   ├── formDados.vue                # Etapa 2: Dados
│   └── formMessage.vue              # Etapa 3: Mensagem
└── nuxt.config.ts
```

## Keys

https://gist.github.com/fernandonline