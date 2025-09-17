"use client";
import { useState } from "react";
import Link from "next/link";
import { Home, BookOpen, LogOut, Menu, CreditCard } from "lucide-react";

export default function Sidebar({ isMinimized, setIsMinimized }: any) {
  return (
    <aside
      className={`fixed left-0 top-0 h-screen flex flex-col z-40 transition-all duration-300 
      ${isMinimized ? "w-20" : "w-64"}`}
    >
      {/* Bagian Atas */}
      <div className="bg-red-500 p-4 flex justify-between items-center">
        {!isMinimized && (
          <h1 className="text-2xl font-bold text-white">XcodeAdmin</h1>
        )}
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="text-white"
        >
          <Menu size={30} />
        </button>
      </div>

      {/* Bagian Menu */}
      <div className="flex-1 bg-red-700 text-white p-4 flex flex-col justify-between">
        <nav className="flex flex-col gap-4">
          <Link href="/admin/dashboard" className="flex items-center gap-2 hover:text-gray-200">
            <Home size={18} />
            {!isMinimized && <span>Dashboard</span>}
          </Link>
          <Link href="/admin/courses" className="flex items-center gap-2 hover:text-gray-200">
            <BookOpen size={18} />
            {!isMinimized && <span>Courses</span>}
          </Link>
          <Link href="/admin/transactions" className="flex items-center gap-2 hover:text-gray-200">
            <CreditCard size={18} />
            {!isMinimized && <span>Transactions</span>}
          </Link>
          <Link href="/" className="flex items-center gap-2 hover:text-gray-200">
            <LogOut size={18} />
            {!isMinimized && <span>Sign Out</span>}
          </Link>
        </nav>

        
      </div>
    </aside>
  );
}
