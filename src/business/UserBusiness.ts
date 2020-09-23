import { IdGenerator } from "../services/IdGenerator";
import { HashManager } from "../services/HashManager";
import { UserDatabase } from "../data/UserDatabase";
import { Authenticator } from "../services/Authenticator";
import { User } from "../model/User";
import { PostDatabase } from "../data/PostDatabase";
import { Post, PostAndUserNameOutputDTO, SearchPostDTO } from "../model/Post";

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

    public async deleteUser(token: string): Promise<void> {

        const authenticator = new Authenticator();
        const authenticationData = authenticator.verify(token);

        const userDatabase = new UserDatabase();
        const user = await userDatabase.getUserById(authenticationData.id);
        
        await userDatabase.deleteUser(user.getId());
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