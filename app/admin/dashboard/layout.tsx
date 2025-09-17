"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar";
import Header from "@/components/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <Sidebar isMinimized={isMinimized} setIsMinimized={setIsMinimized} />

      {/* Main Area */}
      <div
        className={`transition-all duration-300 ${
          isMinimized ? "ml-20" : "ml-64"
        }`}
      >
        {/* Header */}
        <Header isMinimized={isMinimized} />


        {/* Page Content */}
        <main className="pt-20 px-6">{children}</main>
      </div>
    </div>
  );
}
