import { POST_TYPE } from "../data/PostDatabase"

export class Post {
    constructor(
        private post_id: string,
        private photo: string,
        private description: string,
        private created_at: string,
        private post_type: POST_TYPE,
        private author_id: string,
    ){}

    getId() {return this.post_id};
    getPhoto() {return this.photo};
    getDescription() {return this.description};
    getCreatedAt() {return this.created_at};
    getPostType() {return this.post_type};
    getAuthorId() {return this.author_id};

    setId(post_id: string) {this.post_id = post_id};
    setPhoto(photo: string) {this.photo = photo};
    setDescription(description: string) {this.description = description};
    setCreatedAt(createdAt: string) { this.created_at = createdAt};
    setPostType(postType: POST_TYPE) { this.post_type = postType};
    setAuthorId(authorId: string) {this.author_id = authorId};

    static toPostModel(post: any): Post {
        return new Post(post.post_id, post.photo, post.description, post.created_at, post.post_type, post.auhtor_id);
    }
}

export type PostAndUserNameOutputDTO = {
    post_id: string,
    photo: string,
    description: string,
    created_at: Date,
    post_type: POST_TYPE,
    author_id: string
}

export interface SearchPostDTO {
    description: string,
    orderBy: string,
    orderType: string,
    page: number
}