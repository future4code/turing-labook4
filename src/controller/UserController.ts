import { Request, Response } from "express";
import { UserBusiness } from "../business/UserBusiness";
import { BaseDatabase } from "../data/BaseDatabase";
import { UserDatabase } from "../data/UserDatabase";

export class UserController {
    public signUp = async (req: Request, res: Response) => {
        try {
        
            const user = {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                device: req.body.device,
            }
    
            const userBusiness = new UserBusiness();
            const token = await userBusiness.signUp(user.name, user.email, user.password, user.device);
    
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

    public login = async (req: Request, res: Response) => {
        try {
            const user = {
                email: req.body.email,
                password: req.body.password,
                device: req.body.device,
            }
    
            const userBusiness = new UserBusiness();
            const token = await userBusiness.login(user.email, user.password, user.device);
    
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

    public refreshToken = async (req: Request, res: Response) => {
        try {
            const refreshToken = req.body.refreshToken;
            const device = req.body.device;

            const userBusiness = new UserBusiness();
            const token = await userBusiness.refreshToken(refreshToken, device);
    
            res.status(200).send({
                message: 'The token was refreshed successfully.',
                token
            });
          
        } catch (e) {
            res.status(400).send({
                message: e.message
            })
        }
        await BaseDatabase.destroyConnection();
        
    }
    
    public getUserProfile = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization as string;
            
            const userBusiness = new UserBusiness();
            const user = await userBusiness.getUserProfile(token);
    
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

    public getUser = async (req: Request, res: Response) => {
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

    public befriendUser = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization as string;
            const friend_id = req.body.friend_id;
    
            if(!friend_id) {
                throw new Error('Insert a valid user id.')
            }
    
            const userBusiness = new UserBusiness();
            await userBusiness.befriendUser(token, friend_id);
    
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
    
    public unfriendUser = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization as string;
            const friend_id = req.body.friend_id;
    
            if(!friend_id) {
                throw new Error('Insert a valid user id.')
            }
    
            const userBusiness = new UserBusiness();
            await userBusiness.unfriendUser(token, friend_id);
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