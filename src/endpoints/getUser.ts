import { Request, Response } from "express";
import { BaseDatabase } from "../data/BaseDatabase";
import { UserDatabase } from "../data/UserDatabase";

export const getUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const userDatabase = new UserDatabase();
        const user = await userDatabase.getUserById(userId);

        res.status(200).send({
            id: user.getId(),
            name: user.getName(),
            email: user.getEmail(),
        });
      
    } catch (e) {
        res.status(400).send({
            message: e.message
        })
    }
    await BaseDatabase.destroyConnection();
};