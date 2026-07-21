"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import { getProfile } from "@/services/user";
import { IUser } from "@/types";

const CurrentUserContext = createContext<IUser | null>(null);
export const useCurrentUser = () => useContext(CurrentUserContext);

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    getProfile().then(setUser).catch(console.error);
  }, []);

  return (
    <CurrentUserContext.Provider value={user}>
      <div className="flex">
        <Sidebar />
        <main className="flex-1">{children}</main>
      </div>
    </CurrentUserContext.Provider>
  );
}
