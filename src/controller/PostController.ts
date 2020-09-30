import { Request, Response } from "express";
import moment from "moment";
import { PostBusiness } from "../business/PostBusiness";
import { BaseDatabase } from "../data/BaseDatabase";
import { CommentsDatabase } from "../data/CommentsDatabase";
import { PostDatabase } from "../data/PostDatabase";
import { SearchPostDTO } from "../model/Post";

export class PostController {
    public createPost = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization as string;
            const { photo, description, post_type } = req.body;

            const postBusiness = new PostBusiness();
            await postBusiness.createPost(token, photo, description, post_type)
            
            res.status(200).send({
                message: 'Your post was created successfully.',
            });
        } catch (e) {
            res.status(400).send({
                message: e.message
            })
        }
        await BaseDatabase.destroyConnection();
    };

    public getPost = async (req: Request, res: Response) => {
        try {
            const postId = req.params.postId;
    
            const postDatabase = new PostDatabase();
            const post = await postDatabase.getPostById(postId);
    
            res.status(200).send({
                post_id: post.post_id,
                photo: post.photo,
                description: post.description,
                created_at: moment(post.created_at).format('DD/MM/YYYY'),
                post_type: post.post_type,
                author_id: post.user_id,
                user_name: post.user_name
            });
          
        } catch (e) {
            res.status(400).send({
                message: e.message
            })
        }
        await BaseDatabase.destroyConnection();
    };

    public getFeed = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization as string;
            const page = Number(req.query.page) || 1
            
            const postBusiness = new PostBusiness();
            const feed = await postBusiness.getFeed(token, page);
            
            res.status(200).send(feed);
          
        } catch (e) {
            res.status(400).send({
                message: e.message
            })
        }
        await BaseDatabase.destroyConnection();
    };

    public getFeedByPostType = async (req: Request, res: Response) => {
        try {
            const post_type = req.params.postType;

            const postBusiness = new PostBusiness();
            const feed = await postBusiness.getFeedByPostType(post_type);
            res.status(200).send(feed);
          
        } catch (e) {
            res.status(400).send({
                message: e.message
            })
        }
        await BaseDatabase.destroyConnection();
    };

    public searchPost = async(req: Request, res: Response) => {
        try {
            const searchData: SearchPostDTO = {
                description: req.query.description as string,
                orderBy:  req.query.orderBy as string || "created_at",
                orderType: req.query.orderType as string || "ASC",
                page: Number(req.query.page) || 1
            }

            const postBusiness = new PostBusiness();
            const result = await postBusiness.searchPost(searchData);

            res.status(200).send(result)
        } catch (err) {
            res.status(400).send(err.message)
        }

        await BaseDatabase.destroyConnection();
    }

    public likePost = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization as string;
            const post_id = req.params.postId;
    
            const postBusiness = new PostBusiness();
            await postBusiness.unlikePost(token, post_id);

            res.status(200).send({
                message: "You liked this post successfully.",
            });
        } catch (e) {
          res.status(400).send({
            message: e.message
          })
        }
        await BaseDatabase.destroyConnection();
    };

    public unlikePost = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization as string;
            const post_id = req.params.postId;
    
            const postBusiness = new PostBusiness();
            await postBusiness.unlikePost(token, post_id);

            res.status(200).send({
                message: "You unliked this post successfully.",
            });
          
        } catch (e) {
          res.status(400).send({
            message: e.message
          })
        }
        await BaseDatabase.destroyConnection();
    };

    public deletePost = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization as string;
            const postId = req.params.postId;

            const postBusiness = new PostBusiness();
            await postBusiness.deletePost(token, postId);
    
            res.status(200).send({
                message: "The post was deleted successfully"
            });
        } catch (e) {
            res.status(400).send({
                message: e.message
            })
        }
        await BaseDatabase.destroyConnection();
    };
}