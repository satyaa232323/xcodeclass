"use client";
import { useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react"; // ikon hamburger & close

export default function Profile() {
  const [isOpen, setIsOpen] = useState(false);

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
            <div className="pt-6 pb-4">
              <Image
                src="/images/xcodelogo.png"
                alt="Logo"
                width={100}
                height={100}
                className="mx-auto"
              />
            </div>

            {/* Menu */}
            <ul className="w-full text-center lg:text-left">
              <li className="p-6 text-lg text-gray-500 hover:text-red-500 cursor-pointer">
                Dashboard
              </li>
              <li className="p-6 text-lg text-gray-500 hover:text-red-500 cursor-pointer">
                History
              </li>
            </ul>
          </div>

          {/* Bagian bawah: Logout */}
          <div className="w-full">
            <ul className="text-center lg:text-left">
              <li className="p-6 text-lg text-gray-500 hover:text-red-500 cursor-pointer">
                Keluar
              </li>
            </ul>
          </div>
        </div>

        {/* Overlay saat sidebar terbuka di mobile */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Konten utama */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex p-4 gap-4 flex-col">
            <div className="flex flex-col items-center mb-10">
              <div className="w-40 h-40 rounded-full bg-red-500 flex items-center justify-center text-white text-4xl font-bold mb-2">
                AB
              </div>
              <div className="text-2xl font-bold text-gray-800">Andi Budi</div>
            </div>
            <div className="flex flex-col items-start">
              <h1 className="text-black font-bold text-xl">
                Kelas Yang Kamu Ikuti
              </h1>
              <div className="flex flex-col gap-4 max-h-[420px] overflow-y-auto w-full pr-2 mt-2">
                {/* Card */}
                <div className="flex flex-col sm:flex-row bg-white rounded-2xl shadow-lg border border-gray-200 min-h-[220px] w-full overflow-hidden">
                  <div className="h-48 sm:h-full sm:w-1/3 min-w-[220px] max-w-[340px] flex-shrink-0">
                    <div className="relative w-full h-full min-h-[220px]">
                      <Image
                        src="/images/thumbnail.png"
                        alt="Kelas"
                        fill
                        className="object-cover object-center rounded-t-xl sm:rounded-tl-xl sm:rounded-bl-xl sm:rounded-tr-none"
                        sizes="(max-width: 768px) 100vw, 240px"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col flex-1 justify-center p-8 text-center sm:text-left">
                    <div className="font-bold text-2xl text-black mb-2">
                      Judul Kelas 1
                    </div>
                    <div className="text-base text-gray-600 mb-4">
                      Deskripsi singkat kelas yang kamu ikuti akan tampil di
                      sini.
                    </div>
                    <button className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition w-max mx-auto sm:mx-0 text-base font-bold">
                      Lanjutkan Belajar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
