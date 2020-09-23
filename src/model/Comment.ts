export class Comment {
    constructor(
        private comment_id: string,
        private comment_message: string,
        private user_id: string,
        private post_id: string,
        private created_at: Date,
    ){}

    getId() {return this.comment_id};
    getDescription() {return this.comment_message};
    getUserId() {return this.user_id};
    getPostId() {return this.post_id};
    getCreatedAt() {return this.created_at};

    setId(comment_id: string) {this.comment_id = comment_id};
    setDescription(comment_message: string) {this.comment_message = comment_message};
    setUserId(user_id: string) {this.user_id = user_id};
    setPostId(post_id: string) {this.post_id = post_id};
    setCreatedAt(created_at: Date) { this.created_at = created_at};

    static toPostModel(post: any): Comment {
        return new Comment(post.comment_id, post.comment_message, post.user_id, post.post_id, post.created_at);
    }
}

export type CommentOutputDTO = {
    comment_id: string,
    comment_message: string,
    user_id: string,
    post_id: string,
    created_at: string
}