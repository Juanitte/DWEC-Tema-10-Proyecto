import { useState, useEffect, useCallback, useRef } from "react";
import { getComments } from "../../services/posts-service";
import { handleInvalidToken } from "../../services/users-service";
import Post from "../home/post";
import { useTranslation } from "react-i18next";
import Loading from "../shared/loading";
import useInfiniteScroll from "../hooks/useInfiniteScroll";

export default function CommentFeed({ parentAuthor, postId }) {
    const [comments, setComments] = useState([]);
    const commentsRef = useRef([]);
    const [queuedComments, setQueuedComments] = useState([]);
    const [newCommentsAvailable, setNewCommentsAvailable] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMoreComments, setHasMoreComments] = useState(true);
    const { t } = useTranslation();

    const lastCommentDate = commentsRef.current.length > 0
        ? new Date(commentsRef.current[0].created)
        : null;

    const fetchComments = useCallback(async () => {
        try {
            const res = await getComments(postId, page);
            if (res.status === 401) {
                handleInvalidToken();
                return;
            }

            const data = await res.json();
            const filtered = data.filter(c => !commentsRef.current.some(existing => existing.id === c.id));

            setComments(prev => {
                const updated = [...prev, ...filtered];
                commentsRef.current = updated;
                return updated;
            });

            if (filtered.length < 10) setHasMoreComments(false);
            setIsLoading(false);
        } catch (error) {
            console.error("Error loading comments:", error);
            setIsLoading(false);
            handleInvalidToken();
        }
    }, [postId, page]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const checkForNewComments = useCallback(async () => {
        if (!postId || !lastCommentDate) return;

        try {
            const res = await getComments(postId, 1);
            if (res.status === 401) {
                handleInvalidToken();
                return;
            }

            const data = await res.json();
            const filtered = data
                .filter(c => !commentsRef.current.some(existing => existing.id === c.id))
                .sort((a, b) => new Date(b.created) - new Date(a.created));

            if (filtered.length > 0) {
                setQueuedComments(filtered);
                setNewCommentsAvailable(true);
            }
        } catch (error) {
            console.error("Error checking for new comments:", error);
            handleInvalidToken();
        }
    }, [postId, lastCommentDate]);

    useEffect(() => {
        const interval = setInterval(checkForNewComments, 30000);
        return () => clearInterval(interval);
    }, [checkForNewComments]);

    const showNewComments = () => {
        setComments(prev => {
            const updated = [...queuedComments, ...prev];
            commentsRef.current = updated;
            return updated;
        });
        setQueuedComments([]);
        setNewCommentsAvailable(false);
    };

    const loadMoreComments = () => {
        if (hasMoreComments && !isLoading) setPage(prev => prev + 1);
    };

    const loaderRef = useInfiniteScroll(loadMoreComments, hasMoreComments, isLoading);

    return (
        <>
            {newCommentsAvailable && (
                <div className="flex justify-center">
                    <button
                        onClick={showNewComments}
                        className="bg-green-600 hover:bg-green-400 text-white px-4 py-2 w-full"
                    >
                        {queuedComments.length === 1
                            ? t("TIMELINE.NEW-POST", { count: 1 })
                            : t("TIMELINE.NEW-POSTS", { count: queuedComments.length })}
                    </button>
                </div>
            )}

            <ul className="list-none">
                {comments.map(comment => (
                    <Post
                        key={comment.id}
                        post={comment}
                        isUserPage={false}
                        isComment={true}
                        parentAuthor={parentAuthor}
                    />
                ))}
            </ul>

            <div ref={loaderRef} className="h-10 flex justify-center items-center">
                {isLoading && <Loading />}
            </div>
        </>
    );
}