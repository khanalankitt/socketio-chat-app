"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { IMessage } from "@/types";
import { getMessages, markAsRead } from "@/services/message";
import { getSocket } from "@/lib/socket";
import { getProfile } from "@/services/user";

export default function ChatPage() {
  const { id: chatId } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [content, setContent] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!chatId) return;

    getProfile()
      .then((user) => setCurrentUserId(user._id))
      .catch(console.error);

    getMessages(chatId).then(setMessages).catch(console.error);
    markAsRead(chatId).catch(console.error);

    const socket = getSocket();
    if (!socket.connected) socket.connect();

    socket.emit("joinChat", chatId);

    const handleNewMessage = (message: IMessage) => {
      if (message.chat === chatId) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.emit("leaveChat", chatId);
      socket.off("newMessage", handleNewMessage);
    };
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!content.trim()) return;
    const socket = getSocket();
    socket.emit("sendMessage", { chatId, content });
    setContent("");
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => {
          const senderId =
            typeof msg.sender === "string" ? msg.sender : msg.sender._id;
          const isOwnMessage = senderId === currentUserId;

          return (
            <div
              key={msg._id}
              className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-2 rounded-md max-w-xs ${
                  isOwnMessage
                    ? "bg-black text-white"
                    : "bg-gray-100 text-black"
                }`}
              >
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t flex gap-2">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 border rounded-md text-sm"
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-black text-white rounded-md text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
}
