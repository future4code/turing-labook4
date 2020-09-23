import { Request, Response } from "express";
import moment from "moment";
import { BaseDatabase } from "../data/BaseDatabase";
import { CommentsDatabase } from "../data/CommentsDatabase";
import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";

export const commentPost = async (req: Request, res: Response) => {
    try {
        const message = req.body.comment_message;
        const postId = req.params.postId;

        const creationDate = moment().format("YYYY-MM-DD HH:mm:ss");

        const token = req.headers.authorization as string;
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