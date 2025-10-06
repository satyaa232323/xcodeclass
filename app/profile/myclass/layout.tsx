"use client"; // kalau layout ini pakai Navbar interaktif

import NavbarClass from "@/components/navbarclass";

export default function ClassLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
    
      <main className="pt-20">{children}</main>
    </div>
    
  );
}
