import moment from "moment";
import { FeedDatabase } from "../data/FeedDatabase";
import { LikesDatabase } from "../data/LikesDatabase";
import { PostDatabase, POST_TYPE } from "../data/PostDatabase";
import { Post, PostAndUserNameOutputDTO, SearchPostDTO } from "../model/Post";
import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";

export class PostBusiness {
    public async createPost(token: string, photo: string, description: string, post_type: POST_TYPE) {
        const creationDate = moment().format("YYYY-MM-DD HH:mm:ss");

        const authenticator = new Authenticator();
        const authenticationData = authenticator.verify(token);
        const userId = authenticationData.id;
    
        const idGenerator = new IdGenerator();
        const postId = idGenerator.generateId();
    
        const postDatabase = new PostDatabase();
        await postDatabase.createPost(
            postId,
            photo,
            description,
            creationDate,
            post_type,
            userId
        )
    };

    public async getFeed(token: string): Promise<PostAndUserNameOutputDTO[]> {  
        const authenticator = new Authenticator();
        const authenticationData = authenticator.verify(token);
        const userId = authenticationData.id;
    
        const feedDatabase = new FeedDatabase();
        const feed = await feedDatabase.getFeed(userId);

        return feed
    };

    public async getFeedByPostType(postType: string): Promise<PostAndUserNameOutputDTO[]> {
            
            const feedDatabase = new FeedDatabase();
            const feed = await feedDatabase.getFeedByPostType(postType);

            return feed
    };

    
    public async likePost(token: string, post_id: string) {
        const authenticator = new Authenticator();
        const authenticatorData = authenticator.verify(token);
        const userId = authenticatorData.id;
    
        if(!post_id) {
            throw new Error('Insert a valid post id.')
        }
    
        const postDatabase = new PostDatabase();
        const post = await postDatabase.getPostById(post_id);
    
        if(!post) {
            throw new Error('This post does not exists.')
        }
    
        const likesDatabase = new LikesDatabase();
        const isLiked = likesDatabase.checkIfLiked(userId, post_id);
    
        if(isLiked) {
            throw new Error('You already like this post.')
        }
            
        await likesDatabase.likePost(
            post_id,
            userId
        )
    };

    public async unlikePost(token: string, post_id: string) {
        const authenticator = new Authenticator();
        const authenticatorData = authenticator.verify(token);
        const userId = authenticatorData.id;
    
        if(!post_id) {
            throw new Error('Insert a valid post id.')
        }
    
        const postDatabase = new PostDatabase();
        const post = await postDatabase.getPostById(post_id);
    
        if(!post) {
            throw new Error('This post does not exists.')
        }
    
        const likesDatabase = new LikesDatabase();
        const isLiked = likesDatabase.checkIfLiked(userId, post_id);
    
        if(!isLiked) {
            throw new Error('You already does not like this post.')
        }
            
        await likesDatabase.unlikePost(
            post_id,
            userId
        )
    };

    public async deletePost(token: string, postId: string): Promise<void> {

        const authenticator = new Authenticator();
        const authenticationData = authenticator.verify(token);

        if(!authenticationData) {
            throw new Error("You don't have permission to do that.")
        }

        const postDataBase = new PostDatabase();
        const post = await postDataBase.getPostById(postId);

        await postDataBase.deletePost(post.getId());
    }

    public async searchPost(searchData: SearchPostDTO): Promise<PostAndUserNameOutputDTO[]> {
        const validOrderByValues = ["description", "created_at"]
        const validOrderTypeValues = ["ASC", "DESC"]

        if(!validOrderByValues.includes(searchData.orderBy)) {
            throw new Error("Insert a valid order. It can be 'description' or 'created_at'.")
        }

        if(!validOrderTypeValues.includes(searchData.orderType)) {
            throw new Error("Insert a valid order. It can be 'ASC' or 'DESC'.")
        }

        if(!searchData.description) {
            throw new Error("Please inform some word or sentence for the search.")
        }

        if(searchData.page < 0) {
            throw new Error("The page should be bigger than 0.")
        }

        const result = await new PostDatabase().searchPost(searchData)

        if(!result.length) {
            throw new Error("No post was found. Perhaps you should be the first person to write about that.")
        }

        return result
    }

}