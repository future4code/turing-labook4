import { Post } from "../model/Post";
import { BaseDatabase } from "./BaseDatabase";

export class FeedDatabase extends BaseDatabase {
    public async getFeed(userId: string): Promise<Post[]> {
      const result = await this.getConnection().raw(`
        SELECT labook_posts.post_id, photo, description, created_at, labook_users.id, labook_users.name
        FROM labook_posts
        JOIN labook_friendship
        ON labook_friendship.friend_id = labook_posts.author_id 
        AND labook_friendship.user_id = '${userId}'
        JOIN labebook_users
        ON labook_posts.author_id = labebook_users.id
        ORDERBY labook_posts.created_at DESC;
      `);
      return result[0]
    }

    public async getFeedByPostType(postType: string): Promise<Post[]> {
      const result = await this.getConnection().raw(`
        SELECT labook_posts.post_id, photo, description, created_at, labook_users.id, labook_users.name
        FROM labook_posts
        JOIN labebook_users
        ON labook_posts.author_id = labebook_users.id
        WHERE post_type = '${postType}'
      `);
      return result[0]
    }
    
}