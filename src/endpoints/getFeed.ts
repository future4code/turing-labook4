import { Request, Response } from "express";
import { BaseDatabase } from "../data/BaseDatabase";
import { FeedDatabase } from "../data/FeedDatabase";
import { Authenticator } from "../services/Authenticator";
import moment from "moment";

export const getFeed = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization as string;
        const authenticator = new Authenticator();
        const authenticationData = authenticator.verify(token);
        const userId = authenticationData.id;

        const feedDatabase = new FeedDatabase();
        const feed = await feedDatabase.getFeed(userId);
        const mappedFeed = feed.map((item: any) => ({
            post_id: item.post_id,
            photo: item.photo,
            description: item.description,
            created_at: moment(item.created_at).format('DD/MM/YYYY'),
            post_type: item.post_type,
            author_id: item.author_id
        }))

        res.status(200).send(mappedFeed);
      
    } catch (e) {
        res.status(400).send({
            message: e.message
        })
    }
    await BaseDatabase.destroyConnection();
};