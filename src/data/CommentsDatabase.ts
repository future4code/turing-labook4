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
  
    public async getCommentInfoAndUserName(postId: string): Promise<CommentOutputDTO[]> {
  
      const result = await this.getConnection().raw(`
      SELECT *, u.id, u.name
      FROM labook_comments c
      JOIN labook_users u
      ON c.user_id = u.id
      WHERE post_id = "${postId}"
      `);
  
      const comments: CommentOutputDTO[] = [];
      
      for(let comment of result[0]){
        comments.push({
            comment_id: comment.comment_id,
            comment_message: comment.comment_message,
            post_id: comment.post_id,
            created_at: comment.created_at,
            user_id: comment.user_id,
            user_name: comment.name
        });
      }  
      
      return comments;  
    }
    
    public async deleteComment(comment_id: string): Promise<void> {
        await this.getConnection()
        .del()
        .from(CommentsDatabase.TABLE_NAME)
        .where({ comment_id });
    }
    
    public async deleteAllCommentsFromUser(user_id: string): Promise<void> {
        await this.getConnection()
        .del()
        .from(CommentsDatabase.TABLE_NAME)
        .where({ user_id });
    }
    
    public async deleteAllCommentsFromPost(post_id: string): Promise<void> {
        await this.getConnection()
        .del()
        .from(CommentsDatabase.TABLE_NAME)
        .where({ post_id });
    }

}