# labook-backend
Repositório do projeto Labook

O LaBook é uma rede social com o objetivo de promover a conexão e interação entre seus mais diversos usuários. Os usuários podem criar posts de dois tipos ("evento" ou "normal"), comentá-los e curti-los também.

### 1. Cadastro
    Name, email, password --> token

### 2. Login
    Email, password --> token

### 3. Friend
    token, userId

### 4. Unfriend
    checkFriendship, token, userId

### 5. Create Post
    Photo, descriptions, created_at, post_type ("normal", "event").

### 6. All Feed
    Friends posts orderedBy created_at

### 7. Feed By Post Type
    post_type --> all posts
    
### 8. Like Post
    checkIfLiked, post_id --> success or error

### 9. Unlike Post
    checkIfLiked, post_id --> success or error

### 10. Comment Post
    post_id, comment_message 

### 11. Feed Page 
    Limit 5 Posts

### 12. Refresh Token
    access_token & refresh_token

### 13. Search Post
    by query, orderBy, orderType & page

### 14. Delete
    user, post or comment