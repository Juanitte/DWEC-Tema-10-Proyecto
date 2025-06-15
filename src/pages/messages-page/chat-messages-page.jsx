/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from "react";
import { useTheme } from "@emotion/react";
import { useNavigate, useParams } from "react-router-dom";
import ContentHeader from "../../components/shared/content-header";
import ChatMessages from "../../components/message/chat-messages";
import { getChat } from "../../services/messages-service";
import { getUserById, handleInvalidToken } from "../../services/users-service";

export default function ChatMessagesPage() {
  const { chatId: chatIdParam } = useParams();
  const chatId = Number(chatIdParam) || 0;
  const user = JSON.parse(localStorage.getItem("user"));
  const theme = useTheme();
  const navigate = useNavigate();

  // Hooks siempre aquí, en este orden:
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [targetUser, setTargetUser] = useState(null);

  useEffect(() => {
    let isActive = true;
    (async () => {
      try {
        // 1) Fetch del chat
        const resChat = await getChat(chatId);
        if (!isActive) return;

        if (resChat.status === 401) {
          handleInvalidToken();
          return;
        }
        if (!resChat.ok) {
          // chat inexistente
          navigate("/", { replace: true });
          return;
        }

        const chatData = await resChat.json();
        if (!isActive) return;

        // 2) Comprobar autorización
        if (!chatData.userIds.includes(Number(user.id))) {
          navigate("/", { replace: true });
          return;
        }
        setAuthorized(true);

        // 3) Fetch del otro usuario
        const otherId = chatData.userIds.find(id => id !== Number(user.id));
        const resUser = await getUserById(otherId);
        if (!isActive) return;

        if (resUser.status === 401) {
          handleInvalidToken();
          return;
        }
        if (!resUser.ok) {
          navigate("/", { replace: true });
          return;
        }

        const uData = await resUser.json();
        if (!isActive) return;
        setTargetUser(uData);

      } catch (err) {
        console.error(err);
        handleInvalidToken();
      } finally {
        if (isActive) setLoading(false);
      }
    })();

    return () => { isActive = false; };
  }, [chatId, user.id, navigate]);

  // Render condicional limpio:
  if (loading) {
    return null;           // o <Spinner />
  }
  if (!authorized) {
    // ya hicimos `navigate` en el efecto, pero por si acaso:
    return null;
  }
  if (!targetUser) {
    return null;
  }

  // Solo aquí llegamos cuando todo está OK:
  return (
    <main role="main" className="flex h-screen">
      <section
        className="w-full h-full border border-y-0 flex flex-col"
        css={{ borderColor: theme.colors.secondary }}
      >
        <ContentHeader title={targetUser.userName} hasBackButton />
        <hr css={{ borderColor: theme.colors.secondary }} />
        <div className="flex-1 min-h-0">
          <ChatMessages
            chatId={chatId}
            currentUserId={Number(user.id)}
            targetUser={targetUser}
          />
        </div>
      </section>
    </main>
  );
}