"use client";

import Swal from "sweetalert2";
import { useState } from "react";
import { motion } from "framer-motion";
import { LucideIcon, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { login, register } from "@/services/auth";
import { useRouter } from "next/navigation";

type Tab = "login" | "register";

export default function AuthTabs() {
  const [activeTab, setActiveTab] = useState<Tab>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });

  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const data =
        activeTab === "login"
          ? await login({ email: formData.email, password: formData.password })
          : await register({
              username: formData.username,
              email: formData.email,
              password: formData.password,
            });

      router.replace("/chat");

      Swal.fire({
        icon: "success",
        title: activeTab === "login" ? "Logged in!" : "Account created!",
        text: `Welcome${data?.user?.username ? ", " + data.user.username : ""}!`,
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: activeTab === "login" ? "Login failed" : "Registration failed",
        text: error.message || "Something went wrong. Please try again.",
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-blue-500 flex items-center justify-center p-4">
      {/* Content container */}
      <div className="relative z-10 w-full max-w-4xl">
        {/* Main Card - Split Layout */}
        <motion.div
          layout
          className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20 flex flex-col md:flex-row"
        >
          <div className="relative md:w-1/2 p-8 flex flex-col items-center justify-between min-h-75 md:min-h-125">
            {/* Top Section - Text/Branding */}
            <div className="relative z-10 text-center text-white pt-4">
              <div className="flex items-center justify-center gap-3 mb-1">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
                  KURAKANI
                </h1>
              </div>

              <motion.p
                key={`description-${activeTab}`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className=" text-gray-500 text-xs md:text-sm max-w-xs mx-auto leading-relaxed"
              >
                {activeTab === "login"
                  ? "Sign in to continue your journey with us"
                  : "Create your account and get started today"}
              </motion.p>
            </div>

            {/* Bottom Section - Image */}
            <div className="absolute inset-0 bg-white/5 rounded-3xl backdrop-blur-[2px]" />
            <div className="relative w-full h-full p-4">
              <Image
                src="/chat.svg"
                alt="Chat illustration"
                fill
                draggable={false}
                className="object-contain p-2"
                priority
              />
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
            {/* Tab Switch */}
            <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-full relative">
              <motion.div
                layoutId="tab-indicator"
                className="absolute inset-1 bg-white rounded-full shadow"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />

              {(["login", "register"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="relative z-10 flex-1 py-2.5 cursor-pointer px-4 font-semibold text-center capitalize transition-colors text-sm"
                  style={{
                    color: activeTab === tab ? "#0369a1" : "#94a3b8",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Title */}
            <motion.h2
              key={`title-${activeTab}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="text-2xl font-bold text-gray-700 mb-6 capitalize"
            >
              {activeTab === "login" ? "Sign In" : "Create Account"}
            </motion.h2>

            {/* Form Content with animation */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: activeTab === "login" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: activeTab === "login" ? 20 : -20 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                {activeTab === "register" && (
                  <InputField
                    icon={User}
                    placeholder="Full name"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                  />
                )}

                <InputField
                  icon={Mail}
                  placeholder="Email address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />

                <InputField
                  icon={Lock}
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  showToggle
                  isVisible={showPassword}
                  onToggle={() => setShowPassword(!showPassword)}
                />

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-linear-to-r cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-all shadow-lg hover:shadow-xl"
                >
                  {activeTab === "login" ? "Sign in" : "Create account"}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-white text-sm mt-6"
        >
          {activeTab === "login"
            ? "Don't have an account? "
            : "Already have an account? "}
          <button
            onClick={() =>
              setActiveTab(activeTab === "login" ? "register" : "login")
            }
            className="text-white font-semibold hover:underline"
          >
            {activeTab === "login" ? "Register" : "Login"}
          </button>
        </motion.p>
      </div>
    </div>
  );
}

interface InputFieldProps {
  icon: LucideIcon;
  placeholder: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showToggle?: boolean;
  isVisible?: boolean;
  onToggle?: () => void;
}

function InputField({
  icon: Icon,
  placeholder,
  type,
  name,
  value,
  onChange,
  showToggle = false,
  isVisible = false,
  onToggle,
}: InputFieldProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <div className="flex items-center bg-gray-100 rounded-full px-4 py-3 focus-within:bg-gray-200 transition-colors">
        <Icon className="text-gray-400 mr-3 shrink-0" size={20} />
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 font-medium"
        />
        {showToggle && onToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="text-gray-400 hover:text-gray-600 transition-colors shrink-0 ml-2"
          >
            {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    </motion.div>
  );
}
