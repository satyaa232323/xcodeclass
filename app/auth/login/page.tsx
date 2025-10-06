"use client";

import { useState } from "react";
import { useToast } from "@/components/ToastContext";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { login } from "@/utils/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Zod validation schema
const loginSchema = z.object({
  email: z.string().email("Alamat email tidak valid"),
  password: z.string().min(6, "Password harus memiliki setidaknya 6 karakter"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Handle login with zod + react-hook-form
  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);

    try {
      const body = await login(data.email, data.password);

      if (body.token) {
        localStorage.setItem("token", body.token);
        toast.showToast("Login berhasil!", "success");

        if (body.user.role === "ADMIN") {
          router.push("/admin/dashboard");
        } else {
          router.push("/");
        }
      } else {
        toast.showToast("Coba periksa password dan emailnya.", "error");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || "Password salah atau email belum terdaftar";
      toast.showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/bg-login.png')" }}
    >
      {/* Tombol Back */}
      <a
        href="/"
        className="absolute bottom-6 left-6 flex items-center gap-2 text-white bg-black/50 px-4 py-2 rounded-full hover:bg-black/70 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </a>

      {/* Login card */}
      <div className="bg-white/90 rounded-2xl shadow-xl w-96 p-8 relative z-10">
        <h1 className="text-2xl font-bold text-center text-black">
          XcodeVideo
        </h1>
        <p className="text-center text-black mb-6">Login Account</p>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-black">
              Email
            </label>
            <input
              type="text"
              className="w-full mt-1 px-3 py-2 border-2 border-gray-400 rounded-md 
                         focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 
                         text-black"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-black">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full mt-1 px-3 py-2 border-2 border-gray-400 rounded-md 
                           focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 
                           text-black pr-10"
                {...register("password")}
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
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Forgot password */}
          <div className="text-right text-sm">
            <Link
              href={"auth/forgot-password"}
              className="text-black hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className={`w-full ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 cursor-pointer"
            } text-white py-2 rounded-full transition`}
            disabled={loading}
          >
            {loading ? "Mohon tunggu..." : "SIGN IN"}
          </button>
        </form>

        {/* Register link */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don’t have an account?{" "}
            <a href="/auth/register" className="text-red-600 hover:underline">
              Register
            </a>
          </p>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50">
          {/* Logo X */}
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 w-full h-1 bg-red-600 rotate-45 origin-center animate-pulse"></div>
            <div className="absolute inset-0 w-full h-1 bg-white -rotate-45 origin-center animate-pulse"></div>
          </div>

          {/* Teks XCODE */}
          <h2 className="mt-8 text-white text-3xl font-bold tracking-widest animate-pulse">
            XCODE
          </h2>

          {/* Subtext Loading */}
          <p className="mt-2 text-gray-400 text-sm animate-pulse">
            Loading...
          </p>
        </div>
      )}
    </div>
  );
}
