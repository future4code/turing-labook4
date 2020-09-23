import { Post, PostAndUserNameOutputDTO, SearchPostDTO } from "../model/Post";
import { BaseDatabase } from "./BaseDatabase";

export class PostDatabase extends BaseDatabase {
    private static TABLE_NAME = 'labook_posts';
  
    public async createPost(post_id: string, photo: string, description: string, created_at: string, post_type: POST_TYPE, author_id: string): Promise<void> {
      await this.getConnection()
        .insert({
            post_id,
            photo,
            description,
            created_at,
            post_type,
            author_id
        }).into(PostDatabase.TABLE_NAME)
    }
  
    public async getPostById(postId: string): Promise<Post> {
      const result = await this.getConnection()
        .select('*')
        .from(PostDatabase.TABLE_NAME)
        .where({ post_id: postId });
  
      return Post.toPostModel(result[0]);
    }
  
    public async getPostByUserId(authorId: string): Promise<Post[]> {
      const result = await this.getConnection()
        .select('*')
        .from(PostDatabase.TABLE_NAME)
        .where({ author_id: authorId });
  
      const posts: Post[] = [];
  
      for (let post of result) {
        posts.push(Post.toPostModel(post));
      }
  
      return posts;
    }
  
    public async getPostInfoAndUserName(): Promise<PostAndUserNameOutputDTO[]> {
  
      const result = await this.getConnection().raw(`
      SELECT *, u.id, u.name
      FROM labook_posts p
      JOIN labook_users u
      ON p.author_id = u.id;
      `);
  
      const recipes: PostAndUserNameOutputDTO[] = [];
      for(let post of result[0]){
        recipes.push({
           post_id: post.post_id,
           photo: post.photo,
           description: post.description,
           created_at: post.created_at,
           post_type: post.post_type,
           author_id: post.author_id
        });
      }  
      
      return recipes;  
    }
  
    public async searchPost(searchData: SearchPostDTO): Promise<PostAndUserNameOutputDTO[]> {
        try {
            const resultsPerPage: number = 5
            const offset: number = resultsPerPage * (searchData.page - 1)

            const result = await this.getConnection().raw(`
            SELECT * FROM ${PostDatabase.TABLE_NAME} p
            WHERE description LIKE "%${searchData.description.toLocaleLowerCase()}%"
            ORDERBY ${searchData.orderBy} ${searchData.orderType}
            LIMIT BY ${resultsPerPage}
            OFFSET ${offset}
            `);
            
            return result[0];  
        } catch(err) {
            throw new Error(err.sqlMessage)
        }
    }
    
    public async deletePost(post_id: string): Promise<void> {
        await this.getConnection()
        .del()
        .from(PostDatabase.TABLE_NAME)
        .where({ post_id });
    }
}

export enum POST_TYPE {
    "NORMAL" = "NORMAL",
    "EVENT" = "EVENT"
}