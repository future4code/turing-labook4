import express from 'express';
import { befriendUser } from '../endpoints/befriendUser';
import { getUser } from '../endpoints/getUser';
import { getUserProfile } from '../endpoints/getUserProfile';
import { login } from '../endpoints/login';
import { signUp } from '../endpoints/signUp';
import { unfriendUser } from '../endpoints/unfriendUser';

export const userRouter = express.Router();

userRouter.put("/signup", signUp);
userRouter.post("/login", login);
userRouter.get("/profile", getUserProfile);
userRouter.get("/:id", getUser);
userRouter.get("/befriend", befriendUser);
userRouter.delete("/unfriend", unfriendUser);