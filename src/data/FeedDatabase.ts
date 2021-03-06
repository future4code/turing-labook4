import { Post, PostAndUserNameOutputDTO } from "../model/Post";
import { BaseDatabase } from "./BaseDatabase";
import { CommentsDatabase } from "./CommentsDatabase";

export class FeedDatabase extends BaseDatabase {
    public async getFeed(userId: string, page: number): Promise<PostAndUserNameOutputDTO[]> {
      const resultsPerPage: number = 5
      const offset: number = resultsPerPage * (page - 1)

      const result = await this.getConnection().raw(`
        SELECT post.post_id, post.photo, post.description, post.created_at, post.post_type, user.id, user.name
        FROM labook_posts as post
        JOIN labook_friends as friends
        ON friends.friend_id = post.author_id 
        AND friends.user_id = '${userId}'
        JOIN labook_users as user
        ON post.author_id = user.id
        ORDER BY post.created_at DESC
        LIMIT ${resultsPerPage}
        OFFSET ${offset}
      `);
      
      const posts: PostAndUserNameOutputDTO[] = [];
      for(let post of result[0]){

        const commentsDatabase = new CommentsDatabase();
        const comments = await commentsDatabase.getCommentInfoAndUserName(post.post_id);

        posts.push({
           post_id: post.post_id,
           photo: post.photo,
           description: post.description,
           created_at: post.created_at,
           post_type: post.post_type,
           user_id: post.id,
           user_name: post.name,
           comments: comments
        });
      }  
      
      return posts;  
    }

    public async getFeedByPostType(postType: string): Promise<PostAndUserNameOutputDTO[]> {
      const result = await this.getConnection().raw(`
        SELECT p.post_id, p.photo, p.description, p.created_at, p.created_at, u.id, u.name
        FROM labook_posts as p
        JOIN labook_users as u
        ON p.author_id = u.id
        WHERE p.post_type = '${postType}'
      `);
      
      const posts: PostAndUserNameOutputDTO[] = [];
      for(let post of result[0]){

        const commentsDatabase = new CommentsDatabase();
        const comments = await commentsDatabase.getCommentInfoAndUserName(post.post_id);

        posts.push({
           post_id: post.post_id,
           photo: post.photo,
           description: post.description,
           created_at: post.created_at,
           post_type: post.post_type,
           user_id: post.id,
           user_name: post.name,
           comments: comments
        });
      }  
      
      return posts;  
    }
    
}