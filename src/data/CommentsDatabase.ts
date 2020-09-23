import { Comment, CommentOutputDTO } from "../model/Comment";
import { BaseDatabase } from "./BaseDatabase";

export class CommentsDatabase extends BaseDatabase {
    private static TABLE_NAME = 'labook_comments';
  
    public async createPost(
        comment_id: string,
        comment_message: string,
        user_id: string,
        post_id: string,
        created_at: string
    ): Promise<void> {
      await this.getConnection()
        .insert({
            comment_id,
            comment_message,
            user_id,
            post_id,
            created_at
        }).into(CommentsDatabase.TABLE_NAME)
    }
  
    public async getCommentById(commentId: string): Promise<Comment> {
      const result = await this.getConnection()
        .select('*')
        .from(CommentsDatabase.TABLE_NAME)
        .where({ comment_id: commentId });
  
      return Comment.toPostModel(result[0]);
    }
  
    public async getPostByUserId(userId: string): Promise<Comment[]> {
      const result = await this.getConnection()
        .select('*')
        .from(CommentsDatabase.TABLE_NAME)
        .where({ user_id: userId });
  
      const comments: Comment[] = [];
  
      for (let comment of result) {
        comments.push(Comment.toPostModel(comment));
      }
  
      return comments;
    }
  
    public async getPostInfoAndUserName(): Promise<CommentOutputDTO[]> {
  
      const result = await this.getConnection().raw(`
      SELECT *, u.id, u.name
      FROM labook_comments c
      JOIN labook_users u
      ON c.user_id = u.id;
      `);
  
      const recipes: CommentOutputDTO[] = [];
      for(let comment of result[0]){
        recipes.push({
            comment_id: comment.comment_id,
            comment_message: comment.comment_message,
            user_id: comment.user_id,
            post_id: comment.post_id,
            created_at: comment.created_at
        });
      }  
      
      return recipes;  
    }
    
    public async deleteComment(comment_id: string): Promise<void> {
        await this.getConnection()
        .del()
        .from(CommentsDatabase.TABLE_NAME)
        .where({ comment_id });
    }

}