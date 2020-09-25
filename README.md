# labook-backend
Repositório do projeto Labook

O LaBook é uma rede social com o objetivo de promover a conexão e interação entre seus mais diversos usuários. Os usuários podem criar posts de dois tipos ("evento" ou "normal"), comentá-los e curti-los também.

### 1. Cadastro
    Envia name, email, password e device e recebe access_token e refresh_token.

### 2. Login
    Envia email, password e device e recebe access_token e refresh_token.

### 3. Friend
    Envia token e userId e recebe mensagem de sucesso ou erro.

### 4. Unfriend
    Envia token e userId e recebe mensagem de sucesso ou erro.

### 5. Create Post
    Envia photo, description, created_at e post_type ("normal", "event") e recebe mensagem de sucesso ou erro.

### 6. All Feed
    Envia token e recebe posts de amigos ordenados por created_at

### 7. Feed By Post Type
    Envia post_type e recebe todos os posts desse tipo ("NORMAL" ou "EVENT)
    
### 8. Like Post
    Envia o token e o post_id  e recebe mensagem de sucesso ou erro.

### 9. Unlike Post
    Envia o token e o post_id e recebe mensagem de sucesso ou erro.

### 10. Comment Post
    Envia post_id e comment_message e recebe mensagem de sucesso ou erro.

### 11. Feed Page 
    Limite de 5 posts por página

### 13. Search Post
    Busca por query, orderBy, orderType & page

### 14. Delete
    Deleta usuário, post ou comentário por id de cada e recebe mensagem de sucesso ou erro.