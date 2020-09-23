import { Request, Response } from "express";
import { PostBusiness } from "../business/PostBusiness";
import { UserBusiness } from "../business/UserBusiness";
import { BaseDatabase } from "../data/BaseDatabase";
import { SearchPostDTO } from "../model/Post";

export class PostController {

    public searchPost = async(req: Request, res: Response) => {
        try {
            const searchData: SearchPostDTO = {
                description: req.query.description as string,
                orderBy:  req.query.orderBy as string || "created_at",
                orderType: req.query.orderType as string || "ASC",
                page: Number(req.query.page) || 1
            }

            const postBusiness = new PostBusiness();
            const result = await postBusiness.searchPost(searchData);

            res.status(200).send(result)
        } catch (err) {
            res.status(400).send(err.message)
        }

        await BaseDatabase.destroyConnection();
    }

    public deletePost = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization as string;
            const postId = req.params.postId;
            
            const postBusiness = new PostBusiness();
            await postBusiness.deletePost(token, postId);
    
            res.status(200).send({
                message: "The post was deleted successfully"
            });
        } catch (e) {
            res.status(400).send({
                message: e.message
            })
        }
        await BaseDatabase.destroyConnection();
    };
}