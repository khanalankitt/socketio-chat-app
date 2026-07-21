"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IChat, IUser } from "@/types";
import { getUserChats, createOrGetChat } from "@/services/chat";
import { searchUsers } from "@/services/user";

export default function Sidebar() {
  const router = useRouter();
  const [chats, setChats] = useState<IChat[]>([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUserChats().then(setChats).catch(console.error);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        const users = await searchUsers(query);
        setResults(users);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 400); // debounce

    return () => clearTimeout(timeout);
  }, [query]);

  const handleSelectUser = async (userId: string) => {
    try {
      const chat = await createOrGetChat(userId);
      setQuery("");
      setResults([]);
      router.push(`/chat/${chat._id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <aside className="w-72 border-r h-screen flex flex-col">
      <div className="p-3 border-b">
        <input
          type="text"
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-3 py-2 border rounded-md text-sm"
        />
      </div>

      {query && (
        <div className="border-b max-h-60 overflow-y-auto">
          {loading && <p className="p-3 text-sm text-gray-500">Searching...</p>}
          {!loading &&
            results.map((user) => (
              <button
                key={user._id}
                onClick={() => handleSelectUser(user._id)}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2"
              >
                <span>{user.username}</span>
                {user.isOnline && (
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                )}
              </button>
            ))}
          {!loading && results.length === 0 && (
            <p className="p-3 text-sm text-gray-500">No users found</p>
          )}
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => {
          const other =
            chat.participants.find((p) => p._id !== chat.participants[0]._id) ??
            chat.participants[0];
          return (
            <button
              key={chat._id}
              onClick={() => router.push(`/chat/${chat._id}`)}
              className="w-full text-left px-3 py-3 hover:bg-gray-100 border-b"
            >
              <p className="font-medium">{other.username}</p>
              {chat.lastMessage && (
                <p className="text-sm text-gray-500 truncate">
                  {typeof chat.lastMessage === "object"
                    ? chat.lastMessage.content
                    : ""}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
