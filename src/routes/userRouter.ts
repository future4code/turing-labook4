import express from 'express';
import { UserController } from '../controller/UserController';

export const userRouter = express.Router();

const userController = new UserController();

userRouter.put("/signup", userController.signUp);
userRouter.post("/login", userController.login);
userRouter.get("/profile", userController.getUserProfile);
userRouter.get("/:id", userController.getUser);
userRouter.delete("/:id/delete", userController.deleteUser);
userRouter.post("/befriend", userController.befriendUser);
userRouter.delete("/unfriend", userController.unfriendUser);