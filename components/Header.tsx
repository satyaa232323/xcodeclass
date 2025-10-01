// components/Header.tsx
"use client";
import React from "react";

type HeaderProps = {
  isMinimized?: boolean; // opsional supaya tidak error saat dipass dari layout
  filteredCourses?: any; // opsional supaya tidak error saat dipass dari layout
};

export default function Header({ isMinimized, filteredCourses }: HeaderProps) {
  return (
    <header
      className="fixed top-0 left-0 right-0 h-16 bg-red-500 flex items-center justify-center px-6 z-30"
      // isMinimized tersedia jika nanti mau dipakai, tapi tidak wajib digunakan
    >
      <div className="w-1/3 max-w-xl">
        <input
          type="text"
          placeholder="Search here"
          className="w-full px-4 py-2 rounded-lg bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-700"
        />
      </div>
    </header>
  );
}
