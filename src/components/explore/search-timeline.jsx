import { useEffect, useState, useCallback, useRef } from "react";
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
            if (!isPosts || !user?.id) return;

            const response = await getPostsFilter(searchString, page, true, 'Content', 'contains');
            if (response.status === 401) return handleInvalidToken();

            const json = await response.json();
            const data = Array.isArray(json.posts) ? json.posts : [];

            const uniquePosts = data.filter(
                (post, index, self) => index === self.findIndex(p => p.id === post.id)
            );

            setPosts(prev => {
                const combined = [
                    ...prev,
                    ...uniquePosts.filter(p => !prev.some(existing => existing.id === p.id))
                ];
                if (uniquePosts.length < 10) setHasMore(false);
                return combined;
            });

            setIsLoading(false);
        } catch (err) {
            console.error("Error fetching posts:", err);
            setIsLoading(false);
        }
    }, [user?.id, isPosts, searchString, page]);

    const fetchUsers = useCallback(async () => {
        try {
            if (!isUsers || !user?.id) return;

            const response = await GetUsersFilter(page, searchString);
            if (response.status === 401) {
                handleInvalidToken();
                return;
            }

            const data = await response.json();
            const allUsers = data.filter(Boolean);

            const uniqueUsers = allUsers.filter(
                (user, index, self) => index === self.findIndex(p => p.id === user.id)
            );

            setUsers(prev => {
                const combined = [
                    ...prev,
                    ...uniqueUsers.filter(p => !prev.some(existing => existing.id === p.id))
                ];
                if (uniqueUsers.length < 10) setHasMore(false);
                return combined;
            });

            setIsLoading(false);
        } catch (err) {
            console.error("Error fetching users:", err);
            setIsLoading(false);
        }
    }, [user?.id, isUsers, searchString, page]);

    useEffect(() => {
        if (isPosts) fetchPosts();
    }, [fetchPosts, isPosts]);

    useEffect(() => {
        if (isUsers) fetchUsers();
    }, [fetchUsers, isUsers]);

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
                    users
                        .filter(u => +u.id !== +user.id)  // Filtrar usuario logeado
                        .map(user => (
                            <div key={user.id}>
                                <UserCard user={user} />
                                <hr className="border-green-800" />
                            </div>
                        ))
                }
            </ul>

            <div ref={loaderRef} className="h-10 flex justify-center items-center">
                {isLoading && <Loading />}
            </div>
        </>
    );
}