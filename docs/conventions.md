# Convenções de desenvolvimento

## Estrutura e rotas

- Páginas, layouts e componentes Vue ficam em `app/`.
- Endpoints Nitro ficam em `server/api/`; sufixos como `.get.ts`, `.post.ts` e `.delete.ts` definem o método HTTP.
- Rotas OAuth ficam em `server/routes/`.
- Modelos Mongoose ficam em `server/models/`.
- Ao importar arquivos, preserve exatamente a capitalização do nome para compatibilidade com Linux.

## Código

- O projeto usa Vue SFC e Nuxt auto-imports; TypeScript já é usado em parte dos componentes e rotas.
- Há aliases `@` e `~` no código existente; siga o padrão do arquivo/contexto próximo e evite mudanças de imports não relacionadas.
- Validação manual disponível: `npm run build`.

## Ainda não definido

### Formatador, linter e estilo automático

### Estratégia e ferramenta de testes

### Política de nomes e formatação

### Convenção de branches e mensagens de commit
