import { useEffect, useState, useCallback } from "react";
import { getFollowing } from "../../services/users-service";
import Loading from "../shared/loading";
import Post from "./post";
import { getPostsByUser, hasNewPosts } from "../../services/posts-service";
import { useTranslation } from "react-i18next";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import useSignalRNewPosts from "../hooks/useSignalRNewPosts";

export default function Timeline({ user, searchString, isForLikedPosts, isProfilePage }) {
    const [posts, setPosts] = useState([]);
    const [queuedPosts, setQueuedPosts] = useState([]);
    const [newPostsAvailable, setNewPostsAvailable] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMorePosts, setHasMorePosts] = useState(true);
    const { t } = useTranslation();

    const lastPostDate = posts.length > 0 ? new Date(posts[0].created) : null;

    const fetchPosts = useCallback(async () => {
        try {
            if (!user?.id) return;

            let allPosts = [];
            const followingData = isProfilePage
                ? [user]
                : await (await getFollowing(user.id)).json();

            if (followingData?.length > 0) {
                const postsPromises = followingData.map(async (u) => {
                    if (!u?.id) return [];
                    const res = await getPostsByUser(u.id, page);
                    return await res.json();
                });

                const postsArray = await Promise.all(postsPromises);
                allPosts = postsArray.flat().filter(Boolean);

                const uniquePosts = allPosts.filter(
                    (post, index, self) => index === self.findIndex((p) => p?.id === post.id)
                );

                setPosts((prev) => {
                    const combined = [
                        ...prev,
                        ...uniquePosts.filter(p => !prev.some(existing => existing.id === p.id))
                    ];
                    if (uniquePosts.length < 10) setHasMorePosts(false);
                    return combined;
                });
            }

            setIsLoading(false);
        } catch (err) {
            console.error("Error fetching posts:", err);
            setIsLoading(false);
        }
    }, [page, user, isProfilePage]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    useSignalRNewPosts((newPost) => {
        if (!posts.some(p => p.id === newPost.id)) {
            setQueuedPosts((prev) => [newPost, ...prev]);
            setNewPostsAvailable(true);
        }
    });

    const showNewPosts = () => {
        setPosts(prev => [...queuedPosts, ...prev]);
        setQueuedPosts([]);
        setNewPostsAvailable(false);
    };

    const loadMorePosts = () => {
        if (hasMorePosts && !isLoading) setPage(prev => prev + 1);
    };

    const loaderRef = useInfiniteScroll(loadMorePosts, hasMorePosts, isLoading);

    return (
        <>
            {newPostsAvailable && (
                <div className="flex justify-center">
                    <button
                        onClick={showNewPosts}
                        className="bg-green-600 hover:bg-green-400 text-white px-4 py-1 w-full"
                    >
                        {
                            queuedPosts.length === 1
                            ?
                                t('TIMELINE.NEW-POST', { count: queuedPosts.length })
                            :
                                t('TIMELINE.NEW-POSTS', { count: queuedPosts.length })
                        }
                    </button>
                </div>
            )}

            <ul className="list-none">
                {posts.map(post => (
                    <Post key={post.id} post={post} isComment={false} isMainPost={false} />
                ))}
            </ul>

            <div ref={loaderRef} className="h-10 flex justify-center items-center">
                {isLoading && <Loading />}
            </div>
        </>
    );
}