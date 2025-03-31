import { useEffect, useState } from "react";
import { dislikePost, getCommentCount, getLikeCount, getShareCount, likePost, postIsLiked } from "../../services/posts-service";
import { formatPostTime } from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import ImageComponent from "../shared/image-component";

export default function Post({ post, isMainPost }) {

    const navigate = useNavigate();

    const [commentCount, setCommentCount] = useState(0);
    const [likeCount, setLikeCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [shareCount, setShareCount] = useState(0);

    useEffect(() => {
        const fetchCommentCount = async () => {
            try {
                let commentResponse;
                await getCommentCount(post.id)
                    .then((response) => response)
                    .then((data) => (commentResponse = data));
                setCommentCount(await commentResponse.json());
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };

        const fetchLikeCount = async () => {
            try {
                let likeResponse;
                await getLikeCount(post.id)
                    .then((response) => response)
                    .then((data) => (likeResponse = data));
                setLikeCount(await likeResponse.json());
            } catch (error) {
                console.error("Error fetching likes:", error);
            }
        };

        const fetchShareCount = async () => {
            try {
                let shareResponse;
                await getShareCount(post.id)
                    .then((response) => response)
                    .then((data) => (shareResponse = data));
                setShareCount(await shareResponse.json());
            } catch (error) {
                console.error("Error fetching likes:", error);
            }
        };

        const fetchIsLiked = async () => {
            try {
                let isLikedResponse;
                await postIsLiked(JSON.parse(localStorage.getItem("user")).id, post.id)
                    .then((response) => response)
                    .then((data) => (isLikedResponse = data));
                setIsLiked(await isLikedResponse.json());
            } catch (error) {
                console.error("Error fetching likes:", error);
            }
        };

        fetchIsLiked();
        fetchCommentCount();
        fetchLikeCount();
        fetchShareCount();

        const interval = setInterval(() => {
            fetchCommentCount
            fetchLikeCount
            fetchShareCount
        }, 10000);

        return () => clearInterval(interval);

    }, []);

    const fetchLike = async () => {
        const userId = JSON.parse(localStorage.getItem("user")).id;
        if (isLiked) {
            await dislikePost(userId, post.id.toString());
            setLikeCount((prev) => Math.max(prev - 1, 0));
            setIsLiked(false);
        } else {
            await likePost(userId, post.id.toString());
            setLikeCount((prev) => prev + 1);
            setIsLiked(true);
        }
    }

    const handleLike = (event) => {
        event.stopPropagation();
        fetchLike();
    }

    const goToPostPage = (postId) => {
        navigate(`/post/${postId}`);
    }

    const goToUserPage = (userId, event) => {
        event.stopPropagation();
        navigate(`/user/${userId}`);
    }

    return (
        <>
            <li onClick={() => goToPostPage(post.id)} className="hover: cursor-pointer">
                <article className="hover:bg-gray-800 transition duration-350 ease-in-out">
                        {
                            post.postId !== 0 && isMainPost ?
                                <p
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        goToPostPage(post.postId)
                                    }}
                                    className="hover:cursor-pointer pl-4 pt-2 text-sm leading-5 font-medium text-gray-400">
                                    Replying to {post.author}
                                </p>
                            :
                                <></>
                        }
                    <div className="flex flex-shrink-0 p-4 pb-0">
                        <a onClick={null} className="flex-shrink-0 group block">
                            <div className="flex items-center">
                                <div>
                                    <img
                                        onClick={(event) => goToUserPage(post.userId, event)}
                                        className="bg-blue-400 inline-block h-10 w-10 rounded-full"
                                        src={post.authorAvatar}
                                        alt="" />
                                </div>
                                <div className="pl-3">
                                    <p onClick={(event) => goToUserPage(post.userId, event)} className="text-base leading-6 font-medium text-white">
                                        {post.author}
                                        <span
                                            className="pl-2 text-sm leading-5 font-medium text-gray-400 group-hover:text-gray-300 transition ease-in-out duration-150">
                                            {post.authorTag} ~ {formatPostTime(post.created)}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </a>
                    </div>


                    <div className="pl-16">
                        <p className="text-base width-auto font-medium text-white flex-shrink">
                            {post.content}
                        </p>
                        {
                            post.attachments.length > 0 ?
                                <div className="md:flex-shrink pr-6 pt-3">
                                    <div className="flex flex-col items-center rounded-lg w-full h-64">

                                        {
                                            post.attachments.map((attachment) => {
                                                return <ImageComponent key={attachment.id} image={attachment} />
                                            })
                                        }
                                    </div>
                                </div>
                                :
                                <></>
                        }

                        <div className="flex items-center py-4">
                            <div
                                className="flex-1 flex items-center text-white text-xs text-gray-400 hover:text-blue-400 transition duration-350 ease-in-out">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                                    <g>
                                        <path
                                            d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.335-.75-.75-.75h-.396c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z">
                                        </path>
                                    </g>
                                </svg>
                                <span className="pl-2">{commentCount}</span>
                            </div>
                            <div
                                className="flex-1 flex items-center text-white text-xs text-gray-400 hover:text-green-400 transition duration-350 ease-in-out">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                                    <g>
                                        <path
                                            d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z">
                                        </path>
                                    </g>
                                </svg>
                                <span className="pl-2">{shareCount}</span>
                            </div>
                            {
                                isLiked ?
                                    <div
                                        onClick={(event) => handleLike(event)}
                                        className="flex-1 flex items-center text-white text-xs text-red-600 hover:text-gray-400 transition duration-350 ease-in-out">
                                        <svg viewBox="0 0 24 24" fill="red" className="w-5 h-5 mr-2">
                                            <g>
                                                <path
                                                    d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.823-4.255-3.903-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z">
                                                </path>
                                            </g>
                                        </svg>
                                        <span className="pl-2 text-red-600">{likeCount}</span>
                                    </div>
                                    :
                                    <div
                                        onClick={(event) => handleLike(event)}
                                        className="flex-1 flex items-center text-white text-xs text-gray-400 hover:text-red-600 transition duration-350 ease-in-out">
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                                            <g>
                                                <path
                                                    d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.823-4.255-3.903-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z">
                                                </path>
                                            </g>
                                        </svg>
                                        <span className="pl-2">{likeCount}</span>
                                    </div>
                            }
                            <div
                                className="flex-1 flex items-center text-white text-xs text-gray-400 hover:text-blue-400 transition duration-350 ease-in-out">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 384 512" fill="silver">
                                    <path d="M0 48C0 21.5 21.5 0 48 0l0 48 0 393.4 130.1-92.9c8.3-6 19.6-6 27.9 0L336 441.4 336 48 48 48 48 0 336 0c26.5 0 48 21.5 48 48l0 440c0 9-5 17.2-13 21.3s-17.6 3.4-24.9-1.8L192 397.5 37.9 507.5c-7.3 5.2-16.9 5.9-24.9 1.8S0 497 0 488L0 48z" />
                                </svg>
                                <span className="pl-2">0</span>
                            </div>
                        </div>

                    </div>
                    <hr className="border-gray-800" />
                </article>
            </li>
        </>
    )
}