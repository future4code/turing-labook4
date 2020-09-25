import moment from "moment";
import { CommentsDatabase } from "../data/CommentsDatabase";
import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";

export class CommentBusiness {

    public async commentPost(token: string, message: string, postId: string): Promise<void> {
    
            const creationDate = moment().format("YYYY-MM-DD HH:mm:ss");

            const authenticator = new Authenticator();
            const authenticationData = authenticator.verify(token);
            const userId = authenticationData.id;
    
            const idGenerator = new IdGenerator();
            const commentId = idGenerator.generateId();
    
            const commentsDatabase = new CommentsDatabase();
            await commentsDatabase.createPost(
                commentId,
                message,
                userId,
                postId,
                creationDate
            )
    };

    public async deleteComment(token: string, commentId: string): Promise<void> {

        const authenticator = new Authenticator();
        const authenticationData = authenticator.verify(token);

        const commentDataBase = new CommentsDatabase();
        const comment = await commentDataBase.getCommentById(commentId);

        if(!comment.getId()) {
            throw new Error("This comment doesn't exists.")
        }

        if(authenticationData.id !== comment.getUserId()) {
            throw new Error("You don't have permission to do that.")
        }

        await commentDataBase.deleteComment(comment.getId());
    }

    public async deleteAllCommentsFromUser (token: string, commentId: string): Promise<void> {

        const authenticator = new Authenticator();
        const authenticationData = authenticator.verify(token);

        const commentDataBase = new CommentsDatabase();
        const comment = await commentDataBase.getCommentById(commentId);

        if(!comment.getId()) {
            throw new Error("This comment doesn't exists.")
        }

        if(authenticationData.id !== comment.getUserId()) {
            throw new Error("You don't have permission to do that.")
        }

        await commentDataBase.deleteAllCommentsFromUser(comment.getUserId());
    }
}