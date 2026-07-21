"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MessageSquareText, LogOut, UserRound } from "lucide-react";
import Swal from "sweetalert2";
import { IChat, IUser } from "@/types";
import { getUserChats, createOrGetChat } from "@/services/chat";
import { searchUsers } from "@/services/user";
import { logout } from "@/services/auth";
import { useCurrentUser } from "@/app/chat/layout";
import Image from "next/image";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const currentUser = useCurrentUser();
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
        setResults(await searchUsers(query));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 400);
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

  const handleLogout = async () => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Log out?",
      text: "You'll need to sign in again to access your chats.",
      showCancelButton: true,
      confirmButtonText: "Log out",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#1D84AD",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await logout();
      Swal.fire({
        icon: "success",
        title: "Logout success",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      router.replace("/");
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Logout failed",
        text:"Something went wrong. Please try again.",
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };

  return (
    <aside className="w-80 h-screen border-r border-gray-200 shadow-sm flex flex-col bg-white">
      {/* Brand */}
      <div className="px-6 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          KURAKANI
        </h1>
      </div>

      {/* Search */}
      <div className="px-4 pb-3 relative">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex items-center bg-gray-100 rounded-full px-4 shadow-xs border border-gray-200 py-2.5"
        >
          <Search className="text-gray-400 mr-2 shrink-0" size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search people..."
            className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
          />
        </motion.div>

        <AnimatePresence>
          {query && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="absolute left-4 right-4 top-full mt-2 bg-white shadow-2xl border border-gray-100 max-h-72 overflow-y-auto z-20"
            >
              {loading && (
                <p className="px-4 py-3 text-sm text-gray-400">Searching...</p>
              )}
              {!loading &&
                results.map((user) => (
                  <button
                    key={user._id}
                    onClick={() => handleSelectUser(user._id)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 transition-colors text-left"
                  >
                    <div className="relative shrink-0">
                      <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold overflow-hidden">
                        {user.avatar ? (
                          <Image
                            src={user.avatar}
                            alt={user.username}
                            height={100}
                            width={100}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          (user.username?.[0]?.toUpperCase() ?? "?")
                        )}
                      </div>
                      {user.isOnline && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {user.username}
                    </span>
                  </button>
                ))}
              {!loading && results.length === 0 && (
                <p className="px-4 py-3 text-sm text-gray-400">
                  No users found
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto px-1">
        {chats.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-300 gap-2 px-6 text-center">
            <MessageSquareText size={36} strokeWidth={1.5} />
            <p className="text-sm text-gray-400">
              Search for someone to start chatting
            </p>
          </div>
        )}

        {chats.map((chat, i) => {
          const isActive = pathname === `/chat/${chat._id}`;
          const other = chat.participants.find(
            (p) => p._id !== currentUser?._id,
          );
          if (!other) return null;

          return (
            <motion.button
              key={chat._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
              onClick={() => router.push(`/chat/${chat._id}`)}
              className={`w-full flex items-center gap-3 px-6 py-3 mt-0.5 cursor-pointer border rounded-xl text-left transition-all ${
                isActive
                  ? "bg-blue-50 border-blue-200"
                  : "border-transparent hover:bg-gray-100"
              }`}
            >
              <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold shrink-0 overflow-hidden">
                {other.avatar ? (
                  <Image
                    height={100}
                    width={100}
                    src={other.avatar}
                    alt={other.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  (other.username?.[0]?.toUpperCase() ?? "?")
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {other.username}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {chat.lastMessage && typeof chat.lastMessage === "object"
                    ? chat.lastMessage.content
                    : "Say hello 👋"}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Footer: Profile + Logout */}
      <div className="px-4 py-4 pt-5 shadow-sm border-t border-gray-200 flex items-center gap-2">
        <button
          onClick={() => router.push("/profile")}
          className="flex-1 flex items-center justify-center gap-2 cursor-pointer text-gray-700 border border-gray-200 bg-gray-50 hover:bg-gray-100 rounded-full py-2.5 text-sm font-semibold transition-colors"
        >
          <UserRound size={16} />
          {currentUser?.username?.split(" ")[0] ?? "Profile"}
        </button>
        <button
          onClick={handleLogout}
          className="flex-1 flex items-center justify-center cursor-pointer gap-2 text-red-600 border border-red-300 bg-red-50 hover:bg-red-100 rounded-full py-2.5 text-sm font-semibold transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
