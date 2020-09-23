import { Request, Response } from "express";
import { BaseDatabase } from "../data/BaseDatabase";
import { LikesDatabase } from "../data/LikesDatabase";
import { PostDatabase } from "../data/PostDatabase";
import { Authenticator } from "../services/Authenticator";

export const likePost = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization as string;
        const postId = req.params.postId;

        const authenticator = new Authenticator();
        const authenticatorData = authenticator.verify(token);
        const userId = authenticatorData.id;

        if(!postId) {
            throw new Error('Insert a valid post id.')
        }

        const postDatabase = new PostDatabase();
        const post = await postDatabase.getPostById(postId);

        if(!post) {
            throw new Error('This post does not exists.')
        }

        const likesDatabase = new LikesDatabase();
        const isLiked = likesDatabase.checkIfLiked(userId, postId);

        if(isLiked) {
            throw new Error('You already like this post.')
        }
        
        await likesDatabase.likePost(
            postId,
            userId
        )

        res.status(200).send({
            message: "You liked this post successfully.",
        });
    } catch (e) {
      res.status(400).send({
        message: e.message
      })
    }
    await BaseDatabase.destroyConnection();
};