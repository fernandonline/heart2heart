# Heart2Heart

Projeto pessoal em desenvolvimento para criar cartões digitais com imagem e mensagem, compartilhados por link. O criador entra com Google; o destinatário não precisa de conta.

## Stack

Nuxt 4, Vue 3, TypeScript, MongoDB/Mongoose, OAuth Google e Cloudinary.

## Requisitos

- Node.js 22.21.x, 24.11+ ou 26+
- MongoDB
- Credenciais OAuth do Google
- Conta Cloudinary

## Executar localmente

1. Clone o repositório e entre na pasta:

   ```sh
   git clone https://github.com/fernandonline/heart2heart.git
   cd heart2heart
   ```

2. Instale as dependências:

   ```sh
   npm install
   ```

3. Crie `.env` na raiz:

   ```env
   MONGODB_URI=
   NUXT_OAUTH_GOOGLE_CLIENT_ID=
   NUXT_OAUTH_GOOGLE_CLIENT_SECRET=
   CLOUDINARY_CLOUD_NAME=
   CLOUDINARY_UPLOAD_PRESET=
   NUXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. Configure `http://localhost:3000/auth/google` como URI de callback do OAuth Google.
5. Inicie o Nuxt:

   ```sh
   npm run dev
   ```

Abra `http://localhost:3000`. Para validar o build, execute `npm run build`.

Nunca coloque credenciais privadas ou valores reais de `.env` no Git. Em produção, configure `NUXT_PUBLIC_SITE_URL` com a URL HTTPS pública do site.

## Documentação

- [Arquitetura](docs/architecture.md)
- [Convenções](docs/conventions.md)
- [Decisões de arquitetura (ADRs)](docs/decisions/)
