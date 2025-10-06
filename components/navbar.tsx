"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { verifyJWT } from "@/lib/auth";
import { Userprofile } from "@/utils/api";

type NavbarProps = {
  onSearchChange?: (keyword: string) => void;
};

const Navbar: React.FC<NavbarProps> = ({ onSearchChange }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<null | any>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setLoading(false);
      return;
    }
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (!token) return; // jangan panggil kalau token belum ada
    const checkAuth = async () => {
      try {
        const userData = await Userprofile(token);
        setUser(userData);
      } catch (err) {
        console.error(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [token]);

  // default: belum login

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
          placeholder="Cari kelas..."
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="w-full text-gray-600 max-w-md px-4 py-1.5 border border-gray-400 rounded-3xl focus:outline-none focus:ring-1 focus:ring-gray-500"
        />
      </div>

      {/* Kanan: Tombol */}
      <div className="flex-1 flex justify-end items-center gap-3">
        <div className="hidden sm:flex gap-3">
          {user ? (
            <Link href="/profile">
              <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center cursor-pointer">
                <span className="text-white font-bold text-lg">
                  {user.name ? (
                    user.name.charAt(0).toUpperCase()
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="white"
                      viewBox="0 0 24 24"
                      className="w-7 h-7 text-white"
                    >
                      <path d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 19.5a7.5 7.5 0 0115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75V19.5z" />
                    </svg>
                  )}
                </span>
              </div>
            </Link>
          ) : (
            <>
              <Link href="/auth/login">
                <button className="px-5 py-1.5 bg-transparent border border-gray-400 rounded-xl text-gray-400 hover:text-red-500 transition cursor-pointer">
                  Masuk
                </button>
              </Link>
              <Link href="/auth/register">
                <button className="px-5 py-1.5 bg-red-500 border rounded-xl text-white hover:bg-red-600 transition cursor-pointer">
                  Daftar
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Hamburger menu on small */}
        <div className="sm:hidden flex items-center">
          {user ? (
            <Link href="/profile">
              <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {user.name ? (
                    user.name.charAt(0).toUpperCase()
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="white"
                      viewBox="0 0 24 24"
                      className="w-7 h-7 text-white"
                    >
                      <path d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 19.5a7.5 7.5 0 0115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75V19.5z" />
                    </svg>
                  )}
                </span>
              </div>
            </Link>
          ) : (
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
          )}
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

        <Link href="/auth/login" className="w-3/4 max-w-xs">
          <button className="w-full px-5 py-3 mb-4 text-lg bg-gray-100 rounded-xl text-gray-700 border-b border-gray-200 hover:bg-gray-200 transition">
            Masuk
          </button>
        </Link>
        <Link href="/auth/register" className="w-3/4 max-w-xs">
          <button className="w-full px-5 py-3 text-lg bg-red-500 rounded-xl text-white hover:bg-red-600 transition">
            Daftar
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
