import { IChat } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function createOrGetChat(otherUserId: string): Promise<IChat> {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ otherUserId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create chat");
  return data;
}

export async function getUserChats(): Promise<IChat[]> {
  const res = await fetch(`${BASE_URL}/chat`, { credentials: "include" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch chats");
  return data;
}

export async function getChatById(id: string): Promise<IChat> {
  const res = await fetch(`${BASE_URL}/chat/${id}`, {
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch chat");
  return data;
}
