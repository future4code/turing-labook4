import { IdGenerator } from "../services/IdGenerator";
import { HashManager } from "../services/HashManager";
import { UserDatabase } from "../data/UserDatabase";
import { Authenticator } from "../services/Authenticator";
import { User } from "../model/User";
import { PostDatabase } from "../data/PostDatabase";
import { Post, PostAndUserNameOutputDTO, SearchPostDTO } from "../model/Post";
import { UsersFriendshipDatabase } from "../data/UsersFriendshipDatabase";

export class UserBusiness {

    public async signUp(name: string, email: string, password: string): Promise<string> {

        if (!name || !email || !password) {
            throw new Error('Insert all required information for the signup. Stop being lazy.');
        }

        if (password.length < 6) {
            throw new Error('The password should contain at least 6 characters. Think better.');
        }

        const idGenerator = new IdGenerator();
        const id = idGenerator.generateId();

        const hashManager = new HashManager();
        const hashPassword = await hashManager.hash(password);

        const userDataBase = new UserDatabase();
        await userDataBase.registerUser(
            id,
            name,
            email,
            hashPassword
        );

        const authenticator = new Authenticator();
        const token = authenticator.generateToken({ id });

        return token;
    }

    public async login(email: string, password: string): Promise<string> {

        const userDataBase = new UserDatabase();
        const user = await userDataBase.getUserByEmail(email);

        const hashManager = new HashManager();
        const isPasswordCorrect = await hashManager.compare(password, user.password);

        if (!isPasswordCorrect) {
            throw new Error('The user or the password is wrong. Or both of them. Are you a hacker?');
        }

        const authenticator = new Authenticator();
        const token = authenticator.generateToken({
            id: user.id
        });

        return token;
    }

    public async getUserProfile(token: string): Promise<User> {

        const authenticator = new Authenticator();
        const authenticationData = authenticator.verify(token);

        const userDataBase = new UserDatabase();
        const user = await userDataBase.getUserById(authenticationData.id);

        const postDatabase = new PostDatabase();
        const userPosts =  await postDatabase.getPostByUserId(user.getId());
        
        user.setPosts(userPosts);

        return user;

    }

    public async befriendUser(token: string, friend_id: string): Promise<void> {
        const authenticator = new Authenticator();
        const authenticatorData = authenticator.verify(token);

        if(!authenticatorData.id) {
            throw new Error("You don't have permission to do that.")
        }

        const userDatabase = new UserDatabase();
        const friendExists = await userDatabase.getUserById(friend_id);

        if(!friendExists) {
            throw new Error('This user does not exists. Are you trying to be friend with a ghost?')
        }

        const usersFriendshipDatabase = new UsersFriendshipDatabase();

        const isFriend = await usersFriendshipDatabase.checkFriendship(authenticatorData.id, friend_id);

        if(isFriend) {
            throw new Error('This user is already your friend.')
        }
        
        await usersFriendshipDatabase.befriendUser(authenticatorData.id, friend_id);
    }

    public async unfriendUser(token: string, friend_id: string): Promise<void> {
        const authenticator = new Authenticator();
        const authenticatorData = authenticator.verify(token);

        if(!authenticatorData.id) {
            throw new Error("You don't have permission to do that.")
        }

        const userDatabase = new UserDatabase();
        const friendExists = await userDatabase.getUserById(friend_id);

        if(!friendExists) {
            throw new Error('This user does not exists. Are you trying to unfriend with a ghost?')
        }

        const usersFriendshipDatabase = new UsersFriendshipDatabase();

        const isFriend = await usersFriendshipDatabase.checkFriendship(authenticatorData.id, friend_id);

        if(!isFriend) {
            throw new Error('This user is not your friend anyway.')
        }
        
        await usersFriendshipDatabase.unfriendUser(authenticatorData.id, friend_id);
    }

    public async deleteUser(token: string): Promise<void> {

        const authenticator = new Authenticator();
        const authenticationData = authenticator.verify(token);

        const userDatabase = new UserDatabase();
        const user = await userDatabase.getUserById(authenticationData.id);
        
        await userDatabase.deleteUser(user.getId());
    }
}