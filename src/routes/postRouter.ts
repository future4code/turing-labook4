import express from 'express';
import { commentPost } from '../endpoints/commentPost';
import { createPost } from '../endpoints/createPost';
import { getFeed } from '../endpoints/getFeed';
import { getFeedByPostType } from '../endpoints/getFeedByPostType';
import { getPost } from '../endpoints/getPost';
import { likePost } from '../endpoints/likePost';
import { unlikePost } from '../endpoints/unlikePost';

export const postRouter = express.Router();

postRouter.post("/", createPost);

postRouter.get("/feed", getFeed);
postRouter.get("/feed/:postType", getFeedByPostType);
postRouter.get("/:postId", getPost);

postRouter.post("/:postId/comment", commentPost);
postRouter.post("/:postId/like", likePost);
postRouter.post("/:postId/unlike", unlikePost);