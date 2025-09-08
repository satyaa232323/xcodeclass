import React from "react";
import Image from "next/image";

const Navbar = () => {
  return (
    <nav className="w-full bg-white shadow flex items-center justify-between px-6 py-3 border-b-1">
      {/* Kiri: Logo */}
      <div className="flex-1 flex items-center">
        <Image
          src="/images/xcodelogo.png"
          alt="Xcode Internships Logo"
          width={58}
          height={58}
          className="w-12 h-12 sm:w-14 sm:h-14 md:w-[58px] md:h-[58px] object-contain"
        />
        <span className="text-lg sm:text-xl font-bold text-gray-900">
          <span className="text-red-500">X</span>CodeClass
        </span>
      </div>

      {/* Tengah: Search Bar */}
      <div className="flex-1 flex justify-center">
        <input
          type="text"
          placeholder="Cari..."
          className="w-full text-gray-400 max-w-md px-4 py-1.5 border border-gray-400 rounded-3xl focus:outline-none focus:ring-1 focus:ring-gray-500"
        />
      </div>

      {/* Kanan: Tombol Masuk & Daftar */}
      <div className="flex-1 flex justify-end items-center gap-3">
        <button className="px-5 py-1.5 bg-transparent border border-gray-400 rounded-xl text-gray-400 rounded-xl hover:text-red-500 transition">
          Masuk
        </button>
        <button className="px-5 py-1.5 bg-red-500 border rounded-xl text-white rounded-xl hover:bg-red-600 transition">
          Daftar
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
