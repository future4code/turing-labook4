import { Request, Response } from "express";
import { UserBusiness } from "../business/UserBusiness";
import { BaseDatabase } from "../data/BaseDatabase";

export const signUp = async (req: Request, res: Response) => {
    try {
    
        const user = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        }

        const userBusiness = new UserBusiness();
        const token = await userBusiness.signUp(user.name, user.email, user.password);

        res.status(200).send({
            message: 'User created successfully.',
            token
        });
      
    } catch (e) {
        res.status(400).send({
            message: e.message
        })
    }
    await BaseDatabase.destroyConnection();
};