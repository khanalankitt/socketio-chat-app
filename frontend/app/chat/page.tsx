import type { Metadata } from "next";

export default function ChatIndexPage() {
  return (
    <div className="h-screen flex items-center justify-center text-gray-500">
      Select a chat to start messaging
    </div>
  );
}

export const metadata: Metadata = {
  title: "Chat | Kurakani",
  description:
    "Start a conversation with your friends, and continue your previous chats.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Chat | Kurakani",
    description:
      "Start a conversation with your friends, and continue your previous chats.",
    type: "website",
  },
};
