import { useEffect, useState } from "react";
import { getPosts } from "../../services/posts-service";
import Post from "./post";
import Loading from "../shared/loading";

export default function Timeline({ userId, searchString, isForLikedPosts }) {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                let result;
                await getPosts(userId, searchString, isForLikedPosts)
                    .then((response) => response.json())
                    .then((data) => {
                        result = data;
                        if (result && Array.isArray(result)) {
                            setPosts(result);
                            setIsLoading(false);
                        }
                    });
            } catch (error) {
                console.error("Error fetching posts:", error);
                setIsLoading(false);
            }
        };

        fetchPosts();

        const interval = setInterval(fetchPosts, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <ul className="list-none">
                {
                    isLoading ? (
                        <Loading />
                    )
                    : posts.length > 0 ? (
                        posts.map((post) => <Post key={post.id} post={post} isComment={false} isMainPost={false} />)
                    )
                    : (
                        <p>No posts available</p>
                    )
                }
            </ul>
        </>
    );
}
