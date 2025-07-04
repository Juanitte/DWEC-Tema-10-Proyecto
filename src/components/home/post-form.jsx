/** @jsxImportSource @emotion/react */
import { useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import { CreatePostDto } from "../../models/createPostDto";
import { createPost } from "../../services/posts-service";
import { getAvatar, handleInvalidToken } from "../../services/users-service";
import { useTranslation } from "react-i18next";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import { css, useTheme } from '@emotion/react';
import { createChat, getChat, getChatsByUser, sendMessage } from "../../services/messages-service";

export default function PostForm({ commentedPostId, isMessage = false, targetUserId = null, onClose , onMessageSent }) {
    const emojiButtonRef = useRef(null);
    const user = JSON.parse(localStorage.getItem("user"));
    const currentUserId = JSON.parse(localStorage.getItem("user")).id;
    const fileInputRef = useRef(null);
    const videoInputRef = useRef(null);
    const textAreaRef = useRef(null);
    const pickerRef = useRef(null);

    const [images, setImages] = useState([]);
    const [videos, setVideos] = useState([]);
    const [files, setFiles] = useState([]);
    const [isSending, setIsSending] = useState(false);
    const [postText, setPostText] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [pickerPos, setPickerPos] = useState({ top: 0, left: 0 });
    const [userAvatar, setUserAvatar] = useState(user.avatar);
    const avatarUrlRef = useRef(null);

    const MAX_ATTACHMENTS = 4;

    const theme = useTheme();
    const { t } = useTranslation();
    const placeholder = t("POST-FORM.FORM-PLACEHOLDER");
    const commentPlaceholder = t("POST-FORM.COMMENT-PLACEHOLDER");
    const buttonText = t("BUTTONS.POST");
    const commentButtonText = t("BUTTONS.REPLY");
    const emojiSearchPlaceholder = t("POST-FORM.EMOJI-SEARCH-PLACEHOLDER");
    const messageButtonText = t("POST-FORM.CHAT");
    const messagePlaceholder = t("POST-FORM.CHAT-PLACEHOLDER")

    const handleImageChange = (event) => {
        const selected = Array.from(event.target.files);
        // calculamos cuántos más podemos añadir
        const slots = MAX_ATTACHMENTS - files.length;
        const allowed = selected.slice(0, slots);

        const previews = allowed.map(file => ({
            url: URL.createObjectURL(file),
            name: file.name,
            preview: ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(file.name.split('.').pop().toLowerCase()),
            size: file.size > 1024
                ? (file.size > 1048576
                    ? Math.round(file.size / 1048576) + 'mb'
                    : Math.round(file.size / 1024) + 'kb')
                : file.size + 'b'
        }));

        setImages(prev => [...prev, ...previews]);
        setFiles(prev => [...prev, ...allowed]);

        // si se seleccionó más de lo permitido, avisamos
        if (selected.length > slots) {
            toast.warn(`Solo puedes adjuntar hasta ${MAX_ATTACHMENTS} archivos en total.`);
        }

        // reset para poder volver a seleccionar los mismos nombres
        event.target.value = "";
    };

    const handleVideoChange = (event) => {
        const selected = Array.from(event.target.files);
        const slots = MAX_ATTACHMENTS - files.length;
        const allowed = selected.slice(0, slots);

        const newVideos = allowed.map(file => {
            const ext = file.name.split('.').pop()?.toLowerCase();
            const mimeMap = { mp4: 'video/mp4', webm: 'video/webm', ogg: 'video/ogg' };
            return {
                url: URL.createObjectURL(file),
                name: file.name,
                size: file.size > 1024
                    ? (file.size > 1048576
                        ? Math.round(file.size / 1048576) + 'mb'
                        : Math.round(file.size / 1024) + 'kb')
                    : file.size + 'b',
                file,
                type: mimeMap[ext] || 'video/mp4'
            };
        });

        setVideos(prev => [...prev, ...newVideos]);
        setFiles(prev => [...prev, ...allowed]);

        if (selected.length > slots) {
            toast.warn(`Solo puedes adjuntar hasta ${MAX_ATTACHMENTS} archivos en total.`);
        }
        event.target.value = "";
    };

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

    // Auto-resize textarea
    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = "auto";
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        }
    }, [postText]);

    // Close emoji picker on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                pickerRef.current &&
                !pickerRef.current.contains(e.target) &&
                !e.target.closest("#emoji-button")
            ) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleEmojiPicker = () => {
        if (!showEmojiPicker && emojiButtonRef.current) {
            const btnRect = emojiButtonRef.current.getBoundingClientRect();

            // Altura estimada del picker (ajusta si cambias theme / tamaño)
            const pickerH = 350;
            const pickerW = 300;

            // Espacio por debajo / por encima
            const spaceBelow = window.innerHeight - btnRect.bottom;
            const spaceAbove = btnRect.top;

            // Decide si ponerlo abajo o arriba
            const top = spaceBelow > pickerH
                ? btnRect.bottom + 4 + window.scrollY
                : btnRect.top - pickerH - 4 + window.scrollY;

            // Acomoda el left para que no se salga a la derecha
            let left = btnRect.left + window.scrollX;
            if (left + pickerW > window.innerWidth) {
                left = window.innerWidth - pickerW - 4;
            }
            if (left < 4) left = 4;

            setPickerPos({ top, left });
        }
        setShowEmojiPicker(v => !v);
    };

    // Insert emoji into textarea
    const onEmojiClick = (emojiObject, event) => {
        const emojiChar = emojiObject.emoji;
        const ta = textAreaRef.current;
        const start = ta.selectionStart, end = ta.selectionEnd;
        const newText = postText.slice(0, start) + emojiChar + postText.slice(end);
        setPostText(newText);
        setTimeout(() => {
            ta.focus();
            const pos = start + emojiChar.length;
            ta.setSelectionRange(pos, pos);
        }, 0);
        setShowEmojiPicker(false);
    };

    const removeImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
        setFiles((prev) => prev.filter((_, i) => i !== index));
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const removeVideo = (index) => {
        setVideos((prev) => prev.filter((_, i) => i !== index));
        setFiles((prev) => prev.filter((_, i) => i !== index));
        if (videoInputRef.current) videoInputRef.current.value = "";
    };

    const handlePost = async (e) => {
        e.preventDefault();
        const toastId = toast.loading("Enviando…");
        setIsSending(true);

        if (isMessage) {
            try {

                // ─── 2) Buscamos entre los chats del usuario si ya existe uno con ese tId
                const existingRes = await getChatsByUser(currentUserId);
                if (existingRes.status === 401) throw new Error("No autorizado");
                const existingChats = await existingRes.json();

                let chat = existingChats.find(c =>
                    Array.isArray(c.userIds) &&
                    c.userIds.map(x => Number(x)).includes(Number(targetUserId))
                );

                // ─── 3) Solo si no existe, lo creamos
                if (!chat) {
                    const createRes = await createChat({
                        UserIds: [currentUserId, tId]
                    });
                    if (createRes.status === 401) throw new Error("No autorizado");
                    if (!createRes.ok) throw new Error("Error creando chat");
                    chat = await createRes.json();  // recibes el ChatDto con .id
                }

                // ─── 4) Enviamos el mensaje al chat (existente o recién creado)
                const msgRes = await sendMessage({
                    content: postText,
                    chatId: chat.id,
                    senderId: currentUserId,
                    attachments: files
                });
                if (msgRes.status === 401) throw new Error("No autorizado");
                if (!msgRes.ok) throw new Error("Error enviando mensaje");

                // ─── 5) Notificar éxito
                toast.update(toastId, {
                    render: "Mensaje enviado",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000,
                });
                onClose?.();
                onMessageSent?.();

            } catch (err) {
                console.error(err);
                toast.update(toastId, {
                    render: err.message || "Error enviando mensaje",
                    type: "error",
                    isLoading: false,
                    autoClose: 4000,
                });
            } finally {
                setIsSending(false);
                setPostText("");
                setImages([]);
                setVideos([]);
                setFiles([]);
                fileInputRef.current.value = "";
                videoInputRef.current.value = "";
            }
            return;
        }

        // ─── Lógica normal de creación de post
        const dto = new CreatePostDto(
            user.userName,
            user.tag,
            user.avatar,
            postText,
            files,
            user.id,
            commentedPostId || 0
        );

        try {
            const response = await createPost(dto);
            if (response.status === 200) {
                setPostText("");
                setImages([]);
                setVideos([]);
                setFiles([]);
                fileInputRef.current.value = "";
                videoInputRef.current.value = "";

                toast.update(toastId, {
                    render: t("TOAST.SUCCESS"),
                    type: "success",
                    isLoading: false,
                    autoClose: 2000,
                });
            } else if (response.status === 401) {
                handleInvalidToken();
                toast.update(toastId, {
                    render: t("TOAST.TOKEN-ERROR"),
                    type: "error",
                    isLoading: false,
                    autoClose: 4000,
                });
            } else {
                const text = await response.text();
                toast.update(toastId, {
                    render: `${t("TOAST.ERROR")} (${response.status}): ${text}`,
                    type: "error",
                    isLoading: false,
                    autoClose: 4000,
                });
            }
        } catch (err) {
            console.error(err);
            toast.update(toastId, {
                render: t("TOAST.ERROR"),
                type: "error",
                isLoading: false,
                autoClose: 4000,
            });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <>
            <div className="flex p-2">
                <div className="m-2 w-10 py-1">
                    <img className="inline-block h-10 w-10 rounded-full bg-gray-300"
                        src={userAvatar ?? user.avatar}
                        alt="" />
                </div>
                <div className="flex-1 px-2 pt-2 mt-2 relative">
                    <textarea
                        className="bg-transparent font-medium text-lg w-full focus:outline-none focus:border-none"
                        css={css`
                            color: ${theme.colors.text};
                        `}
                        rows="2"
                        cols="50"
                        placeholder={isMessage ? messagePlaceholder : commentedPostId === 0 ? placeholder : commentPlaceholder}
                        ref={textAreaRef}
                        value={postText}
                        onChange={(e) => {
                            if (e.target.value.length <= 500) {
                                setPostText(e.target.value);
                            }
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handlePost(e);
                            }
                        }}
                    ></textarea>
                    {showEmojiPicker &&
                        createPortal(
                            <div
                                ref={pickerRef}
                                style={{
                                    position: "fixed",
                                    top: pickerPos.top,
                                    left: pickerPos.left,
                                    zIndex: 9999,
                                }}
                            >
                                <EmojiPicker
                                    onEmojiClick={onEmojiClick}
                                    searchPlaceHolder={emojiSearchPlaceholder}
                                    emojiStyle="twitter"
                                    theme="dark"
                                />
                            </div>,
                            document.body
                        )
                    }
                </div>
            </div>

            <div className="flex px-2 pb-2">
                <div className="w-10"></div>

                <div className="w-64 px-2">
                    <div className="flex items-center">

                        <div className="flex-1 text-center pb-2 mb-2 mx-2">
                            <a
                                className="hover:cursor-pointer mt-1 group flex justify-center items-center px-2 py-2 text-base leading-6 font-medium rounded-full"
                                css={css`
                                    color: ${theme.colors.textMid};
                                    &:hover {
                                        color: ${theme.colors.text};
                                        background-color: ${theme.colors.hoverPrimary};
                                    }
                                `}
                                onClick={() => fileInputRef.current.click()}
                            >
                                <svg className="text-center h-7 w-6" fill="none" strokeLinecap="round"
                                    strokeLinejoin="round" strokeWidth="2" stroke="silver"
                                    viewBox="0 0 24 24">
                                    <path
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z">
                                    </path>
                                </svg>
                            </a>
                            <input
                                ref={fileInputRef}
                                hidden
                                type="file"
                                multiple
                                accept="image/jpeg, image/png, image/gif, image/webp"
                                onChange={handleImageChange}
                            />
                        </div>

                        <div className="flex-1 text-center pb-2 mb-2 mx-2">
                            <a
                                className="hover:cursor-pointer mt-1 group flex justify-center items-center px-2 py-2 text-base leading-6 font-medium rounded-full"
                                css={css`
                                    color: ${theme.colors.textMid};
                                    &:hover {
                                        color: ${theme.colors.text};
                                        background-color: ${theme.colors.hoverPrimary};
                                    }
                                `}
                                onClick={() => videoInputRef.current.click()}
                            >
                                <svg className="text-center h-7 w-6" fill="none" strokeLinecap="round"
                                    strokeLinejoin="round" strokeWidth="2" stroke="silver"
                                    viewBox="0 0 24 24">
                                    <path
                                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </a>
                            <input
                                ref={videoInputRef}
                                hidden
                                type="file"
                                accept="video/mp4, video/webm, video/ogg"
                                multiple
                                onChange={handleVideoChange}
                            />
                        </div>
                        <div className="flex-1 text-center pb-2 mb-2 mx-2">
                            <a
                                ref={emojiButtonRef}
                                onClick={() => toggleEmojiPicker()}
                                id="emoji-button"
                                className="hover:cursor-pointer mt-1 group flex justify-center items-center px-2 py-2 text-base leading-6 font-medium rounded-full"
                                css={css`
                                    color: ${theme.colors.textMid};
                                    &:hover {
                                        color: ${theme.colors.text};
                                        background-color: ${theme.colors.hoverPrimary};
                                    }
                                `}
                            >
                                <svg className="text-center h-7 w-6" fill="none" strokeLinecap="round"
                                    strokeLinejoin="round" strokeWidth="2" stroke="silver"
                                    viewBox="0 0 24 24">
                                    <path
                                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
                                    </path>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>


                <div className="flex-1">
                    <button
                        onClick={handlePost}
                        className="hover:cursor-pointer bg-green-700 hover:bg-green-600 mb-2 text-white font-bold py-2 px-8 rounded-full mr-8 float-right"
                        css={css`
                            background-color: ${theme.colors.btnPrimary};
                            &:hover {
                                background-color: ${theme.colors.btnHoverPrimary};
                            }
                            color: ${theme.colors.btnTextPrimary};
                            &:hover {
                                color: ${theme.colors.btnTextHoverPrimary};
                                border: 1px solid;
                                border-color: ${theme.colors.btnTextHoverPrimary};
                            }
                        `}
                    >
                        {
                            isMessage ? messageButtonText :
                            commentedPostId == 0 ? buttonText : commentButtonText
                        }
                    </button>
                </div>
            </div>
            <div id="preview" className="px-4 flex flex-wrap gap-2">
                {images.map((image, index) => (
                    <div key={index} className="relative w-32 object-cover rounded">
                        {image.preview ? (
                            <img src={image.url} className="w-32 h-32 object-cover rounded" alt="preview" />
                        ) : (
                            <svg className="fill-current w-32 h-32" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path d="M15 2v5h5v15h-16v-20h11zm1-2h-14v24h20v-18l-6-6z" />
                            </svg>
                        )}
                        <button
                            onClick={() => removeImage(index)}
                            className="w-6 h-6 absolute top-0 right-0 m-2 text-white text-sm bg-red-500 hover:text-red-700 hover:bg-gray-100 rounded-full flex items-center justify-center leading-none"
                        >
                            X
                        </button>

                        <div
                            className="text-xs text-center p-2"
                            css={css`
                                color: ${theme.colors.textMid};
                            `}
                        >
                            {image.size}
                        </div>
                    </div>
                ))}
                {videos.map((video, index) => (
                    <div key={index} className="relative w-32 rounded">
                        <video src={video.url} controls className="w-32 h-32 object-cover rounded"></video>
                        <button
                            onClick={() => removeVideo(index)}
                            className="w-6 h-6 absolute top-0 right-0 m-2 text-white text-sm bg-red-500 hover:text-red-700 hover:bg-gray-100 rounded-full flex items-center justify-center leading-none"
                        >
                            X
                        </button>
                        <div
                            className="text-xs text-center p-2 text-gray-300"
                            css={css`
                                color: ${theme.colors.textMid};
                            `}
                        >
                            {video.size}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
