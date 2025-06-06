import { useEffect, useState, useCallback } from "react";
import { getFollowing, handleInvalidToken } from "../../services/users-service";
import { getPostsByUser, getSavedPosts, getSharedPosts, hasNewPosts } from "../../services/posts-service";
import { useTranslation } from "react-i18next";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import Post from "../home/post";
import Loading from "../shared/loading";

export default function RepostTimeline({ user }) {
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

            const response = await getSavedPosts(user.id, page);
            if (response.status === 401) {
                handleInvalidToken();
                return;
            }

            const data = await response.json();

            const allPosts = data.filter(Boolean);

            const uniquePosts = allPosts.filter(
                (post, index, self) => index === self.findIndex(p => p.id === post.id)
            );

            setPosts(prev => {
                const combined = [
                    ...prev,
                    ...uniquePosts.filter(p => !prev.some(existing => existing.id === p.id))
                ];
                if (uniquePosts.length < 10) setHasMorePosts(false);
                return combined;
            });

            setIsLoading(false);
        } catch (err) {
            console.error("Error fetching shared posts:", err);
            setIsLoading(false);
        }
    }, [page, user]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    // 👀 Comprobación periódica de nuevos postsAdd commentMore actions
    useEffect(() => {
        if (!user?.id || !lastPostDate) return;

        const interval = setInterval(async () => {
            try {
                const response = await hasNewPosts(lastPostDate.toISOString(), user.id, true);
                if (response.status === 401) {
                    handleInvalidToken();
                }
                const isNewAvailable = await response.json();
                if (isNewAvailable) {
                    // Volvemos a pedir la página 1 solo para ver qué hay de nuevo
                    const sources = true ? [user] : await (await getFollowing(user.id)).json();

                    const promises = sources.map(async (u) => {
                        const res = await getPostsByUser(u.id, 1);
                        return await res.json();
                    });

                    const newPostsRaw = (await Promise.all(promises)).flat();
                    const filtered = newPostsRaw
                        .filter(p => !posts.some(existing => existing.id === p.id))
                        .sort((a, b) => new Date(b.created) - new Date(a.created));

                    if (filtered.length > 0) {
                        setQueuedPosts(filtered);
                        setNewPostsAvailable(true);
                    }
                }
            } catch (e) {
                console.error("Error checking for new posts:", e);
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [user, lastPostDate, posts]);

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
                        className="bg-green-600 hover:bg-green-400 text-white px-4 py-2 w-full"
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
                    post.postId !== 0 ?
                        <Post key={post.id} post={post} isComment={true} isUserPage={true} />
                        :
                        <Post key={post.id} post={post} isComment={false} isUserPage={true} />
                ))}
            </ul>

            <div ref={loaderRef} className="h-10 flex justify-center items-center">
                {isLoading && <Loading />}
            </div>
        </>
    );
}