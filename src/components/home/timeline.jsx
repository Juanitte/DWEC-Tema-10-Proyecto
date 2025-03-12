import { useEffect, useState } from "react";
import { getPosts } from "../../services/api-service";
import Post from "./post";
import Loading from "../shared/loading";

export default function Timeline() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                let result;
                await getPosts()
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
        
        const interval = setInterval(fetchPosts, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-[#2b3b4f] h-full p-4 text-gray-100 overflow-y-auto flex flex-col gap-2">
            {isLoading ? (
                <Loading />
            ) : posts.length > 0 ? (
                posts.map((post) => <Post key={post.id} post={post} />)
            ) : (
                <p>No posts available</p>
            )}
        </div>
    );
}
