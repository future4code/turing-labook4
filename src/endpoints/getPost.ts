import { Request, Response } from "express";
import { BaseDatabase } from "../data/BaseDatabase";
import { PostDatabase } from "../data/PostDatabase";
import moment from "moment";

export const getPost = async (req: Request, res: Response) => {
    try {
        const postId = req.params.postId;

        const postDatabase = new PostDatabase();
        const post = await postDatabase.getPostById(postId);

        res.status(200).send({
            post_id: post.getId(),
            photo: post.getPhoto(),
            description: post.getDescription(),
            created_at: moment(post.getCreatedAt()).format('DD/MM/YYYY'),
            post_type: post.getPostType(),
            author_id: post.getAuthorId()
        });
      
    } catch (e) {
        res.status(400).send({
            message: e.message
        })
    }
    await BaseDatabase.destroyConnection();
};