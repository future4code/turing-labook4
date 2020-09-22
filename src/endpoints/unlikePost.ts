import { Request, Response } from "express";
import { BaseDatabase } from "../data/BaseDatabase";

export const unlikePost = async (req: Request, res: Response) => {
    try {
      res.status(200).send({
        message: 'Success',
      });
      
    } catch (e) {
      res.status(400).send({
        message: e.message
      })
    }
    await BaseDatabase.destroyConnection();
};