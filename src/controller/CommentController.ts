import { Request, Response } from "express";
import { CommentBusiness } from "../business/CommentBusiness";
import { BaseDatabase } from "../data/BaseDatabase";

export class CommentController {

    public deleteComment = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization as string;
            const commentId = req.params.commentId;
            
            const commentBusiness = new CommentBusiness();
            await commentBusiness.deleteComment(token, commentId);
    
            res.status(200).send({
                message: "The user was deleted successfully"
            });
        } catch (e) {
            res.status(400).send({
                message: e.message
            })
        }
        await BaseDatabase.destroyConnection();
    };
}