import { useEffect, useState } from "react";
import { getPosts } from "../../services/api-service";
import Post from "./post";

export default function Timeline() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                let response;
                await getPosts()
                    .then((response) => response.json())
                    .then((data) => (response = data));

                if (response && Array.isArray(response)) {
                    setPosts(response);
                }
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };

        fetchPosts();

        const interval = setInterval(fetchPosts, 3000);

        return () => clearInterval(interval);

    }, []);

    return (
        <div className="bg-[#2b3b4f] h-full p-4 text-gray-100 overflow-y-auto">
            {posts.length > 0 ? (
                posts.map((post) => <Post key={post.id} post={post} />)
            ) : (
                <p>No posts available</p>
            )}
        </div>
    );
}