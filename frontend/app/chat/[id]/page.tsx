import type { Metadata } from "next";
import ChatPage from "./ChatClient";

export const metadata: Metadata = {
  title: "Chat | Kurakani",
  description:
    "Send messages, stay connected, and continue your conversations on Kurakani.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Chat | Kurakani",
    description:
      "Send messages, stay connected, and continue your conversations on Kurakani.",
    type: "website",
  },
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  return <ChatPage chatId={id} />;
}
