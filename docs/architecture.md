# Arquitetura

## Visão geral

Aplicação Nuxt 4 em um único repositório. `app/` contém a interface Vue; `server/` contém rotas Nitro, endpoints, modelos Mongoose e utilitários.

```text
Navegador
  ├─ páginas e componentes Vue (app/)
  ├─ OAuth e API Nitro (server/)
  ├─ MongoDB (usuários e cartões)
  └─ Cloudinary (upload de imagens feito pelo frontend)
```

## Fluxos

### Login

1. O usuário inicia o login Google pela rota `/auth/google`.
2. O callback OAuth cria a sessão via `nuxt-auth-utils` e redireciona ao dashboard.
3. `/auth/logout` encerra a sessão.

### Criar cartão

1. O formulário coleta imagem, título, data e mensagem.
2. O navegador envia a imagem diretamente ao Cloudinary com o nome da conta e preset públicos.
3. O navegador envia a URL da imagem e os dados do cartão a `POST /api/cards/create`.
4. A API exige sessão, localiza/cria o usuário por `googleId`, valida os dados e grava o cartão no MongoDB.
5. O cartão recebe um identificador público criptograficamente aleatório. Sua URL usa `NUXT_PUBLIC_SITE_URL`.

### Ler, listar e excluir cartões

- `GET /api/cards/mycard` exige sessão e lista cartões ativos do usuário autenticado.
- `GET /api/cards/:publicId` retorna os dados públicos de um cartão ativo; o link não exige login.
- `DELETE /api/cards/:id` exige sessão, valida o ObjectId e verifica propriedade. A exclusão é lógica (`active: false`, `deletedAt`).

## Dados

- **User:** `googleId`, e-mail, nome e URL da foto; timestamps Mongoose.
- **Card:** referência ao usuário, `publicId`, URL da imagem, título, data, mensagem e estado de exclusão; timestamps Mongoose.
- O e-mail ainda é salvo em texto puro. A mudança para HMAC está pendente; ver `.ai/todo.md`.

## Serviços e configuração

- MongoDB: `MONGODB_URI` (somente servidor).
- OAuth Google: `NUXT_OAUTH_GOOGLE_CLIENT_ID` e `NUXT_OAUTH_GOOGLE_CLIENT_SECRET`.
- Cloudinary: `CLOUDINARY_CLOUD_NAME` e `CLOUDINARY_UPLOAD_PRESET`, expostos ao frontend e públicos.
- URL pública dos links: `NUXT_PUBLIC_SITE_URL`; em produção deve ser HTTPS. Desenvolvimento usa `http://localhost:3000` como fallback.

## Estado conhecido

O dashboard e o fluxo de QR Code ainda estão em desenvolvimento. A página pública do cartão busca dados no cliente, sem SSR e sem metadados sociais. O controle “QR code” do dashboard ainda aponta para o link do cartão.
