import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  // Simulasi status login, ganti dengan state/auth dari context jika sudah ada
  const [isLoggedIn, setIsLoggedIn] = useState(false); // default: belum login

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow flex items-center justify-between px-6 py-3 border-b-1 z-50">
      {/* Kiri: Logo & Tulisan */}
      <Link href="/">
        {/* Kiri: Logo & Tulisan, hidden on small */}
        <div className="flex-1 flex items-center">
          <Image
            src="/images/xcodelogo.png"
            alt="Xcode Internships Logo"
            width={58}
            height={58}
            className="w-10 h-10 sm:w-14 sm:h-14 md:w-[58px] md:h-[58px] object-contain"
          />
          <span className="hidden sm:inline text-lg sm:text-xl font-bold text-gray-900 ml-2">
            <span className="text-red-500">X</span>CODEClass
          </span>
        </div>
      </Link>

      {/* Tengah: Search Bar */}
      <div className="flex-1 flex justify-center">
        <input
          type="text"
          placeholder="Cari..."
          className="w-full text-gray-400 max-w-md px-4 py-1.5 border border-gray-400 rounded-3xl focus:outline-none focus:ring-1 focus:ring-gray-500"
        />
      </div>

      {/* Kanan: Tombol */}
      <div className="flex-1 flex justify-end items-center gap-3">
        <div className="hidden sm:flex gap-3">
          {isLoggedIn ? (
            <Image
              src="/images/profile.svg"
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full w-10 h-10 object-cover border-2 border-gray-300"
            />
          ) : (
            <>
              <Link href="/login">
                <button className="px-5 py-1.5 bg-transparent border border-gray-400 rounded-xl text-gray-400 hover:text-red-500 transition cursor-pointer">
                  Masuk
                </button>
              </Link>
              <Link href="/register">
                <button className="px-5 py-1.5 bg-red-500 border rounded-xl text-white hover:bg-red-600 transition cursor-pointer">
                  Daftar
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Hamburger menu on small */}
        <div className="sm:hidden flex items-center">
          <button
            className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Menu"
          >
            {menuOpen ? (
              <svg
                className="w-7 h-7 text-gray-700"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-7 h-7 text-gray-700"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Fullscreen menu for small screens */}
      <div
        className={`fixed inset-0 w-full h-full bg-white z-40 flex flex-col items-center justify-center sm:hidden transition-transform duration-300 ease-in-out ${
          menuOpen
            ? "translate-x-0 pointer-events-auto"
            : "translate-x-full pointer-events-none"
        }`}
        style={{ willChange: "transform" }}
      >
        {/* Tombol X */}
        <button
          className="absolute top-4 right-4 p-1 rounded-full focus:outline-none"
          style={{ background: "transparent" }}
          onClick={() => setMenuOpen(false)}
          aria-label="Tutup Menu"
        >
          <svg
            className="w-7 h-7 text-gray-700"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <span className="text-2xl font-bold text-gray-900 mb-8">
          <span className="text-red-500">X</span>CodeClass
        </span>
        <button className="w-3/4 max-w-xs px-5 py-3 mb-4 text-lg bg-gray-100 rounded-xl text-gray-700 border-b border-gray-200 hover:bg-gray-200 transition">
          Masuk
        </button>
        <button className="w-3/4 max-w-xs px-5 py-3 text-lg bg-red-500 rounded-xl text-white hover:bg-red-600 transition">
          Daftar
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
