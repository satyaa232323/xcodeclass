"use client";

import Navbar from "@/components/navbar";
import Image from "next/image";
import { useState } from "react";

export default function ClassesPage() {
  // Dummy data kelas (bisa diganti dengan data dari API)
  const kelasList = [
    { id: 1, title: "Judul kelas", desc: "deskripsi", price: "10.000" },
    { id: 2, title: "Judul kelas 2", desc: "deskripsi", price: "20.000" },
    { id: 3, title: "Judul kelas 3", desc: "deskripsi", price: "30.000" },
    { id: 4, title: "Judul kelas 4", desc: "deskripsi", price: "40.000" },
    { id: 5, title: "Judul kelas 5", desc: "deskripsi", price: "50.000" },
    // ...tambahkan data lain jika perlu
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex flex-col items-center py-10 px-4 md:px-20 w-full">
        <h1 className="text-3xl font-bold text-black mb-4 text-center">
          Kelas Kami
        </h1>
        <p className="text-lg text-gray-700 mb-12 text-center max-w-2xl">
          Pilih kelas yang sesuai dengan minat dan kebutuhanmu. Semua kelas
          didesain untuk pembelajaran praktis dan siap kerja!
        </p>
        
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full">
          {kelasList.map((kelas) => (
            <div
              key={kelas.id}
              className="flex flex-col bg-white text-black border-gray-200 border-2 rounded-xl overflow-hidden shadow-md min-w-[340px] max-w-2xl"
            >
              <Image
                src="/images/foto_vid.png"
                alt="Thumbnail Video"
                width={400}
                height={220}
                className="object-cover w-full h-48"
              />
              <div className="flex flex-col flex-1 p-4 gap-2">
                <div>
                  <h2 className="font-bold text-lg mb-1">{kelas.title}</h2>
                  <p className="font-extralight text-sm mb-2 line-clamp-1">
                    {kelas.desc}
                  </p>
                </div>
                <span className="font-bold text-base mb-4">{kelas.price}</span>
                <button className="mt-auto py-2 px-6 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold w-full cursor-pointer">
                  Beli
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
