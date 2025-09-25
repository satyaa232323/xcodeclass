"use client";

import { useState, FormEvent } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!email) {
      setMessage("Email wajib diisi");
      setIsError(true);
      return;
    }

    // TODO: Call API reset password di sini
    setMessage(
      "Link reset password telah dikirim ke " + email
    );
    setIsError(false);
    setEmail("");
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/bg-login.png')" }}
    >
      <div className="bg-white/90 rounded-2xl shadow-xl w-96 p-8 relative z-10">
        <h1 className="text-2xl font-bold text-center text-black">
          Forgot Password
        </h1>
        <p className="text-center text-black mb-6">
          Masukkan email akun kamu untuk reset password
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-3 py-2 border-2 border-gray-400 rounded-md 
                         focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 
                         text-black"
            />
          </div>

          {message && (
            <p
              className={`text-sm text-center ${
                isError ? "text-red-600" : "text-gray-900"
              }`}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded-full hover:bg-red-700 transition"
          >
            Kirim Link Reset
          </button>
        </form>

        <div className="mt-4 text-center">
          <a href="/auth/login" className="text-red-600 hover:underline">
            ← Kembali ke Login
          </a>
        </div>
      </div>
    </div>
  );
}
