import { CommentsDatabase } from "../data/CommentsDatabase";
import { Authenticator } from "../services/Authenticator";

export class CommentBusiness {

    public async deleteComment(token: string, commentId: string): Promise<void> {

        const authenticator = new Authenticator();
        const authenticationData = authenticator.verify(token);

        if(!authenticationData) {
            throw new Error("You don't have permission to do that.")
        }

        const commentDataBase = new CommentsDatabase();
        const comment = await commentDataBase.getCommentById(commentId);

        await commentDataBase.deleteComment(comment.getId());
    }
}