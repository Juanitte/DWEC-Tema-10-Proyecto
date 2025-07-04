/** @jsxImportSource @emotion/react */
import { useEffect, useState, useCallback } from "react";
import { handleInvalidToken } from "../../services/users-service";
import { getPostsByUser, hasNewComments } from "../../services/posts-service";
import { useTranslation } from "react-i18next";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import Post from "../home/post";
import Loading from "../shared/loading";
import { useTheme } from "@emotion/react";

export default function CommentTimeline({ user }) {
    const [posts, setPosts] = useState([]);
    const [queuedPosts, setQueuedPosts] = useState([]);
    const [newPostsAvailable, setNewPostsAvailable] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMorePosts, setHasMorePosts] = useState(true);
    const { t } = useTranslation();
    const theme = useTheme();

    const lastPostDate = posts.length > 0 ? new Date(posts[0].created) : null;

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" }); // o simplemente: window.scrollTo(0, 0);
    }, [user?.id]);

    const fetchPosts = useCallback(async () => {
        try {
            if (!user?.id) return;

            // 1) Llamo al endpoint que me devuelve un único array de “shared posts”
            const response = await getPostsByUser(user.id, page, true);
            if (response.status === 401) {
                handleInvalidToken();
                return;
            }

            // 2) Convierto a JSON: aquí “data” es un array de objetos PostDto
            const data = await response.json(); // ej: [ { id: 12, content: "...", created: "..." }, { ... } ]

            // 3) Filtrar solo elementos “truthy” (por si algún null/falso se colara)
            const allPosts = data.filter(Boolean);

            // 4) Eliminar duplicados (por si acaso la API devolviera posts repetidos)
            const uniquePosts = allPosts.filter(
                (post, index, self) => index === self.findIndex(p => p.id === post.id)
            );

            // 5) Insertar en el estado, manteniendo los anteriores y evitando ya-guardados
            setPosts(prev => {
                const combined = [
                    ...prev,
                    ...uniquePosts.filter(p => !prev.some(existing => existing.id === p.id))
                ];
                // Si recibimos menos de 10, asumimos que ya no hay más páginas
                if (uniquePosts.length < 10) setHasMorePosts(false);
                return combined;
            });

        } catch (err) {
            console.error("Error fetching comments:", err);
            handleInvalidToken();
        }
        finally {
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
                const response = await hasNewComments(lastPostDate.toISOString(), user.id);
                if (response.status === 401) {
                    handleInvalidToken();
                }
                const isNewAvailable = await response.json();
                if (isNewAvailable) {
                    // Volvemos a pedir la página 1 solo para ver qué hay de nuevo
                    const sources = [user];

                    const promises = sources.map(async (u) => {
                        const res = await getPostsByUser(u.id, 1, true);
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
                handleInvalidToken();
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
                        className={`bg-[${theme.colors.primary}] hover:bg-[${theme.colors.hoverPrimary}] text-[${theme.colors.text}] px-4 py-2 w-full`}
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
                    <Post key={post.id} post={post} isComment={true} parentAuthor={""} isUserPage={true} isCommentPage={true} />
                ))}
            </ul>

            <div ref={loaderRef} className="h-10 flex justify-center items-center">
                {isLoading && <Loading />}
            </div>
        </>
    );
}