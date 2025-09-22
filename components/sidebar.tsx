"use client";
import Link from "next/link";
import { Home, BookOpen, LogOut, Menu, CreditCard } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function Sidebar({ isMinimized, setIsMinimized }: any) {
  const pathname = usePathname();

  const menuItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: Home },
    { href: "/admin/courses", label: "Courses", icon: BookOpen },
    { href: "/admin/transactions", label: "Transactions", icon: CreditCard },
    { href: "/", label: "Sign Out", icon: LogOut },
  ];

  return (
    <motion.aside
      initial={{ width: isMinimized ? 80 : 288 }}
      animate={{ width: isMinimized ? 80 : 288 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-screen flex flex-col z-40 shadow-2xl rounded-r-2xl overflow-hidden 
      bg-gradient-to-b from-red-700 to-red-900"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-500 p-5 flex justify-between items-center">
        {!isMinimized && (
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="text-3xl font-extrabold tracking-wide text-white font-[Inter]"
          >
            XcodeAdmin
          </motion.h1>
        )}
        <motion.button
          whileTap={{ rotate: 90, scale: 0.9 }}
          onClick={() => setIsMinimized(!isMinimized)}
          className="text-white"
        >
          <Menu size={30} />
        </motion.button>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 py-6 flex flex-col gap-3 text-white">
        {menuItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex items-center gap-4 px-4 py-3 rounded-xl font-semibold tracking-wide text-lg
                transition-all duration-200
                ${isActive ? "bg-white/20 text-white shadow-lg" : "hover:bg-white/10"}`}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-0 h-full w-1 bg-white rounded-r-md"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}

              {/* Icon micro-interaction */}
              <motion.div
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9, rotate: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Icon size={22} className="shrink-0" />
              </motion.div>

              {/* Text micro-interaction */}
              {!isMinimized && (
                <motion.span
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="whitespace-nowrap"
                >
                  {label}
                </motion.span>
              )}
            </Link>
          );
        })}
      </nav>
    </motion.aside>
  );
}
