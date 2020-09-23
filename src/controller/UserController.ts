import { Request, Response } from "express";
import { UserBusiness } from "../business/UserBusiness";
import { BaseDatabase } from "../data/BaseDatabase";
import { UserDatabase } from "../data/UserDatabase";

export class UserController {

    public deleteUser = async (req: Request, res: Response) => {
        try {
            const userId = req.params.id;
            
            const userBusiness = new UserBusiness();
            await userBusiness.deleteUser(userId);
    
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