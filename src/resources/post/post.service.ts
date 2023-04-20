import postModel from "./post.model";
import Post from "./post.interface";

class PostService {
    private post = postModel;


    public async create(title: string, body: string): Promise<Post> {
        try {
            const post = await this.post.create({ title, body });

            return post;
        } catch (error) {
            throw new Error('Unable to create post')
        }
    }
}


export default PostService;