import {
    BASE_URL,
    MESSAGES_URL
} from "../utils/literals";

// Llama a POST chats/create
export async function createChat(userIds) {
  const body = {
    // tu CreateChatDto sólo pide UserIds; CreatedAt/UpdatedAt los rellena el servidor
    UserIds: userIds
  };

  return fetch(
    `${BASE_URL}${MESSAGES_URL}chats/create`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userIds),
    }
  );
}


export async function getChat(id) {
    return fetch(
        `${BASE_URL}${MESSAGES_URL}chats/getbyid/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );
}

// Llama a GET chats/getbyuser/{userId}
export async function getChatsByUser(userId) {
    return fetch(
        `${BASE_URL}${MESSAGES_URL}chats/getbyuser/${userId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );
}

// Llama a GET messages/getbychat/{chatId}
export async function getMessagesByChat(chatId) {
    return fetch(
        `${BASE_URL}${MESSAGES_URL}messages/getbychat/${chatId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );
}

export async function getLastMessageByChat(chatId) {
    return fetch(
        `${BASE_URL}${MESSAGES_URL}messages/getlastbychat/${chatId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );
}

// Llama a POST messages/create
export async function sendMessage({
    content,
    chatId,
    senderId,
    attachments
}) {
    const form = new FormData();
    form.append("Content", content);
    form.append("ChatId", chatId);
    form.append("SenderId", senderId);
    attachments.forEach((file) => {
        form.append("Attachments", file);
    });

    return fetch(
        `${BASE_URL}${MESSAGES_URL}messages/create`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                // IMPORTANT: No pongas Content-Type aquí, Fetch lo
                // calcula automáticamente al usar FormData.
            },
            body: form,
        }
    );
}