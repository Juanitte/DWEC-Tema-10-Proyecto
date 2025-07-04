/** @jsxImportSource @emotion/react */
import { useEffect, useRef, useState } from "react";
import Loading from "../shared/loading";
import { follow, getAvatar, getFollowers, getFollowing, handleInvalidToken, unfollow, UpdateAvatar, UpdateUser } from "../../services/users-service";
import { useTranslation } from "react-i18next";
import { getCountryKeyByValue } from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { css, useTheme } from '@emotion/react';
import PostForm from "../home/post-form";
import Modal from "../shared/modal";

export default function ProfileCard({ user }) {
    if (!user) return <Loading />;
    const { t } = useTranslation();
    const [showMessageModal, setShowMessageModal] = useState(false);

    const key = getCountryKeyByValue(user.country);
    const countryString = key ? t(`COUNTRIES.${key}`) : t("COUNTRIES.UNDEFINED");

    const userCreatedDate = new Date(user.created);
    const locale = localStorage.getItem("i18nextLng");
    const theme = useTheme();
    var formattedDate;

    if (locale == "es-ES")
        formattedDate = userCreatedDate.toLocaleDateString('es-ES', {
            month: 'long',
            year: 'numeric'
        });
    else if (locale == "en-GB")
        formattedDate = userCreatedDate.toLocaleDateString('en-GB', {
            month: 'long',
            year: 'numeric'
        });
    else if (locale == "en-US")
        formattedDate = userCreatedDate.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        });

    var dateString;

    if (locale == "es-ES")
        dateString = formattedDate.replace(/ (\d{4})$/, ' $1');
    else if (locale == "en-GB")
        dateString = formattedDate.replace(/ (\d{4})$/, ', $1');
    else if (locale == "en-US")
        dateString = formattedDate.replace(/ (\d{4})$/, ', $1');

    const [isFollowing, setIsFollowing] = useState(false);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isForFollowers, setIsForFollowers] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [userName, setUserName] = useState(user.userName);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const previewRef = useRef(null);
    const [avatarFilename, setAvatarFilename] = useState(user.avatar);
    const [userBio, setUserBio] = useState(user.bio);
    const [userLink, setUserLink] = useState(user.link);
    const [hasChanged, setHasChanged] = useState(false);
    const [formValues, setFormValues] = useState({
        userName: user.userName,
        bio: user.bio || '',
        link: user.link || ''
    });

    const navigate = useNavigate();

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleEditing = () => {
        setIsEditing(!isEditing);
    }

    const handleInputChange = e => {
        const { name, value } = e.target;
        setFormValues(prev => ({ ...prev, [name]: value }));
        setHasChanged(true);
        if (name === "bio") setUserBio(value);
        if (name === "link") setUserLink(value);
        if (name === "userName") setUserName(value);
    };

    const handleFileChange = async e => {
        const file = e.target.files?.[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        if (previewRef.current) URL.revokeObjectURL(previewRef.current);
        setAvatarPreview(url);
        previewRef.current = url;

        try {
            const res = await UpdateAvatar(user.id, file);
            if (res.ok) {
                const { path: newFilename } = await res.json();
                setAvatarFilename(newFilename);
            } else if (response.status === 401) {
                handleInvalidToken();
            } else {
                console.error("Error subiendo avatar:", await response.text());
            }
        } catch (err) {
            console.error("Excepción al subir avatar:", err);
        }
    };

    const handleSave = async () => {
        // Construye el DTO según tu CreateUserDto
        setHasChanged(false);

        const toastId = toast.loading(t('TOAST.LOADING'));

        const userDto = {
            UserName: formValues.userName,
            Tag: user.tag,
            Bio: formValues.bio,
            Link: formValues.link,
            Avatar: avatarFilename,
            Email: user.email,
            Password: "",
            PhoneNumber: user.phoneNumber,
            FullName: user.fullName,
            Country: user.country,
            Language: user.language,
            Created: user.created,
            IsBanned: user.isBanned,
            Role: user.role
        };

        try {
            const response = await UpdateUser(user.id, userDto);
            if (response.ok) {
                const updated = await response.json();
                setUserName(formValues.userName);
                setUserBio(formValues.bio);
                setUserLink(formValues.link);
                setFormValues({
                    UserName: formValues.userName,
                    Bio: formValues.bio,
                    Link: formValues.link
                });
                toast.update(toastId, { render: t('TOAST.SUCCESS'), type: "success", isLoading: false, autoClose: 2000 });
                setIsEditing(false);
            } else if (response.status === 401) {
                toast.update(toastId, { render: t('TOAST.ERROR'), type: "error", isLoading: false, autoClose: 4000 });
                handleInvalidToken();
            } else {
                toast.update(toastId, { render: t('TOAST.ERROR'), type: "error", isLoading: false, autoClose: 4000 });
            }
        } catch (err) {
            toast.update(toastId, { render: t('TOAST.ERROR'), type: "error", isLoading: false, autoClose: 4000 });
        }
    };

    useEffect(() => {
        if (user) {
            setUserName(user.userName);
            setUserBio(user.bio || '');
            setUserLink(user.link || '');
            setAvatarFilename(user.avatar);
            setFormValues({
                userName: user.userName,
                bio: user.bio || '',
                link: user.link || ''
            });
            setHasChanged(false);
            setIsEditing(false);
        }
    }, [user]);

    useEffect(() => {
        let isMounted = true;

        const loadAvatar = async () => {
            try {
                const res = await getAvatar(user.id);

                if (res.ok) {
                    const blob = await res.blob();
                    const objectUrl = URL.createObjectURL(blob);

                    if (isMounted) {
                        if (previewRef.current) URL.revokeObjectURL(previewRef.current);
                        setAvatarPreview(objectUrl);
                        previewRef.current = objectUrl;
                    }
                } else if (res.status === 404) {
                    // No hay avatar personalizado, usar el avatar por defecto del objeto `user`
                    if (isMounted) {
                        if (previewRef.current) URL.revokeObjectURL(previewRef.current);
                        setAvatarPreview(null); // Importante: limpiamos el avatar anterior
                    }
                } else if (res.status === 401) {
                    handleInvalidToken();
                } else {
                    console.error("Error al obtener avatar:", await res.text());
                }
            } catch (err) {
                console.error("Excepción al obtener avatar:", err);
            }
        };

        loadAvatar();

        return () => {
            isMounted = false;
            if (previewRef.current) URL.revokeObjectURL(previewRef.current);
        };
    }, [user.id]);

    useEffect(() => {
        let isMounted = true;
        (async () => {
            try {
                const res = await getAvatar(user.id);
                if (res.ok) {
                    const blob = await res.blob();
                    const url = URL.createObjectURL(blob);
                    if (isMounted) {
                        setAvatarPreview(url);
                        previewRef.current = url;
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
            if (previewRef.current) URL.revokeObjectURL(previewRef.current);
        };
    }, [user.id]);

    useEffect(() => {
        if (isEditing) {
            setFormValues(prev => ({
                ...prev,
                UserName: userName,
                Bio: userBio,
                Link: userLink
            }));
        }
    }, [isEditing]);

    useEffect(() => {
        const fetchFollowers = async () => {
            try {
                const response = await getFollowers(user.id);
                if (response.status === 401) {
                    handleInvalidToken();
                }
                const data = await response.json();
                setFollowers(data);
                const loggedInUserId = JSON.parse(localStorage.getItem("user")).id;
                const alreadyFollowing = data.some(f => f.id === +loggedInUserId);
                setIsFollowing(alreadyFollowing);

            } catch (error) {
                console.error("Error fetching followers:", error);
                handleInvalidToken();
            }
        };
        const fetchFollowing = async () => {
            try {
                const response = await getFollowing(user.id);
                if (response.status === 401) {
                    handleInvalidToken();
                }
                const data = await response.json();
                setFollowing(data);
            } catch (error) {
                console.error("Error fetching following:", error);
                handleInvalidToken();
            }
        };
        fetchFollowers();
        fetchFollowing();
    }, [user.id]);

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


    return (
        <>
            <div className="pt-10">
                <div className="p-4">
                    <div className="relative flex w-full">
                        {/* Avatar */}
                        <div className="flex flex-1">
                            <div className="relative" style={{ height: '9rem', width: '9rem' }}>
                                <div
                                    style={{ height: '9rem', width: '9rem' }}
                                    className="rounded-full overflow-hidden h-full w-full avatar"
                                >
                                    <img
                                        src={avatarPreview ?? user.avatar}
                                        alt={`${userName} avatar`}
                                        className="h-full w-full object-contain bg-gray-300 border-4 border-gray-900 rounded-full"
                                    />

                                    {isEditing && (
                                        <label
                                            htmlFor="avatarUpload"
                                            className="absolute bottom-2 right-2 p-2 rounded-full shadow cursor-pointer"
                                            css={css`
                                                background-color: ${theme.colors.primary};
                                                color: ${theme.colors.text};
                                                &:hover {
                                                    background-color: ${theme.colors.hoverPrimary};
                                                }
                                            ` }
                                        >
                                            <i className="fa fa-pencil-alt fa-lg" aria-hidden="true" />
                                            <input
                                                id="avatarUpload"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* Follow Button */}
                        <div className="flex flex-row gap-2 text-right">
                            {
                                user.id == JSON.parse(localStorage.getItem('user')).id ? (
                                    isEditing ? (
                                        hasChanged ? (
                                            <button
                                                onClick={handleSave}
                                                className="hover:cursor-pointer flex justify-center max-h-max whitespace-nowrap focus:outline-none max-w-max border flex items-center hover:shadow-lg font-bold py-2 px-4 rounded-full mr-0 ml-auto"
                                                css={css`
                                                    background-color: ${theme.colors.btnPrimary};
                                                    color: ${theme.colors.btnTextPrimary};
                                                    &:hover {
                                                        background-color: ${theme.colors.btnHoverPrimary};
                                                        color: ${theme.colors.btnTextHoverPrimary};
                                                        border-color: ${theme.colors.btnTextHoverPrimary};
                                                    }
                                                `}
                                            >
                                                {t('BUTTONS.SAVE')}
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleEditing}
                                                className="hover:cursor-pointer flex justify-center max-h-max whitespace-nowrap focus:outline-none max-w-max border flex items-center hover:shadow-lg font-bold py-2 px-4 rounded-full mr-0 ml-auto"
                                                css={css`
                                                    background-color: ${theme.colors.btnPrimary};
                                                    color: ${theme.colors.btnTextPrimary};
                                                    &:hover {
                                                        background-color: ${theme.colors.btnHoverPrimary};
                                                        color: ${theme.colors.btnTextHoverPrimary};
                                                        border-color: ${theme.colors.btnTextHoverPrimary};
                                                    }
                                                `}
                                            >
                                                {t('BUTTONS.BACK')}
                                            </button>
                                        )
                                    ) : (
                                        <button
                                            onClick={handleEditing}
                                            className="hover:cursor-pointer flex justify-center max-h-max whitespace-nowrap focus:outline-none max-w-max border flex items-center hover:shadow-lg font-bold py-2 px-4 rounded-full mr-0 ml-auto"
                                            css={css`
                                                    background-color: ${theme.colors.btnPrimary};
                                                    color: ${theme.colors.btnTextPrimary};
                                                    &:hover {
                                                        background-color: ${theme.colors.btnHoverPrimary};
                                                        color: ${theme.colors.btnTextHoverPrimary};
                                                        border-color: ${theme.colors.btnTextHoverPrimary};
                                                    }
                                                `}
                                        >
                                            {t('PROFILE.EDIT-PROFILE')}
                                        </button>
                                    )
                                ) : (
                                    <>
                                        <button
                                            onClick={() => setShowMessageModal(true)}
                                            className="hover:cursor-pointer max-h-[40px] max-w-[40px] flex justify-center whitespace-nowrap focus:outline-none border flex items-center hover:shadow-lg font-bold p-2 rounded-full mr-0 ml-auto"
                                            css={css`
                                                    background-color: ${theme.colors.btnPrimary};
                                                    color: ${theme.colors.btnTextPrimary};
                                                    &:hover {
                                                        background-color: ${theme.colors.btnHoverPrimary};
                                                        color: ${theme.colors.btnTextHoverPrimary};
                                                        border-color: ${theme.colors.btnTextHoverPrimary};
                                                    }
                                                `}
                                        >
                                            <i class="fa-regular fa-envelope fa-lg"></i>
                                        </button>

                                        {isFollowing ? (
                                            <button
                                                onClick={handleFollow}
                                                className="hover:cursor-pointer flex justify-center max-h-max whitespace-nowrap focus:outline-none max-w-max border flex items-center hover:shadow-lg font-bold py-2 px-4 rounded-full mr-0 ml-auto"
                                                css={css`
                                                    background-color: ${theme.colors.btnPrimary};
                                                    color: ${theme.colors.btnTextPrimary};
                                                    &:hover {
                                                        background-color: ${theme.colors.btnHoverPrimary};
                                                        color: ${theme.colors.btnTextHoverPrimary};
                                                        border-color: ${theme.colors.btnTextHoverPrimary};
                                                    }
                                                `}
                                            >
                                                {t("BUTTONS.UNFOLLOW")}
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleFollow}
                                                className="hover:cursor-pointer flex justify-center max-h-max whitespace-nowrap focus:outline-none max-w-max border flex items-center hover:shadow-lg font-bold py-2 px-4 rounded-full mr-0 ml-auto"
                                                css={css`
                                                    background-color: ${theme.colors.btnPrimary};
                                                    color: ${theme.colors.btnTextPrimary};
                                                    &:hover {
                                                        background-color: ${theme.colors.btnHoverPrimary};
                                                        color: ${theme.colors.btnTextHoverPrimary};
                                                        border-color: ${theme.colors.btnTextHoverPrimary};
                                                    }
                                                `}
                                            >
                                                {t("BUTTONS.FOLLOW")}
                                            </button>
                                        )}
                                    </>
                                )}
                        </div>
                    </div>

                    {/* Profile info */}
                    <div className="space-y-1 justify-center w-full pt-3 pl-3">
                        {/* User basic */}
                        {isEditing ? (
                            <div>
                                <input
                                    name="userName"
                                    value={formValues.userName}
                                    onChange={handleInputChange}
                                    className="w-full text-xl font-bold p-2 rounded"
                                    css={css`
                                        background-color: ${theme.colors.primary};
                                        color: ${theme.colors.text};
                                    `}
                                />
                            </div>
                        ) : (
                            <div>
                                <h2
                                    className="text-xl leading-6 font-bold"
                                    css={css`color: ${theme.colors.text};`}
                                >
                                    {userName}
                                </h2>
                            </div>
                        )}

                        <p
                            className="text-sm leading-5 font-medium"
                            css={css`color: ${theme.colors.textMid};`}
                        >
                            {user.tag}
                        </p>

                        {/* Description and others */}
                        <div className="pt-3">
                            {isEditing ? (
                                <>
                                    <textarea
                                        name="bio"
                                        value={formValues.bio}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full p-2 rounded"
                                        css={css`
                                            background-color: ${theme.colors.primary};
                                            color: ${theme.colors.text};
                                        `}
                                    />
                                    <div className="flex items-center mt-2">
                                        <input
                                            name="link"
                                            value={formValues.link}
                                            onChange={handleInputChange}
                                            placeholder="https://tusitio.com"
                                            className="ml-2 p-1 rounded flex-1"
                                            css={css`
                                                background-color: ${theme.colors.primary};
                                                color: ${theme.colors.text};
                                            `}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p
                                        className="leading-tight pb-2"
                                        css={css`color: ${theme.colors.text};`}
                                    >
                                        {userBio}
                                    </p>
                                    <div
                                        className="flex items-center"
                                        css={css`color: ${theme.colors.textMid};`}
                                    >
                                        <svg viewBox="0 0 24 24" className="h-5 w-5 paint-icon">
                                            <g>
                                                <path d="M11.96 14.945c-.067 0-.136-.01-.203-.027-1.13-.318-2.097-.986-2.795-1.932-.832-1.125-1.176-2.508-.968-3.893s.942-2.605 2.068-3.438l3.53-2.608c2.322-1.716 5.61-1.224 7.33 1.1.83 1.127 1.175 2.51.967 3.895s-.943 2.605-2.07 3.438l-1.48 1.094c-.333.246-.804.175-1.05-.158-.246-.334-.176-.804.158-1.05l1.48-1.095c.803-.592 1.327-1.463 1.476-2.45.148-.988-.098-1.975-.69-2.778-1.225-1.656-3.572-2.01-5.23-.784l-3.53 2.608c-.802.593-1.326 1.464-1.475 2.45-.15.99.097 1.975.69 2.778.498.675 1.187 1.15 1.992 1.377.4.114.633.528.52.928-.092.33-.394.547-.722.547z"></path>
                                                <path d="M7.27 22.054c-1.61 0-3.197-.735-4.225-2.125-.832-1.127-1.176-2.51-.968-3.894s.943-2.605 2.07-3.438l1.478-1.094c.334-.245.805-.175 1.05.158s.177.804-.157 1.05l-1.48 1.095c-.803.593-1.326 1.464-1.475 2.45-.148.99.097 1.975.69 2.778 1.225 1.657 3.57 2.01 5.23.785l3.528-2.608c1.658-1.225 2.01-3.57.785-5.23-.498-.674-1.187-1.15-1.992-1.376-.4-.113-.633-.527-.52-.927.112-.4.528-.63.926-.522 1.13.318 2.096.986 2.794 1.932 1.717 2.324 1.224 5.612-1.1 7.33l-3.53 2.608c-.933.693-2.023 1.026-3.105 1.026z"></path>
                                            </g>
                                        </svg>
                                        <a
                                            href={userLink}
                                            target="_blank"
                                            className="leading-5 ml-1 text-blue-400 break-all"
                                        >
                                            {userLink}
                                        </a>
                                    </div>
                                </>
                            )}

                            {/* Joined date (siempre igual) */}
                            <div
                                className="flex mt-2"
                                css={css`color: ${theme.colors.textMid};`}
                            >
                                <svg viewBox="0 0 24 24" className="h-5 w-5 paint-icon">
                                    <g>
                                        <path d="M19.708 2H4.292C3.028 2 2 3.028 2 4.292v15.416C2 20.972 3.028 22 4.292 22h15.416C20.972 22 22 20.972 22 19.708V4.292C22 3.028 20.972 2 19.708 2zm.792 17.708c0 .437-.355.792-.792.792H4.292c-.437 0-.792-.355-.792-.792V6.418c0-.437.354-.79.79-.792h15.42c.436 0 .79.355.79.79V19.71z"></path>
                                        <circle cx="7.032" cy="8.75" r="1.285"></circle>
                                        <circle cx="7.032" cy="13.156" r="1.285"></circle>
                                        <circle cx="16.968" cy="8.75" r="1.285"></circle>
                                        <circle cx="16.968" cy="13.156" r="1.285"></circle>
                                        <circle cx="12" cy="8.75" r="1.285"></circle>
                                        <circle cx="12" cy="13.156" r="1.285"></circle>
                                        <circle cx="7.032" cy="17.486" r="1.285"></circle>
                                        <circle cx="12" cy="17.486" r="1.285"></circle>
                                    </g>
                                </svg>
                                <span className="leading-5 ml-1">
                                    {t('PROFILE.JOINED')} {dateString}, {countryString}.
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className={`pt-3 flex justify-start items-start w-full divide-x divide-[${theme.colors.secondary}] divide-solid`}>
                        <div onClick={() => { navigate(`/user/${user.id}/follows?tab=0`) }} className="text-center pr-3 hover:cursor-pointer">
                            <span
                                className="font-bold"
                                css={css`color: ${theme.colors.text};`}
                            >
                                {
                                    following.length
                                }
                            </span>
                            <span className="pl-2"
                                css={css`color: ${theme.colors.textMid};`}
                            >
                                {t('PROFILE.FOLLOWING')}
                            </span>
                        </div>
                        <div onClick={() => { navigate(`/user/${user.id}/follows?tab=1`) }} className="text-center px-3 hover:cursor-pointer">
                            <span
                                className="font-bold"
                                css={css`color: ${theme.colors.text};`}
                            >
                                {
                                    followers.length
                                }
                            </span>
                            <span className="pl-2"
                                css={css`color: ${theme.colors.textMid};`}
                            >
                                {t('PROFILE.FOLLOWERS')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            {showMessageModal && (
                <Modal onClose={() => setShowMessageModal(false)}>
                    <PostForm
                    isMessage={true}
                    targetUserId={user.id}
                    onClose={() => setShowMessageModal(false)}
                    />
                </Modal>
            )}
        </>
    );
}