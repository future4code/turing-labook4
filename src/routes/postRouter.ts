import express from 'express';
import { CommentController } from '../controller/CommentController';
import { PostController } from '../controller/PostController';

export const postRouter = express.Router();

const postController = new PostController();
const commentController = new CommentController();

postRouter.post("/", postController.createPost);

postRouter.get("/feed", postController.getFeed);
postRouter.get("/feed/search", postController.searchPost);
postRouter.get("/feed/:postType", postController.getFeedByPostType);
postRouter.get("/:postId", postController.getPost);
postRouter.delete("/:postId/delete", postController.deletePost);

postRouter.post("/:postId/comment", commentController.commentPost);
postRouter.delete("/:postId/comment/:commentId/delete", commentController.deleteComment);
postRouter.post("/:postId/like", postController.likePost);
postRouter.delete("/:postId/unlike", postController.unlikePost);