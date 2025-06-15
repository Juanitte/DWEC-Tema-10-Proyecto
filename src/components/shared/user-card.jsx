/** @jsxImportSource @emotion/react */
import { useTranslation } from "react-i18next";
import { checkIfFollowing, follow, getAvatar, handleInvalidToken, unfollow } from "../../services/users-service";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { css , useTheme} from '@emotion/react';

export default function UserCard({ user, isFollowSuggestions = false }) {
    const [isFollowing, setIsFollowing] = useState(false);
    const [userAvatar, setUserAvatar] = useState(user.avatar);
    const avatarUrlRef = useRef(null);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const theme = useTheme();

    useEffect(() => {
        let isMounted = true;
        (async () => {
            try {
                const res = await getAvatar(user.id);
                if (res.ok) {
                    const blob = await res.blob();
                    const objectUrl = URL.createObjectURL(blob);
                    if (isMounted) {
                        setUserAvatar(objectUrl);
                        avatarUrlRef.current = objectUrl;
                    }
                } else if (res.status === 404) {
                    console.warn("Avatar no encontrado, usar fallback");
                } else if (res.status === 401) {
                    handleInvalidToken();
                } else {
                    console.error("Error al obtener avatar:", await res.text());
                }
            } catch (err) {
                console.error("Excepción al fetch-avatar:", err);
            }
        })();

        // Cleanup: revocar object URL para liberar memoria
        return () => {
            isMounted = false;
            if (avatarUrlRef.current) URL.revokeObjectURL(avatarUrlRef.current);
        };
    }, [user.id]);

    useEffect(() => {
        const checkFollowStatus = async () => {
            const loggedUser = JSON.parse(localStorage.getItem("user"));
            if (!loggedUser || !user?.id || loggedUser.id === user.id) return;

            try {
                const res = await checkIfFollowing(user.id, loggedUser.id);
                if (res.status === 401) {
                    handleInvalidToken();
                    return;
                }

                const text = await res.text();
                const isFollow = text === "true";
                setIsFollowing(isFollow);
            } catch (err) {
                console.error("Error al verificar follow:", err);
            }
        };

        checkFollowStatus();
    }, [user]);

    const handleFollow = async (event) => {
        event.preventDefault();

        if (isFollowing) {
            unfollow(user.id, JSON.parse(localStorage.getItem("user")).id).then((response) => {
                response.json();
                if (response.status === 200) {
                    setIsFollowing(false);
                }
                else if (response.status === 401) {
                    handleInvalidToken();
                }
            });
        } else {
            follow(user.id, JSON.parse(localStorage.getItem("user")).id).then((response) => {
                response.json();
                if (response.status === 200) {
                    setIsFollowing(true);
                }
                else if (response.status === 401) {
                    handleInvalidToken();
                }
            });
        }
    }

    const goToUserPage = (userId, event) => {
        event.stopPropagation();
        navigate(`/user/${userId}`);
    };

    return (
        <>
            <div
                className="flex flex-row items-center justify-between py-4 px-4 flex-wrap gap-2 hover:cursor-pointer"
                css={css`
                    &:hover {
                        background-color: ${theme.colors.hoverPrimary};
                    }
                `}
                onClick={(e) => {
                    e.stopPropagation();
                    goToUserPage(user.id, e);
                }}
            >
                <div className="flex items-center min-w-0 flex-shrink">
                    <img
                        className="h-12 w-12 rounded-full hover:cursor-pointer bg-gray-300 border border-gray-900"
                        src={userAvatar || user.avatar}
                        alt=""
                    />
                    <div
                        className="pl-5 min-w-0 flex flex-col"
                        css={css`color: ${theme.colors.text};`}
                    >
                        <div
                            className="min-w-0"
                            css={css`color: ${theme.colors.text};`}
                        >
                            {
                                isFollowSuggestions ? (
                                    <p className="text-sm truncate">
                                        {
                                            user.userName?.length > 15
                                                ?
                                                `${user.userName.slice(0, 15)}...`
                                                :
                                                user.userName
                                        }
                                    </p>
                                ) :
                                    <p className="font-medium truncate">{user.userName}</p>
                            }
                            {
                                isFollowSuggestions ? (
                                    <p
                                        className="text-sm truncate"
                                        css={css`color: ${theme.colors.textMid};`}
                                    >
                                        {
                                            user.tag?.length > 15
                                                ?
                                                `${user.tag.slice(0, 15)}...`
                                                :
                                                user.tag
                                        }
                                    </p>
                                ) :
                                    <p
                                        className="text-sm text-gray-400 truncate"
                                        css={css`color: ${theme.colors.textMid};`}
                                    >
                                        {user.tag}
                                    </p>
                            }
                        </div>
                        <div>
                            <p className="text-sm truncate">
                                {isFollowSuggestions
                                    ? (user.bio?.length > 15 ? `${user.bio.slice(0, 15)}...` : user.bio)
                                    : user.bio}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="ml-auto">
                    {
                        isFollowing ?
                            <button
                                onClick={(e) => { e.stopPropagation(); handleFollow(e); }}
                                className="hover:cursor-pointer flex justify-center max-h-max whitespace-nowrap focus:outline-none focus:ring max-w-max border flex items-center hover:shadow-lg font-bold py-2 px-4 rounded-full mr-0 ml-auto"
                                css={css`
                                    background-color: ${theme.colors.btnPrimary};
                                    color: ${theme.colors.btnTextPrimary};
                                    &:hover {
                                        background-color: ${theme.colors.hoverPrimary};
                                        color: ${theme.colors.btnTextHoverPrimary};
                                    }
                                `}
                            >
                                {t('BUTTONS.UNFOLLOW')}
                            </button>

                            :
                            <button
                                onClick={(e) => { e.stopPropagation(); handleFollow(e); }}
                                className="hover:cursor-pointer flex justify-center max-h-max whitespace-nowrap focus:outline-none focus:ring max-w-max border flex items-center hover:shadow-lg font-bold py-2 px-4 rounded-full mr-0 ml-auto"
                                css={css`
                                    background-color: ${theme.colors.btnPrimary};
                                    color: ${theme.colors.btnTextPrimary};
                                    &:hover {
                                        background-color: ${theme.colors.hoverPrimary};
                                        color: ${theme.colors.btnTextHoverPrimary};
                                    }
                                `}
                            >
                                {t('BUTTONS.FOLLOW')}
                            </button>
                    }
                </div>
            </div>

            <hr css={css`border-color: ${theme.colors.secondary};`} />
        </>
    );
}