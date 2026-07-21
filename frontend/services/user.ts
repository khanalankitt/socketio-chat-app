import { IUser } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function searchUsers(query: string): Promise<IUser[]> {
  const res = await fetch(
    `${BASE_URL}/user/search?q=${encodeURIComponent(query)}`,
    {
      credentials: "include",
    },
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Search failed");
  return data;
}

export async function getProfile(): Promise<IUser> {
  const res = await fetch(`${BASE_URL}/user/me`, { credentials: "include" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch profile");
  return data;
}
