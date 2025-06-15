/** @jsxImportSource @emotion/react */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getChatsByUser } from "../../services/messages-service";
import { handleInvalidToken } from "../../services/users-service";
import Loading from "../shared/loading";
import ChatListItem from "./chat-list-item";
import { useTheme } from "@emotion/react";

export default function MessageTimeline({ user }) {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const theme = useTheme();

    useEffect(() => {
        if (!user?.id) return;

        const fetchChats = async () => {
            setLoading(true);
            try {
                const res = await getChatsByUser(user.id);
                if (res.status === 401) {
                    handleInvalidToken();
                    setChats([]);
                } else {
                    const data = await res.json();
                    setChats(data);
                }
            } catch (err) {
                console.error("Error fetching chats:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchChats();
    }, [user]);

    const handleSelect = (chatId) => {
        navigate(`/messages/${chatId}`);
    };

    if (loading) return <Loading />;

    return (
        <div className="divide-y overflow-y-auto h-full">
            {chats.map((chat) => (
                <>
                    <ChatListItem
                        key={chat.id}
                        chat={chat}
                        currentUserId={user.id}
                        onSelect={handleSelect}
                    />
                    <hr className={`border-[${theme.colors.secondary}]`} />
                </>
            ))}
        </div>
    );
}