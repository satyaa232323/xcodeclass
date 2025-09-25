"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { logout } from "@/utils/api";
import { useRouter } from "next/navigation";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("token");
    window.location.href = "/";
  };
  return (
    <div className="h-screen bg-gray-50 overflow-hidden flex flex-col">
      <main className="flex flex-1 overflow-hidden relative">
        {/* Tombol Hamburger */}
        <button
          className="lg:hidden absolute top-4 left-4 z-50 p-2 bg-white border rounded-lg shadow-md"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <X size={24} className="text-black" />
          ) : (
            <Menu size={24} className="text-black" />
          )}
        </button>

        {/* Sidebar */}
        <div
          className={`fixed lg:static top-0 left-0 h-full w-full lg:w-56 bg-white border-r-2 border-gray-200 flex flex-col justify-between transform transition-transform duration-300 z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        >
          {/* Bagian atas: Logo + Menu */}
          <div className="flex flex-col items-center w-full">
            {/* Logo */}
            <Link href="/">
              <div className="pt-6 pb-4">
                <Image
                  src="/images/xcodelogo.png"
                  alt="Logo"
                  width={100}
                  height={100}
                  className="mx-auto"
                />
              </div>
            </Link>

            {/* Menu */}
            <ul className="w-full text-center lg:text-left ">
              <li className="p-6 text-lg text-gray-500 hover:text-red-500 cursor-pointer">
                <Link href="/profile">Dashboard</Link>
              </li>
              <li className="p-6 text-lg text-gray-500 hover:text-red-500 cursor-pointer">
                <Link href={`/profile/payment`}>Payment</Link>
              </li>
              <li className="p-6 text-lg text-gray-500 hover:text-red-500 cursor-pointer">
                <Link href="/profile/history">History</Link>
              </li>
            </ul>
          </div>

          {/* Bagian bawah: Logout */}
          <div className="w-full">
            <ul className="text-center lg:text-left">
              <li
                className="p-6 text-lg text-gray-500 hover:text-red-500 cursor-pointer"
                onClick={handleLogout}
              >
                Keluar
              </li>
            </ul>
          </div>
        </div>

        {/* Overlay untuk mobile */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Konten utama */}
        <div className="flex-1 p-6 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
