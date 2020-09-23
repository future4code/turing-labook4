import express from 'express';
import { CommentController } from '../controller/CommentController';
import { PostController } from '../controller/PostController';
import { commentPost } from '../endpoints/commentPost';
import { createPost } from '../endpoints/createPost';
import { getFeed } from '../endpoints/getFeed';
import { getFeedByPostType } from '../endpoints/getFeedByPostType';
import { getPost } from '../endpoints/getPost';
import { likePost } from '../endpoints/likePost';
import { unlikePost } from '../endpoints/unlikePost';

export const postRouter = express.Router();

const postController = new PostController();
const commentController = new CommentController();

postRouter.post("/", createPost);

postRouter.get("/feed", getFeed);
postRouter.get("/feed/search", postController.searchPost);
postRouter.get("/feed/:postType", getFeedByPostType);
postRouter.get("/:postId", getPost);
postRouter.delete("/:postId/delete", postController.deletePost);

postRouter.post("/:postId/comment", commentPost);
postRouter.delete("/:postId/comment/:commentId/delete", commentController.deleteComment);
postRouter.post("/:postId/like", likePost);
postRouter.delete("/:postId/unlike", unlikePost);