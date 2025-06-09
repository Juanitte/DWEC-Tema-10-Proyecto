import { useEffect, useState, useCallback } from "react";
import { GetUsersFilter, handleInvalidToken } from "../../services/users-service";
import { getPostsFilter } from "../../services/posts-service";
import { useTranslation } from "react-i18next";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import Post from "../home/post";
import Loading from "../shared/loading";
import UserCard from "../shared/user-card";

export default function SearchTimeline({ user, searchString, isPosts = false, isUsers = false }) {
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const { t } = useTranslation();

    useEffect(() => {
        setPosts([]);
        setUsers([]);
        setPage(1);
        setHasMore(true);
        setIsLoading(true);
    }, [searchString, isPosts, isUsers]);

    const fetchPosts = useCallback(async () => {
        try {
            if (!isPosts) return;
            if (!user?.id) return;

            // 1) Llamo al endpoint que me devuelve un único array de “shared posts”
            const response = await getPostsFilter(searchString, page, true, 'Content', 'contains');
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
                if (uniquePosts.length < 10) setHasMore(false);
                return combined;
            });

            setIsLoading(false);
        } catch (err) {
            console.error("Error fetching posts:", err);
            setIsLoading(false);
        }
    }, [page, user, searchString, isPosts]);

    const fetchUsers = useCallback(async () => {
        try {
            if (!isUsers) return;
            if (!user?.id) return;

            // 1) Llamo al endpoint que me devuelve un único array de “shared posts”
            const response = await GetUsersFilter(searchString, page);
            if (response.status === 401) {
                handleInvalidToken();
                return;
            }

            // 2) Convierto a JSON: aquí “data” es un array de objetos PostDto
            const data = await response.json(); // ej: [ { id: 12, content: "...", created: "..." }, { ... } ]

            // 3) Filtrar solo elementos “truthy” (por si algún null/falso se colara)
            const allUsers = data.filter(Boolean);

            // 4) Eliminar duplicados (por si acaso la API devolviera posts repetidos)
            const uniqueUsers = allUsers.filter(
                (user, index, self) => index === self.findIndex(p => p.id === user.id)
            );

            // 5) Insertar en el estado, manteniendo los anteriores y evitando ya-guardados
            setUsers(prev => {
                const combined = [
                    ...prev,
                    ...uniqueUsers.filter(p => !prev.some(existing => existing.id === p.id))
                ];
                // Si recibimos menos de 10, asumimos que ya no hay más páginas
                if (uniqueUsers.length < 10) setHasMore(false);
                return combined;
            });

            setIsLoading(false);
        } catch (err) {
            console.error("Error fetching users:", err);
            setIsLoading(false);
        }
    }, [page, user]);

    useEffect(() => {
        fetchPosts();
        fetchUsers();
    }, [fetchPosts, fetchUsers]);

    const loadMore = () => {
        if (hasMore && !isLoading) setPage(prev => prev + 1);
    };

    const loaderRef = useInfiniteScroll(loadMore, hasMore, isLoading);

    return (
        <>
            <ul className="list-none">
                {
                    isPosts &&
                    posts.map(post => (
                        post.postId !== 0 ?
                            <Post key={post.id} post={post} isComment={true} parentAuthor={post.author} isExplorePage={true} />
                            :
                            <Post key={post.id} post={post} isComment={false} parentAuthor={post.author} isExplorePage={true} />
                    ))
                }
                {
                    isUsers &&
                    users.map(user => (
                        <UserCard key={user.id} user={user} />
                    ))
                }
            </ul>

            <div ref={loaderRef} className="h-10 flex justify-center items-center">
                {isLoading && <Loading />}
            </div>
        </>
    );
}