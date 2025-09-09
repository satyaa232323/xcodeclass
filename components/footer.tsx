"use client";

import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-50 py-10 border-t-2 border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-gray-600">
        {/* 1. Brand */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-black">
            <span className="text-red-500">X</span>CODEClass
          </h2>
          <p className="text-sm">
            Kuasai Keamanan Siber, Amankan Karier Digital Anda.
          </p>
          <div className="flex space-x-3 mt-2">
            {/* YouTube */}
            <a
              href="https://www.youtube.com/channel/UCEpJsniXFQYquQgzJp_y02g"
              aria-label="YouTube"
              className="p-2 bg-white rounded-full shadow"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-red-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M23.5 6.2s-.2-1.7-.9-2.4c-.8-.9-1.7-.9-2.1-1C17.7 2.5 12 2.5 12 2.5h-.1s-5.7 0-8.5.3c-.4 0-1.3 0-2.1 1-.7.7-.9 2.4-.9 2.4S0 8.3 0 10.5v1c0 2.2.5 4.3.5 4.3s.2 1.7.9 2.4c.8.9 1.9.9 2.4 1 1.8.2 7.6.3 7.6.3s5.7 0 8.5-.3c.4 0 1.3 0 2.1-1 .7-.7.9-2.4.9-2.4s.5-2.2.5-4.3v-1c0-2.2-.5-4.3-.5-4.3zM9.6 14.7V8.3l6.3 3.2-6.3 3.2z" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/xcodetrainning"
              aria-label="Instagram"
              className="p-2 bg-white rounded-full shadow"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-pink-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm10 2c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3h10zm-5 3.5A5.5 5.5 0 1 0 17.5 13 5.5 5.5 0 0 0 12 7.5zm0 2A3.5 3.5 0 1 1 8.5 13 3.5 3.5 0 0 1 12 9.5zm4.5-4a1.1 1.1 0 1 0 1.1 1.1 1.1 1.1 0 0 0-1.1-1.1z" />
              </svg>
            </a>
          </div>
        </div>

        {/* 2. Navigasi */}
        <div>
          <h3 className="font-semibold mb-2">Navigasi</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <a href="#" className="hover:text-red-500">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-red-500">
                Kelas
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-red-500">
                Mentor
              </a>
            </li>
          </ul>
        </div>

        {/* 3. Bantuan */}
        <div>
          <h3 className="font-semibold mb-2">Bantuan</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <a href="#terms-of-service" className="hover:text-red-500">
                Term &amp; Service
              </a>
            </li>
            <li>
              <a
                href="https://api.whatsapp.com/send/?phone=62895420754477&text&type=phone_number&app_absent=0"
                className="hover:text-red-500"
              >
                Hubungi Admin
              </a>
            </li>
          </ul>
        </div>

        {/* Kolom kosong biar grid rapi */}
        <div></div>
      </div>

      <div className="mt-8 border-t pt-4 text-center text-sm text-gray-400">
        © 2025 Xcode Internships. All rights reserved.
      </div>
    </footer>
  );
}
