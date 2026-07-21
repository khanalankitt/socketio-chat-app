"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import {
  User,
  Image as ImageIcon,
  Mail,
  Save,
  ChevronLeft,
} from "lucide-react";
import { getProfile, updateProfile } from "@/services/user";
import { IUser } from "@/types";
import Image from "next/image";

export default function ProfilePageClient() {
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>(null);
  const [formData, setFormData] = useState({ username: "", avatar: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getProfile()
      .then((data) => {
        setUser(data);
        setFormData({ username: data.username, avatar: data.avatar ?? "" });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updateProfile(formData);
      setUser(updated);
      Swal.fire({
        icon: "success",
        title: "Profile updated",
        timer: 1800,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Update failed",
        text: err.message || "Something went wrong. Please try again.",
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-400 text-sm">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-4xl relative bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
      >
        <button
          onClick={() => router.back()}
          className="flex absolute top-3 left-3 cursor-pointer items-center gap-1 text-xl text-gray-600 hover:text-gray-700 transition-colors mb-6"
        >
          <ChevronLeft size={30} />
        </button>

        {/* Avatar preview */}
        <div className="grid md:grid-cols-[320px_1fr]">
          {/* LEFT */}
          <div className="border-r border-gray-100 bg-gray-50 p-8 flex flex-col items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-5xl font-bold overflow-hidden shadow-md">
              {formData.avatar ? (
                <Image
                  height={200}
                  width={200}
                  src={formData.avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                (formData.username?.[0]?.toUpperCase() ?? "?")
              )}
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mt-5 text-center">
              {formData.username}
            </h2>

            <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
              <span
                className={`w-2 h-2 rounded-full ${
                  user?.isOnline ? "bg-green-500" : "bg-gray-400"
                }`}
              />
              {user?.isOnline ? "Active now" : "Offline"}
            </p>
          </div>

          {/* RIGHT */}
          <div className="p-8">
            <form onSubmit={handleSave} className="space-y-5">
              {/* Username */}
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">
                  Username
                </label>

                <div className="flex items-center bg-gray-100 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500">
                  <User className="text-gray-400 mr-3" size={18} />
                  <input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="flex-1 bg-transparent outline-none"
                    placeholder="Username"
                  />
                </div>
              </div>

              {/* Avatar */}
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">
                  Avatar URL
                </label>

                <div className="flex items-center bg-gray-100 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500">
                  <ImageIcon className="text-gray-400 mr-3" size={18} />
                  <input
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleChange}
                    className="flex-1 bg-transparent outline-none"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">
                  Email
                </label>

                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                  <Mail className="text-gray-400 mr-3" size={18} />
                  <span className="text-gray-500">{user?.email}</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={saving}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition"
              >
                <Save size={18} />
                {saving ? "Saving..." : "Save Changes"}
              </motion.button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
