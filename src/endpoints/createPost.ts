import { Request, Response } from "express";
import { BaseDatabase } from "../data/BaseDatabase";
import { Authenticator } from "../services/Authenticator";
import moment from "moment";
import { PostDatabase } from "../data/PostDatabase";
import { IdGenerator } from "../services/IdGenerator";

export const createPost = async (req: Request, res: Response) => {
    try {
        const { photo, description, post_type } = req.body;
        const creationDate = moment().format("YYYY-MM-DD HH:mm:ss");

        const token = req.headers.authorization as string;
        const authenticator = new Authenticator();
        const authenticationData = authenticator.verify(token);
        const userId = authenticationData.id;

        const idGenerator = new IdGenerator();
        const postId = idGenerator.generateId();

        const postDatabase = new PostDatabase();
        await postDatabase.createPost(
            postId,
            photo,
            description,
            creationDate,
            post_type,
            userId
        )

      res.status(200).send({
        message: 'Your post was created successfully',
      });
      
    } catch (e) {
      res.status(400).send({
        message: e.message
      })
    }
    await BaseDatabase.destroyConnection();
};