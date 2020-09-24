import { BaseDatabase } from "./BaseDatabase";

export class LikesDatabase extends BaseDatabase {
    private static TABLE_NAME = 'labook_likes';
  
    public async likePost(userId:string, postId: string): Promise<void> {
      await this.getConnection()
        .insert({
            post_id: postId,
            user_id: userId,
        }).into(LikesDatabase.TABLE_NAME)
    }
  
    public async unlikePost(userId:string, postId: string): Promise<void> {
      await this.getConnection()
        .del()
        .from(LikesDatabase.TABLE_NAME)
        .where({
            post_id: postId,
            user_id: userId,
        })
    }
  
    public async checkIfLiked(userId:string, postId: string): Promise<any> {
      const result = await this.getConnection()
        .select()
        .from(LikesDatabase.TABLE_NAME)
        .where({
            post_id: postId,
            user_id: userId,
        });
      return result[0]
    }
    
}