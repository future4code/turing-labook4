import { PostDatabase } from "../data/PostDatabase";
import { Authenticator } from "../services/Authenticator";

export class PostBusiness {

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
}