import { Request, Response } from "express";
import { BaseDatabase } from "../data/BaseDatabase";
import { UserDatabase } from "../data/UserDatabase";
import { UsersFriendshipDatabase } from "../data/UsersFriendshipDatabase";
import { Authenticator } from "../services/Authenticator";

export const unfriendUser = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization as string;
        const userToUnfriendId = req.body.userToUnfriendId;

        const authenticator = new Authenticator();
        const authenticatorData = authenticator.verify(token);
        const userId = authenticatorData.id;

        if(!userToUnfriendId) {
            throw new Error('Insert a valid user id.')
        }

        const userDatabase = new UserDatabase();
        const user = await userDatabase.getUserById(userToUnfriendId);

        if(!user) {
            throw new Error('This user does not exists.')
        }

        const usersFriendshipDatabase = new UsersFriendshipDatabase();
        const isFriend = usersFriendshipDatabase.checkFriendship(userId, userToUnfriendId);

        if(!isFriend) {
            throw new Error('This user is not your friend.')
        }
        
        await usersFriendshipDatabase.unfriendUser(
            userId,
            userToUnfriendId
        )

      res.status(200).send({
        message: "You are not a friend of this user anymore. Hope that there'll still be some respect left.",
      });
      
    } catch (e) {
      res.status(400).send({
        message: e.message
      })
    }
    await BaseDatabase.destroyConnection();
};