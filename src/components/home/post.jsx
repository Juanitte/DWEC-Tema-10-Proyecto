import { useEffect, useState } from "react";
import {
    dislikePost,
    getCommentCount,
    getLikeCount,
    getPostById,
    getSaveCount,
    getShareCount,
    likePost,
    postIsLiked,
    postIsSaved,
    postIsShared,
    savePost,
    sharePost,
    stopSavingPost,
    stopSharingPost,
} from "../../services/posts-service";
import { formatPostTime } from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import MediaAttachment from "../shared/media-attachment";
import { handleInvalidToken } from "../../services/users-service";

export default function Post({ post, isComment, parentAuthor,
    isUserPage = false, isSharePage = false, isSavePage = false,
    isCommentPage = false, isLikePage = false }) {
    const navigate = useNavigate();

    const [commentCount, setCommentCount] = useState(0);
    const [likeCount, setLikeCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [shareCount, setShareCount] = useState(0);
    const [isShared, setIsShared] = useState(false);
    const [saveCount, setSaveCount] = useState(0);
    const [isSaved, setIsSaved] = useState(false);
    const [parentAuthorNotPostPage, setParentAuthorNotPostPage] = useState("");

    // ─── Fetch inicial de contadores
    useEffect(() => {
        // Sacamos el userId del localStorage una sola vez
        const currentUserId = JSON.parse(localStorage.getItem("user"))?.id;

        const setParentAuthor = async () => {
            const parentPost = await getPostById(post.postId);
            const parentPostJson = await parentPost.json();
            setParentAuthorNotPostPage(parentPostJson.author);
        };

        const fetchCommentCount = async () => {
            try {
                const response = await getCommentCount(post.id);
                if (response.status === 401) {
                    handleInvalidToken();
                    return;
                }
                const count = await response.json();
                setCommentCount(count);
            } catch (error) {
                console.error("Error fetching comment count:", error);
                handleInvalidToken();
            }
        };

        const fetchLikeCount = async () => {
            try {
                const response = await getLikeCount(post.id);
                if (response.status === 401) {
                    handleInvalidToken();
                    return;
                }
                const count = await response.json();
                setLikeCount(count);
            } catch (error) {
                console.error("Error fetching like count:", error);
                handleInvalidToken();
            }
        };

        const fetchShareCount = async () => {
            try {
                const response = await getShareCount(post.id);
                if (response.status === 401) {
                    handleInvalidToken();
                    return;
                }
                const count = await response.json();
                setShareCount(count);
            } catch (error) {
                console.error("Error fetching share count:", error);
                handleInvalidToken();
            }
        };

        const fetchSaveCount = async () => {
            try {
                const response = await getSaveCount(post.id);
                if (response.status === 401) {
                    handleInvalidToken();
                    return;
                }
                const count = await response.json();
                setSaveCount(count);
            } catch (error) {
                console.error("Error fetching save count:", error);
                handleInvalidToken();
            }
        };

        const fetchIsLiked = async () => {
            if (!currentUserId) return;
            try {
                const response = await postIsLiked(currentUserId, post.id);
                if (response.status === 401) {
                    handleInvalidToken();
                    return;
                }
                const liked = await response.json();
                setIsLiked(liked);
            } catch (error) {
                console.error("Error fetching isLiked:", error);
                handleInvalidToken();
            }
        };

        const fetchIsShared = async () => {
            if (!currentUserId) return;
            try {
                const response = await postIsShared(currentUserId, post.id);
                if (response.status === 401) {
                    handleInvalidToken();
                    return;
                }
                const shared = await response.json();
                setIsShared(shared);
            } catch (error) {
                console.error("Error fetching isShared:", error);
                handleInvalidToken();
            }
        };

        const fetchIsSaved = async () => {
            if (!currentUserId) return;
            try {
                const response = await postIsSaved(currentUserId, post.id);
                if (response.status === 401) {
                    handleInvalidToken();
                    return;
                }
                const shared = await response.json();
                setIsSaved(shared);
            } catch (error) {
                console.error("Error fetching isSaved:", error);
                handleInvalidToken();
            }
        };
        if (isCommentPage || isLikePage || isSharePage || isSavePage) {
            setParentAuthor();
        }

        // Llamadas iniciales
        fetchIsLiked();
        fetchIsShared();
        fetchIsSaved();
        fetchCommentCount();
        fetchLikeCount();
        fetchShareCount();
        fetchSaveCount();

        // Intervalo cada 10s
        const interval = setInterval(() => {
            fetchCommentCount();
            fetchLikeCount();
            fetchShareCount();
            fetchSaveCount();
        }, 10000);

        return () => clearInterval(interval);
    }, [post.id]);

    // ─── Función para alternar “like” / “dislike”
    const fetchLike = async () => {
        const currentUserId = JSON.parse(localStorage.getItem("user"))?.id;
        if (!currentUserId) return;

        try {
            if (isLiked) {
                // Si ya estaba “like”, hacemos “dislike”
                await dislikePost(currentUserId, post.id);
                setLikeCount((prev) => Math.max(prev - 1, 0));
                setIsLiked(false);
            } else {
                // Si no estaba “like”, hacemos “like”
                await likePost(currentUserId, post.id);
                setLikeCount((prev) => prev + 1);
                setIsLiked(true);
            }
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };

    const handleLike = (event) => {
        event.stopPropagation();
        fetchLike();
    };

    // ─── Función para alternar “share” / “stopShare”
    const fetchShare = async () => {
        const currentUserId = JSON.parse(localStorage.getItem("user"))?.id;
        if (!currentUserId) return;

        try {
            if (isShared) {
                // Si ya estaba “share”, hacemos “stopShare”
                await stopSharingPost(currentUserId, post.id);
                setShareCount((prev) => Math.max(prev - 1, 0));
                setIsShared(false);
            } else {
                // Si no estaba “share”, hacemos “share”
                await sharePost(currentUserId, post.id);
                setShareCount((prev) => prev + 1);
                setIsShared(true);
            }
        } catch (error) {
            console.error("Error toggling share:", error);
        }
    };

    const handleShare = (event) => {
        event.stopPropagation();
        fetchShare();
    };

    // ─── Función para alternar “save” / “stopSave”
    const fetchSave = async () => {
        const currentUserId = JSON.parse(localStorage.getItem("user"))?.id;
        if (!currentUserId) return;

        try {
            if (isSaved) {
                // Si ya estaba “save”, hacemos “stopSave”
                await stopSavingPost(currentUserId, post.id);
                setSaveCount((prev) => Math.max(prev - 1, 0));
                setIsSaved(false);
            } else {
                // Si no estaba “share”, hacemos “share”
                await savePost(currentUserId, post.id);
                setSaveCount((prev) => prev + 1);
                setIsSaved(true);
            }
        } catch (error) {
            console.error("Error toggling save:", error);
        }
    };

    const handleSave = (event) => {
        event.stopPropagation();
        fetchSave();
    };

    // ─── Navegación
    const goToPostPage = (postId) => {
        navigate(`/post/${postId}`);
    };

    const goToUserPage = (userId, event) => {
        event.stopPropagation();
        navigate(`/user/${userId}`);
    };

    return (
        <>
            {
                isComment && isUserPage && !isCommentPage && !isSharePage && !isSavePage && !isLikePage ? null :
                    <li onClick={() => goToPostPage(post.id)} className="cursor-pointer">
                        <article className="hover:bg-green-800 transition duration-350 ease-in-out">
                            {
                                post.postId !== 0 && isComment && parentAuthor != null ? (
                                    isCommentPage || isLikePage || isSharePage || isSavePage ? (
                                        <p
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                goToPostPage(post.postId);
                                            }}
                                            className="hover:cursor-pointer pl-4 pt-2 text-sm leading-5 font-medium text-gray-400"
                                        >
                                            Replying to {parentAuthorNotPostPage}
                                        </p>
                                    ) : (
                                        <p
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                goToPostPage(post.postId);
                                            }}
                                            className="hover:cursor-pointer pl-4 pt-2 text-sm leading-5 font-medium text-gray-400"
                                        >
                                            Replying to {parentAuthor}
                                        </p>
                                    )

                                ) : null
                            }

                            <div className="flex flex-shrink-0 p-4 pb-0">
                                <a className="flex-shrink-0 group block">
                                    <div className="flex items-center">
                                        <div>
                                            <img
                                                onClick={(e) => goToUserPage(post.userId, e)}
                                                className="bg-gray-300 inline-block h-10 w-10 rounded-full"
                                                src={post.authorAvatar}
                                                alt=""
                                            />
                                        </div>
                                        <div className="pl-3">
                                            <p
                                                onClick={(e) => goToUserPage(post.userId, e)}
                                                className="text-base leading-6 font-medium text-white"
                                            >
                                                {post.author}
                                                <span className="pl-2 text-sm leading-5 font-medium text-gray-400 group-hover:text-gray-300 transition ease-in-out duration-150">
                                                    {post.authorTag} ~ {formatPostTime(post.created)}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </a>
                            </div>

                            <div>
                                <p className="pl-16 text-base font-medium text-white">{post.content}</p>

                                {post.attachments.length > 0 && (
                                    <div className="md:flex-shrink px-6 pt-3">
                                        <div className="flex flex-col items-center rounded-lg w-full space-y-4">
                                            {post.attachments.map((attachment) => (
                                                <MediaAttachment
                                                    key={attachment.id}
                                                    attachment={attachment}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center justify-around py-4">
                                    {/* ➤ Comentarios */}
                                    <div className="flex-1 flex items-center justify-center text-white text-xs text-gray-400 hover:text-white transition duration-350 ease-in-out">
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                                            <g>
                                                <path
                                                    d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.335-.75-.75-.75h-.396c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z">
                                                </path>
                                            </g>
                                        </svg>
                                        <span className="pl-2">{commentCount}</span>
                                    </div>

                                    {/* ➤ Compartidos */}
                                    {isShared ? (
                                        <div
                                            onClick={(e) => handleShare(e)}
                                            className="flex-1 flex items-center justify-center text-white text-xs text-blue-400 hover:text-blue-400 transition duration-350 ease-in-out">
                                            <svg viewBox="0 0 24 24" fill="royalblue" className="w-5 h-5 mr-2">
                                                <g>
                                                    <path
                                                        d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z">
                                                    </path>
                                                </g>
                                            </svg>
                                            <span className="pl-2">{shareCount}</span>
                                        </div>
                                    ) : (
                                        <div
                                            onClick={(e) => handleShare(e)}
                                            className="flex-1 flex items-center justify-center text-white text-xs text-gray-400 hover:text-blue-400 transition duration-350 ease-in-out">
                                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                                                <g>
                                                    <path
                                                        d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z">
                                                    </path>
                                                </g>
                                            </svg>
                                            <span className="pl-2">{shareCount}</span>
                                        </div>
                                    )}


                                    {/* ➤ “Like” / “Dislike” */}
                                    {isLiked ? (
                                        <div
                                            onClick={(e) => handleLike(e)}
                                            className="flex-1 flex items-center justify-center text-white text-xs text-red-400 hover:text-gray-400 transition duration-350 ease-in-out"
                                        >
                                            <svg viewBox="0 0 24 24" fill="red" className="w-5 h-5 mr-2">
                                                <g>
                                                    <path
                                                        d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.823-4.255-3.903-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z">
                                                    </path>
                                                </g>
                                            </svg>
                                            <span className="pl-2 text-red-500">{likeCount}</span>
                                        </div>
                                    ) : (
                                        <div
                                            onClick={(e) => handleLike(e)}
                                            className="flex-1 flex items-center justify-center text-white text-xs text-gray-400 hover:text-red-600 transition duration-350 ease-in-out"
                                        >
                                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                                                <g>
                                                    <path
                                                        d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.823-4.255-3.903-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z">
                                                    </path>
                                                </g>
                                            </svg>
                                            <span className="pl-2">{likeCount}</span>
                                        </div>
                                    )}

                                    {/* ➤ “Save” / “StopSave” */}
                                    {isSaved ? (
                                        <div
                                            onClick={(e) => handleSave(e)}
                                            className="flex-1 flex items-center justify-center text-white text-xs text-orange-400 hover:text-orange-400 transition duration-350 ease-in-out">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 384 512" fill="orange">
                                                <path d="M0 48C0 21.5 21.5 0 48 0l0 48 0 393.4 130.1-92.9c8.3-6 19.6-6 27.9 0L336 441.4 336 48 48 48 48 0 336 0c26.5 0 48 21.5 48 48l0 440c0 9-5 17.2-13 21.3s-17.6 3.4-24.9-1.8L192 397.5 37.9 507.5c-7.3 5.2-16.9 5.9-24.9 1.8S0 497 0 488L0 48z" />
                                            </svg>
                                            <span className="pl-2 text-orange-300">{saveCount}</span>
                                        </div>
                                    ) : (
                                        <div
                                            onClick={(e) => handleSave(e)}
                                            className="flex-1 flex items-center justify-center text-white text-xs text-gray-400 hover:text-orange-400 transition duration-350 ease-in-out">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 384 512" fill="currentColor">
                                                <path d="M0 48C0 21.5 21.5 0 48 0l0 48 0 393.4 130.1-92.9c8.3-6 19.6-6 27.9 0L336 441.4 336 48 48 48 48 0 336 0c26.5 0 48 21.5 48 48l0 440c0 9-5 17.2-13 21.3s-17.6 3.4-24.9-1.8L192 397.5 37.9 507.5c-7.3 5.2-16.9 5.9-24.9 1.8S0 497 0 488L0 48z" />
                                            </svg>
                                            <span className="pl-2">{saveCount}</span>
                                        </div>
                                    )}

                                </div>
                            </div>

                            <hr className="border-green-800" />
                        </article>
                    </li>
            }
        </>
    );
}