/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import { css, useTheme } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import { getUserById, getAvatar, handleInvalidToken } from "../../services/users-service";
import { getLastMessageByChat } from "../../services/messages-service";
import { useTranslation } from "react-i18next";


/** Ítem de la lista de chats */
export default function ChatListItem({ chat, currentUserId, onSelect }) {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [otherUser, setOtherUser] = useState({
    userName: "",
    tag: "",
    avatarUrl: "",
  });
  const [lastMessage, setLastMessage] = useState(null);

  // 1) Recuperar datos del otro usuario
  useEffect(() => {
    const otherId = chat.userIds.find((id) => id != currentUserId);
    if (!otherId) return;

    (async () => {
      try {
        const uRes = await getUserById(otherId);
        if (uRes.status === 401) { handleInvalidToken(); return; }
        const u = await uRes.json();

        let avatarUrl = "";
        try {
          const aRes = await getAvatar(otherId);
          if (aRes.ok) {
            const blob = await aRes.blob();
            avatarUrl = URL.createObjectURL(blob);
          }
        } catch {}

        setOtherUser({
          userName: u.userName,
          tag: u.tag,
          avatarUrl,
        });
      } catch (e) {
        console.error("ChatListItem> get user", e);
      }
    })();
  }, [chat.userIds, currentUserId]);

  // 2) Recuperar último mensaje
  useEffect(() => {
    (async () => {
      try {
        const res = await getLastMessageByChat(chat.id);
        if (res.status === 401) { handleInvalidToken(); return; }
        const msg = await res.json();
        setLastMessage(msg);   // msg: { id, content, senderId, timestamp, ... }
      } catch (e) {
        console.error("ChatListItem> get last message", e);
      }
    })();
  }, [chat.id]);

  // 3) Render
  return (
    <div
      onClick={() => onSelect(chat.id)}
      className="flex items-center p-3 cursor-pointer transition-colors"
      css={css`
        &:hover { background-color: ${theme.colors.hoverPrimary}; }
      `}
    >
      <img
        src={otherUser.avatarUrl || "/fallback-avatar.png"}
        alt="avatar"
        className="h-12 w-12 rounded-full flex-shrink-0"
      />

      <div className="ml-3 flex-1 overflow-hidden">
        <div className="flex justify-between">
          <span className="font-medium truncate"
            css={css`color: ${theme.colors.text};`}
          >
            {otherUser.userName}
          </span>
          <span className="text-xs whitespace-nowrap"
            css={css`color: ${theme.colors.textMid};`}
          >
            {new Date(chat.updatedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm truncate"
            css={css`color: ${theme.colors.textMid};`}
          >
            {otherUser.tag}
          </span>
        </div>

        <p className="pl-4 mt-1 text-sm truncate"
           css={css`color: ${theme.colors.text};`}
        >
          {lastMessage ? (
            <>
              {lastMessage.senderId == currentUserId
                ? `${t("CHAT.YOU")}: `
                : `${otherUser.userName}: `
              }
              {lastMessage.content}
            </>
          ) : (
            <span className="text-gray-400">{t("CHAT.NO_MESSAGES")}</span>
          )}
        </p>
      </div>
    </div>
  );
}