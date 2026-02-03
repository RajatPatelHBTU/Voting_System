import { useState, useEffect } from "react";

const WS_URL = "ws://localhost:3000";
type Message = {
    name : string,
    party : string,
    hash : string,
    time : string
}
export const useWebSocket = () => {
    const [messages, setMessages] = useState<Message | null>(null);

    useEffect(() => {
        const ws = new WebSocket(WS_URL);
        console.log("ws",ws)
        ws.onopen = () => console.log("Connected to WebSocket Server");
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages(data);
        };
        ws.onclose = () => console.log("Disconnected from WebSocket Server");
        return () => ws.close();
    }, []);

    return messages;
};
