/** @jsxImportSource @emotion/react */
import ContentHeader from "../../components/shared/content-header";
import { useEffect, useState } from "react";
import { useTheme } from "@emotion/react";
import ChatMessages from "../../components/message/chat-messages";
import { useParams } from "react-router-dom";
import { getChat } from "../../services/messages-service";
import { getUserById, handleInvalidToken } from "../../services/users-service";

export default function ChatMessagesPage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const { chatId: chatIdParam } = useParams();    // <-- aquí
    const chatId = Number(chatIdParam) || 0;
    const [targetUser, setTargetUser] = useState(null);

    const theme = useTheme();

    // opcional: si quieres hacer algo cada vez que cambie el chatId
    useEffect(() => {
        try{
            const fetchChat = async () => {
                const response = await getChat(chatId);
                if (response.status === 401) {
                    handleInvalidToken();
                    return;
                }
                const chatData = await response.json();
                const targetUserId = chatData.userIds.find(id => id != user.id);
                const targetUserResponse = await getUserById(targetUserId);
                if (targetUserResponse.status === 401) {
                    handleInvalidToken();
                    return;
                }
                const targetUserData = await targetUserResponse.json();
                setTargetUser(targetUserData);
            };
            fetchChat();
        }
        catch (error) {
            console.error("Error fetching chat:", error);
            handleInvalidToken();
        }
    }, [chatId]);

    return (
        <main role="main" className="flex h-screen">
            <section
                className={`w-full h-full border border-y-0 border-[${theme.colors.secondary}] flex flex-col`}
            >
                <ContentHeader title={targetUser?.userName} hasBackButton={true} />
                <hr className={`border-[${theme.colors.secondary}]`} />
                <div className="flex-1 min-h-0">
                    <ChatMessages chatId={chatId} currentUserId={user.id} targetUser={targetUser} />
                </div>
            </section>
        </main>
    );
}