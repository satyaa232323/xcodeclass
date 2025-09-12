import Link from "next/link";
import { Home, BookOpen, LogOut } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-red-500 text-white min-h-screen p-4 flex flex-col gap-6">
      <h1 className="text-2xl font-bold">XcodeAdmin</h1>
      <nav className="flex flex-col gap-4">
        <Link href="/admin/dashboard" className="flex items-center gap-2 hover:text-red-900">
          <Home size={18} /> Dashboard
        </Link>
        <Link href="/admin/courses" className="flex items-center gap-2 hover:text-red-900">
          <BookOpen size={18} /> Courses
        </Link>
        <Link href="/" className="flex items-center gap-2 hover:text-red-900">
          <LogOut size={18} /> Sign Out
        </Link>
      </nav>
    </aside>
  );
}
