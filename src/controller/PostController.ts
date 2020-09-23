import { Request, Response } from "express";
import moment from "moment";
import { PostBusiness } from "../business/PostBusiness";
import { BaseDatabase } from "../data/BaseDatabase";
import { FeedDatabase } from "../data/FeedDatabase";
import { LikesDatabase } from "../data/LikesDatabase";
import { PostDatabase } from "../data/PostDatabase";
import { SearchPostDTO } from "../model/Post";
import { Authenticator } from "../services/Authenticator";

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
                post_id: post.getId(),
                photo: post.getPhoto(),
                description: post.getDescription(),
                created_at: moment(post.getCreatedAt()).format('DD/MM/YYYY'),
                post_type: post.getPostType(),
                author_id: post.getAuthorId()
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
            const authenticator = new Authenticator();
            const authenticationData = authenticator.verify(token);
            const userId = authenticationData.id;
    
            const feedDatabase = new FeedDatabase();
            const feed = await feedDatabase.getFeed(userId);
            const mappedFeed = feed.map((item: any) => ({
                post_id: item.post_id,
                photo: item.photo,
                description: item.description,
                created_at: moment(item.created_at).format('DD/MM/YYYY'),
                post_type: item.post_type,
                author_id: item.author_id
            }))
    
            res.status(200).send(mappedFeed);
          
        } catch (e) {
            res.status(400).send({
                message: e.message
            })
        }
        await BaseDatabase.destroyConnection();
    };

    public getFeedByPostType = async (req: Request, res: Response) => {
        try {
            const postType = req.params.postType;

            const feedDatabase = new FeedDatabase();
            const feed = await feedDatabase.getFeedByPostType(postType);
            const mappedFeed = feed.map((item: any) => ({
                post_id: item.post_id,
                photo: item.photo,
                description: item.description,
                created_at: moment(item.created_at).format('DD/MM/YYYY'),
                post_type: item.post_type,
                author_id: item.author_id
            }))
    
            res.status(200).send(mappedFeed);
          
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
            const postId = req.params.postId;
    
            const authenticator = new Authenticator();
            const authenticatorData = authenticator.verify(token);
            const userId = authenticatorData.id;
    
            if(!postId) {
                throw new Error('Insert a valid post id.')
            }
    
            const postDatabase = new PostDatabase();
            const post = await postDatabase.getPostById(postId);
    
            if(!post) {
                throw new Error('This post does not exists.')
            }
    
            const likesDatabase = new LikesDatabase();
            const isLiked = likesDatabase.checkIfLiked(userId, postId);
    
            if(isLiked) {
                throw new Error('You already like this post.')
            }
            
            await likesDatabase.likePost(
                postId,
                userId
            )
    
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
            const postId = req.params.postId;
    
            const authenticator = new Authenticator();
            const authenticatorData = authenticator.verify(token);
            const userId = authenticatorData.id;
    
            if(!postId) {
                throw new Error('Insert a valid post id.')
            }
    
            const postDatabase = new PostDatabase();
            const post = await postDatabase.getPostById(postId);
    
            if(!post) {
                throw new Error('This post does not exists.')
            }
    
            const likesDatabase = new LikesDatabase();
            const isLiked = likesDatabase.checkIfLiked(userId, postId);
    
            if(!isLiked) {
                throw new Error('You already does not like this post.')
            }
            
            await likesDatabase.unlikePost(
                postId,
                userId
            )
    
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