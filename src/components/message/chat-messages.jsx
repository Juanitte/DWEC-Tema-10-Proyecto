/** @jsxImportSource @emotion/react */
import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { getChat, getMessagesByChat, sendMessage } from "../../services/messages-service";
import Loading from "../shared/loading";
import PostForm from "../home/post-form";
import { handleInvalidToken } from "../../services/users-service";
import { css, useTheme } from "@emotion/react";
import MediaAttachment from "../shared/media-attachment";
import { useTranslation } from "react-i18next";

export default function ChatMessages({ chatId, currentUserId, targetUser }) {
  const theme = useTheme();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [targetUserId, setTargetUserId] = useState(null);
  const messagesEndRef = useRef(null);
  const scrollRef = useRef(null);
  const { t } = useTranslation();
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);
  const [loadedAttachments, setLoadedAttachments] = useState(0);
  const [hasScrolledInitial, setHasScrolledInitial] = useState(false);
  const totalAttachments = messages.reduce((acc, msg) => acc + (msg.attachments?.length || 0), 0);

  useEffect(() => {
    if (loadedAttachments === totalAttachments && totalAttachments > 0) {
      // Todas las imágenes han terminado de cargar
      setTimeout(scrollToBottom, 50);
    }
  }, [loadedAttachments, totalAttachments]);

  // Detectar rueda sobre el scroll interno
  useEffect(() => {
    const onWheel = (e) => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop += e.deltaY;
        e.preventDefault();
      }
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  useEffect(() => {
    setTimeout(scrollToBottom, 50);
  }, [shouldScrollToBottom]);

  // Cargar mensajes + chat meta
  useEffect(() => {
    if (!chatId) {
      setIsLoading(false);
      return;
    }

    const fetchAll = async () => {
      setIsLoading(true);
      try {
        const resMsgs = await getMessagesByChat(chatId);
        const data = await resMsgs.json();
        setMessages(data); // ← ahora de más nuevo a más antiguo

        const resChat = await getChat(chatId);
        const info = await resChat.json();
        setTargetUserId(info.userIds.find(id => id !== currentUserId));
        if (!hasScrolledInitial) {
          setTimeout(() => {
            scrollToBottom();
            setHasScrolledInitial(true);
          }, 50);
        }
      } catch (err) {
        console.error(err);
        if (err.status === 401) handleInvalidToken();
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, [chatId]);

  useEffect(() => {
    if (messages.length > 0 && !hasScrolledInitial) {
      // Espera que el DOM pinte los mensajes antes de scrollear
      setTimeout(() => {
        scrollToBottom();
        setHasScrolledInitial(true);
      }, 50);
    }
  }, [messages, hasScrolledInitial]);

  useEffect(() => {
    if (!chatId) return;

    let prevMessages = messages; // Guarda mensajes previos en closure

    const interval = setInterval(async () => {
      try {
        const res = await getMessagesByChat(chatId);
        const updatedMessages = await res.json();

        // Compara longitud o ids para detectar nuevos mensajes
        const prevIds = new Set(prevMessages.map(m => m.id));
        const hasNewMessages = updatedMessages.some(m => !prevIds.has(m.id));

        if (hasNewMessages) {
          setMessages(updatedMessages);
          setShouldScrollToBottom(true); // disparar scroll
        }

        prevMessages = updatedMessages; // actualiza prevMessages

      } catch (err) {
        console.error("Error actualizando mensajes:", err);
        if (err.status === 401) handleInvalidToken();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [chatId, messages]);

  // Refrescar mensajes tras enviar
  const handleMessageSent = async () => {
    try {
      const res = await getMessagesByChat(chatId);
      const data = await res.json();
      setMessages(data);
      setShouldScrollToBottom(!shouldScrollToBottom);
    } catch (err) {
      console.error("Error actualizando mensajes tras envío:", err);
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col h-full">

      {/* Área de mensajes: scrollable */}
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto px-4 py-2"
      >
        {isLoading ? (
          <Loading />
        ) : (
          <div className="flex flex-col justify-end space-y-2">
            {messages.map(msg => {
              const isOwn = msg.senderId == currentUserId;
              return (
                <div
                  key={msg.id}
                  className={`w-full flex mb-2 ${isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`
                      max-w-[70%] px-4 py-2 rounded-lg
                      ${isOwn
                        ? `bg-[${theme.colors.chatBubble}] text-[${theme.colors.text}] rounded-tr-none`
                        : `bg-[${theme.colors.secondary}] text-[${theme.colors.text}] rounded-tl-none`
                      }
                    `}
                  >
                    {msg.content}
                    {msg.attachments?.map((att, i) => (
                      <div key={i} className="mt-2">
                        <MediaAttachment
                          attachment={att}
                          onLoad={() => setLoadedAttachments(prev => prev + 1)} // ← notifica carga individual
                        />
                      </div>
                    ))}
                    <time className={`block text-xs text-[${theme.colors.textMid}] mt-1 text-right`}>
                      {isOwn ? t('CHAT.YOU') : targetUser?.userName} - {new Date(msg.timestamp).toLocaleTimeString()}
                    </time>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      <hr css={css`border-color: ${theme.colors.secondary};`} />
      <PostForm
        isMessage={true}
        chatId={chatId}
        currentUserId={currentUserId}
        targetUserId={targetUserId}
        onMessageSent={handleMessageSent}
      />
    </div>
  );
}