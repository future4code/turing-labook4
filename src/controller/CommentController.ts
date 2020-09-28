import { Request, Response } from "express";
import { CommentBusiness } from "../business/CommentBusiness";
import { BaseDatabase } from "../data/BaseDatabase";

export class CommentController {

    public commentPost = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization as string;
            const message = req.body.comment_message;
            const postId = req.params.postId;
            
            const commentBusiness = new CommentBusiness();
            await commentBusiness.commentPost(token, message, postId)
            
            res.status(200).send({
                message: 'Your comment was created successfully',
            });
          
        } catch (e) {
            res.status(400).send({
                message: e.message
            })
        }
        await BaseDatabase.destroyConnection();
    };

    public deleteComment = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization as string;
            const commentId = req.body.comment_id;
            
            const commentBusiness = new CommentBusiness();
            await commentBusiness.deleteComment(token, commentId);
    
            res.status(200).send({
                message: "The comment was deleted successfully"
            });
        } catch (e) {
            res.status(400).send({
                message: e.message
            })
        }
        await BaseDatabase.destroyConnection();
    };
}