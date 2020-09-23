import { Request, Response } from "express";
import { BaseDatabase } from "../data/BaseDatabase";
import { UserDatabase } from "../data/UserDatabase";
import { UsersFriendshipDatabase } from "../data/UsersFriendshipDatabase";
import { Authenticator } from "../services/Authenticator";

export const befriendUser = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization as string;
        const userToBefriendId = req.body.userToBefriendId;

        const authenticator = new Authenticator();
        const authenticatorData = authenticator.verify(token);
        const userId = authenticatorData.id;

        if(!userToBefriendId) {
            throw new Error('Insert a valid user id.')
        }

        const userDatabase = new UserDatabase();
        const user = await userDatabase.getUserById(userToBefriendId);

        if(!user) {
            throw new Error('This user does not exists.')
        }

        const usersFriendshipDatabase = new UsersFriendshipDatabase();
        const isFriend = usersFriendshipDatabase.checkFriendship(userId, userToBefriendId);

        if(isFriend) {
            throw new Error('This user is already your friend.')
        }
        
        await usersFriendshipDatabase.befriendUser(
            userId,
            userToBefriendId
        )

        res.status(200).send({
            message: "You are now a friend of this user. Treat her/him well, because that's what friendship is all about.",
        });
      
    } catch (e) {
        res.status(400).send({
            message: e.message
        })
    }
    await BaseDatabase.destroyConnection();
};