import { useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import { BASE_URL, SIGNAL_URL } from "../../utils/literals";

export default function useSignalRNewPosts(onNewPostReceived) {
    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(SIGNAL_URL) // Cambia si tienes dominio
            .withAutomaticReconnect()
            .build();

        connection.start()
            .then(() => console.log("SignalR conectado"))
            .catch((err) => console.error("Error al conectar SignalR:", err));

        connection.on("ReceivePost", (message) => {
            try {
                const parsed = JSON.parse(message);
                onNewPostReceived(parsed);
            } catch (e) {
                console.error("Error parsing new post event:", e);
            }
        });

        return () => {
            connection.stop();
        };
    }, [onNewPostReceived]);
}