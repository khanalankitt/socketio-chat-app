"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, Send } from "lucide-react";
import { IMessage, IUser } from "@/types";
import { getMessages, markAsRead } from "@/services/message";
import { getChatById } from "@/services/chat";
import { getSocket } from "@/lib/socket";
import { useCurrentUser } from "../layout";
import Image from "next/image";

export default function ChatPage() {
  const { id: chatId } = useParams<{ id: string }>();
  const currentUser = useCurrentUser();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [content, setContent] = useState("");
  const [partner, setPartner] = useState<IUser | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!chatId || !currentUser) return;
    let isMounted = true;

    const loadChat = async () => {
      try {
        const [chat, initialMessages] = await Promise.all([
          getChatById(chatId),
          getMessages(chatId),
        ]);
        if (!isMounted) return;

        setMessages(initialMessages);
        setPartner(
          chat.participants.find((p) => p._id !== currentUser._id) ?? null,
        );
      } catch (err) {
        console.error(err);
      }
      markAsRead(chatId).catch(console.error);
    };

    loadChat();

    const socket = getSocket();
    if (!socket.connected) socket.connect();
    socket.emit("joinChat", chatId);

    const handleNewMessage = (message: IMessage) => {
      if (message.chat !== chatId) return;
      setMessages((prev) => [...prev, message]);
      markAsRead(chatId).catch(console.error);
    };

    const handleMessagesRead = (data: { chatId: string; userId: string }) => {
      if (data.chatId !== chatId || data.userId === currentUser._id) return;
      setMessages((prev) => prev.map((m) => ({ ...m, isRead: true })));
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messagesRead", handleMessagesRead);

    return () => {
      isMounted = false;
      socket.emit("leaveChat", chatId);
      socket.off("newMessage", handleNewMessage);
      socket.off("messagesRead", handleMessagesRead);
    };
  }, [chatId, currentUser]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!content.trim() || !chatId) return;
    getSocket().emit("sendMessage", { chatId, content });
    setContent("");
  };

  const getSenderId = (sender: IMessage["sender"]) =>
    typeof sender === "string" ? sender : sender._id;

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Navbar */}
      <div className="border-b border-gray-100 px-6 py-4 flex items-center gap-3 shrink-0 shadow-sm">
        <ChevronLeft
          onClick={() => router.replace("/chat")}
          size={40}
          className="text-gray-500 p-1 rounded-sm cursor-pointer hover:bg-gray-100 transition-all"
        />
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 text-xl flex items-center justify-center font-semibold">
            {partner?.avatar ? (
              <Image
                src={partner.avatar}
                alt={partner.username}
                height={100}
                width={100}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              (partner?.username?.[0]?.toUpperCase() ?? "?")
            )}{" "}
          </div>
          {partner?.isOnline && (
            <span className="absolute -bottom-0.5 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
          )}
        </div>
        <div>
          <p className="font-semibold text-xl text-gray-800">
            {partner?.username ?? "Loading..."}
          </p>
          <p
            className={`text-xs ${partner?.isOnline ? "text-green-600" : "text-gray-500"}`}
          >
            {partner?.isOnline ? "Active now" : "Offline"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-0.5 bg-gray-50/50">
        {messages.map((msg, i) => {
          const isOwn = getSenderId(msg.sender) === currentUser?._id;
          return (
            <motion.div
              key={msg._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: Math.min(i * 0.02, 0.3) }}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2.5 rounded-3xl max-w-xs text-sm shadow-sm wrap-break-word whitespace-pre-wrap ${
                  isOwn
                    ? "bg-blue-600 text-white rounded-br-md"
                    : "bg-white text-gray-700 rounded-bl-md border border-gray-100"
                }`}
              >
                <p>{msg.content}</p>
                {isOwn && i === messages.length - 1 && (
                  <p className="text-[10px] text-blue-200 mt-1 text-right">
                    {msg.isRead ? "Seen" : "Sent"}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 flex items-center gap-2 shrink-0">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="flex-1 bg-gray-100 shadow-xs border border-gray-200 transition-colors rounded-full px-5 py-3 text-sm outline-none text-gray-700 placeholder-gray-400"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSend}
          disabled={!content.trim()}
          className="w-11 h-11 shrink-0 bg-blue-600 hover:bg-blue-700 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
        >
          <Send size={18} />
        </motion.button>
      </div>
    </div>
  );
}
