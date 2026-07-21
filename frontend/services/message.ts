import { IMessage } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function getMessages(chatId: string): Promise<IMessage[]> {
  const res = await fetch(`${BASE_URL}/message/${chatId}`, {
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch messages");
  return data;
}

export async function markAsRead(chatId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/message/${chatId}/read`, {
    method: "PATCH",
    credentials: "include",
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Failed to mark as read");
  }
}
