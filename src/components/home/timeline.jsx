import { useEffect, useState } from "react";
import { getFollowing } from "../../services/users-service";
import Loading from "../shared/loading";
import Post from "./post";
import { getPostsByUser } from "../../services/posts-service";

export default function Timeline({ user, searchString, isForLikedPosts, isProfilePage }) {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMorePosts, setHasMorePosts] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                let allPosts = [];
                let followingResponse;
                if(!isProfilePage)
                    followingResponse = await getFollowing(user.id);
                const followingData = isProfilePage ? [user] : await followingResponse.json();

                if (followingData && Array.isArray(followingData) && followingData.length > 0) {
                    const postsPromises = followingData.map(async (u) => {
                        const postsResponse = await getPostsByUser(u.id, page);
                        const postsData = await postsResponse.json();
                        return postsData;
                    });

                    const postsArray = await Promise.all(postsPromises);

                    allPosts = postsArray.flat();

                    const uniquePosts = allPosts.filter((post, index, self) => 
                        index === self.findIndex((p) => p.id === post.id)
                    );

                    setPosts((prevPosts) => {
                        const combinedPosts = [
                            ...prevPosts, 
                            ...uniquePosts.filter((newPost) => !prevPosts.some((prevPost) => prevPost.id === newPost.id))
                        ];
                        if (uniquePosts.length < 10) {
                            setHasMorePosts(false);
                        }
                        return combinedPosts;
                    });
                }
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching posts:", error);
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, [page, user, searchString]);

    const loadMorePosts = () => {
        if (hasMorePosts && !isLoading) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    return (
        <>
            <ul className="list-none">
                {isLoading ? (
                    <Loading />
                ) : posts.length > 0 ? (
                    posts.map((post) => <Post key={post.id} post={post} isComment={false} isMainPost={false} />)
                ) : (
                    <p className="text-center text-white">No posts available</p>
                )}
            </ul>
            {hasMorePosts && (
                <button onClick={loadMorePosts}>Load more</button>
            )}
        </>
    );
}