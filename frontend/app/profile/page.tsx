import type { Metadata } from "next";
import ProfilePageClient from "./profile";

export const metadata: Metadata = {
  title: "Profile Information | Kurakani",
  description:
    "Manage your Kurakani profile, update your personal information, and customize your account settings.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Profile | Kurakani",
    description: "Manage your Kurakani profile and account settings.",
    type: "website",
  },
};

export default function ProfilePage() {
  return <ProfilePageClient />;
}
