"use client";

import { useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { login } from "@/utils/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
   const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  // login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const body = await login(email, password); // langsung dapet JSON

      if (body.token) {
        setToken(body.token);

        // simpan token ke localStorage atau cookie
        localStorage.setItem("token", body.token);
        console.log("Login sukses:", body);
      } else {
        setError("Login gagal, cek email/password");
        console.error("Login gagal:", body);
      }

        // redirect ke login setelah 2 detik
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
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
        <h1 className="text-2xl font-bold text-center text-black">XcodeVideo</h1>
        <p className="text-center text-black mb-6">Login Account</p>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black">Username</label>
            <input
              type="text"
              className="w-full mt-1 px-3 py-2 border-2 border-gray-400 rounded-md 
                         focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 
                         text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full mt-1 px-3 py-2 border-2 border-gray-400 rounded-md 
                           focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 
                           text-black pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          </div>

          <div className="text-right text-sm">
            <Link href={'auth/forgot-password'} className="text-black hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded-full hover:bg-red-700 transition"
            onClick={handleLogin}
            disabled={loading}
          >
            SIGN IN
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
    </div>
  );
}
