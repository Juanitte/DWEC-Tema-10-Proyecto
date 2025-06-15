/** @jsxImportSource @emotion/react */
import { useEffect, useState, useCallback } from "react";
import { getFollowing, getFollowingIds, getUserById, handleInvalidToken } from "../../services/users-service";
import Loading from "../shared/loading";
import Post from "./post";
import { getFeed, getPostsByUser, hasNewPosts } from "../../services/posts-service";
import { useTranslation } from "react-i18next";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import { css, useTheme } from "@emotion/react";

export default function Timeline({ user, isProfilePage }) {
    const [posts, setPosts] = useState([]);
    const [queuedPosts, setQueuedPosts] = useState([]);
    const [newPostsAvailable, setNewPostsAvailable] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMorePosts, setHasMorePosts] = useState(true);
    const theme = useTheme();
    const { t } = useTranslation();

    const lastPostDate = posts.length > 0 ? new Date(posts[0].isShared ? posts[0].sharedAt : posts[0].created) : null;

    useEffect(() => {
        setPosts([]);
        setQueuedPosts([]);
        setPage(1);
        setNewPostsAvailable(false);
        setIsLoading(true);
        setHasMorePosts(true);
    }, [user?.id, isProfilePage]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" }); // o simplemente: window.scrollTo(0, 0);
    }, [user?.id, isProfilePage]);

    const fetchPosts = useCallback(async () => {
        if (!user?.id) return;

        setIsLoading(true);
        try {
            // elijo el endpoint
            const res = isProfilePage
                ? await getPostsByUser(user.id, page, false)
                : await getFeed(user.id, page);

            if (res.status === 401) {
                handleInvalidToken();
                return;
            }

            const data = await res.json();
            
            if (data.length === 0) {
                const userIds = await getFollowingIds(user.id);
                if (userIds.length === 0) {
                    setHasMorePosts(false);
                }else{
                    res = await getPostsByUser(userIds[0], page, false);
                    if (res.status === 401) {
                        handleInvalidToken();
                        return;
                    }
                    data = await res.json();
                    if (data.length === 0) {
                        setHasMorePosts(false);
                    }
                }
            }
            // asumimos que vienen en un array
            const received = Array.isArray(data) ? data : [];

            if (!isProfilePage) {
                // 1) crea un array de promesas
                const fillers = received
                    .filter(p => p.isShared)
                    .map(async p => {
                        const res = await getUserById(p.sharedUserId);
                        if (res.ok) {
                            const u = await res.json();
                            p.sharedBy = u.userName;
                        }
                    });
                // 2) espera a todas
                await Promise.all(fillers);
            }

            // paginación: si menos de pageSize, no hay más
            if (received.length < 10) {
                setHasMorePosts(false);
            }

            setPosts(prev => {
                // añadimos sin duplicados
                const combined = [
                    ...prev,
                    ...received.filter(p => !prev.some(x => x.id === p.id))
                ];
                return combined;
            });
        } catch (err) {
            console.error("Error fetching posts:", err);
            setHasMorePosts(false);
            //handleInvalidToken();
        } finally {
            setIsLoading(false);
        }
    }, [user?.id, page, isProfilePage]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    // 👀 Comprobación periódica de nuevos posts
    useEffect(() => {
        if (!user?.id || !lastPostDate) return;

        const interval = setInterval(async () => {
            try {
                // 1) Checkeo con el único endpoint
                const response = await hasNewPosts(
                    lastPostDate.toISOString(),
                    user.id,
                    isProfilePage
                );
                if (response.status === 401) {
                    handleInvalidToken();
                    return;
                }
                const isNewAvailable = await response.json();
                if (!isNewAvailable) return;

                // 2) Traemos la página 1 correcta
                const fetchRes = isProfilePage
                    ? await getPostsByUser(user.id, 1)
                    : await getFeed(user.id, 1);

                if (fetchRes.status === 401) {
                    handleInvalidToken();
                    return;
                }
                const freshRaw = await fetchRes.json();
                const fresh = Array.isArray(freshRaw) ? freshRaw : [];

                // 3) Si es feed, rellenamos sharedBy
                if (!isProfilePage) {
                    await Promise.all(
                        fresh
                            .filter((p) => p.isShared)
                            .map(async (p) => {
                                const uRes = await getUserById(p.sharedUserId);
                                if (uRes.ok) {
                                    const u = await uRes.json();
                                    p.sharedBy = u.userName;
                                }
                            })
                    );
                }

                // 4) Filtramos los que ya teníamos y ordenamos
                const newItems = fresh
                    .filter((p) => !posts.some((ex) => ex.id === p.id))
                    .sort(
                        (a, b) =>
                            new Date(
                                b.isShared ? b.sharedAt : b.created
                            ) -
                            new Date(
                                a.isShared ? a.sharedAt : a.created
                            )
                    );

                if (newItems.length > 0) {
                    setQueuedPosts(newItems);
                    setNewPostsAvailable(true);
                }
            } catch (e) {
                console.error("Error checking for new posts:", e);
                handleInvalidToken();
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [user, isProfilePage, lastPostDate, posts]);

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
                        className="px-4 py-2 w-full"
                        css={css`
                            background-color: ${theme.colors.primary};
                            &:hover {
                                background-color: ${theme.colors.secondary};
                            }
                            color: ${theme.colors.text};
                        `}
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
                    post.isShared ?
                        post.postId !== 0 ?
                            <Post key={post.id} post={post} isSharedPost={true} isComment={true} isUserPage={isProfilePage} />
                            :
                            <Post key={post.id} post={post} isSharedPost={true} isComment={false} isUserPage={isProfilePage} />
                        :
                        post.postId !== 0 ?
                            <Post key={post.id} post={post} isComment={true} isUserPage={isProfilePage} />
                            :
                            <Post key={post.id} post={post} isComment={false} isUserPage={isProfilePage} />
                ))}
            </ul>

            <div ref={loaderRef} className="h-10 flex justify-center items-center">
                {isLoading && <Loading />}
            </div>
        </>
    );
}