import { Request, Response } from "express";
import { UserBusiness } from "../business/UserBusiness";
import { BaseDatabase } from "../data/BaseDatabase";

export const login = async (req: Request, res: Response) => {
    try {
        const user = {
            email: req.body.email,
            password: req.body.password,
        }

        const userBusiness = new UserBusiness();
        const token = await userBusiness.login(user.email, user.password);

        res.status(200).send({
            message: 'User logged in successfully.',
            token
        });
      
    } catch (e) {
        res.status(400).send({
            message: e.message
        })
    }
    await BaseDatabase.destroyConnection();
};