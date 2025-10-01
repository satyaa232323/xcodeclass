"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { register } from "@/utils/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";



// Zod validation schema
const registerSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isError, setIsError] = useState("");

  const {
    register: registerForm,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const res = await register(data.username, data.email, data.password);

      if (!res) {
        setIsError("Register gagal");
        return;
      }

      setIsError("Akun berhasil dibuat");

      // redirect ke login setelah 2 detik
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (err) {
      setIsError("Terjadi kesalahan, silakan coba lagi");
    }
  };

  return (
    <div
    >

      {/* Tombol Back */}
      <a
        href="/"
        className="absolute bottom-6 left-6 flex items-center gap-2 text-white bg-black/50 px-4 py-2 rounded-full hover:bg-black/70 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </a>

      <div className="bg-white/90 rounded-2xl shadow-xl w-96 p-8 relative z-10">
        <h1 className="text-2xl font-bold text-center text-black">Register</h1>
        <p className="text-center text-gray-600 mb-6">
          Buat akun baru untuk XcodeVideo
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black">
              Username
            </label>
            <input
              type="text"
              {...registerForm("username")}
              className="w-full mt-1 px-3 py-2 border-2 border-gray-400 rounded-md 
                         focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 
                         text-black"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Email</label>
            <input
              type="email"
              {...registerForm("email")}
              className="w-full mt-1 px-3 py-2 border-2 border-gray-400 rounded-md 
                         focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 
                         text-black"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-black">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...registerForm("password")}
                className="w-full mt-1 px-3 py-2 border-2 border-gray-400 rounded-md 
                           focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 
                           text-black pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {isError && (
            <p
              className={`text-sm text-center ${isError.includes("berhasil") ? "text-green-600" : "text-red-600"
                }`}
            >
              {isError}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded-full hover:bg-red-700 transition"
          >
            Register
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Sudah punya akun?{" "}
            <a href="/auth/login" className="text-red-600 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
