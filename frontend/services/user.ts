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

export async function updateProfile(data: {
  username?: string;
  avatar?: string;
}): Promise<IUser> {
  const res = await fetch(`${BASE_URL}/user/me`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to update profile");
  return result;
}
