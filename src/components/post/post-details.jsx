import { useEffect, useState } from "react";
import { getComments } from "../../services/posts-service";
import Post from "../home/post";
import PostForm from "../home/post-form";
import CommentFeed from "./comment-feed";

export default function PostDetails({ post }) {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                let result;
                await getComments(post.id)
                    .then((response) => response.json())
                    .then((data) => {
                        result = data;
                        if (result && Array.isArray(result)) {
                            setComments(result);
                        }
                    });
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        };

        fetchComments();
    }, [post.id]);

    return (
        <>
            <ul className="list-none">
                <Post post={post} isComment={false} isMainPost={true} />
            </ul>
            <PostForm commentedPostId={post.id} />
            <CommentFeed comments={comments} />
        </>
    )
}