"use client";

import Navbar from "@/components/navbar";
import Image from "next/image";
import Footer from "@/components/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      <main className=" py-4 lg:py-6 space-y-6 lg:space-y-8">
        <div className="grid gap-10 grid-cols-[400px,1fr,2fr,auto,auto] items-center">
          {/* Call to Action */}
          <div
            className="relative left-1/2 right-1/2 -mx-4 lg:-mx-6 w-screen bg-white flex flex-col md:flex-row items-center justify-between min-h-64 lg:min-h-[440px] py-10 gap-6 col-span-full"
            style={{ transform: "translateX(-50%)" }}
          >
            <div className="flex-1 flex flex-col items-center md:items-start justify-center gap-4 text-black text-center md:text-left px-4 md:px-20">
              <h1 className="text-3xl lg:text-5xl font-bold mb-2">
                Gabung Kelas XcodeClass Sekarang!
              </h1>
              <p className="text-lg lg:text-2xl mb-4 max-w-2xl">
                Tingkatkan skill digitalmu bersama mentor berpengalaman dan
                materi berbasis studi kasus nyata. Raih sertifikat dan peluang
                karier di dunia teknologi!
              </p>
              <button className="px-10 py-4 bg-red-500 text-white font-bold rounded-full shadow hover:bg-red-600 transition text-xl">
                Beli Kelas
              </button>
            </div>
            <div className="flex-1 hidden md:flex items-center justify-end h-full pr-8">
              <Image
                src="/images/landing.png"
                alt="Landing Illustration"
                width={600}
                height={600}
                className="object-contain h-[340px] lg:h-[440px] w-auto"
                priority
              />
            </div>
          </div>

          {/* Teks */}
          <div className="flex flex-col space-y-4 px-10">
            <h1 className="text-black text-2xl lg:text-2xl font-bold leading-snug">
              Kuasai Keamanan Siber, Amankan Karier Digital Anda
            </h1>
            <p className="text-black text-base lg:text-lg leading-relaxed">
              Ikuti pembelajaran praktis berbasis studi kasus nyata untuk
              meningkatkan kemampuan Anda dalam melindungi data dan sistem
              digital.
            </p>
          </div>

          {/* Video Class */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-10">
            {/* Card Video */}
            <div className="flex flex-col bg-white text-black border-gray-200 border-2 rounded-xl overflow-hidden shadow-md">
              <Image
                src="/images/foto_vid.png"
                alt="Thumbnail Video"
                width={400}
                height={220}
                className="object-cover w-full h-48"
              />
              <div className="flex flex-col flex-1 p-4 gap-2">
                <div>
                  <h2 className="font-bold text-lg mb-1">Judul video</h2>
                  <p className="font-extralight text-sm mb-2">deskripsi</p>
                </div>
                <span className="font-bold text-base mb-4">10.000</span>
                <button className="mt-auto py-2 px-6 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold w-full">
                  Beli
                </button>
              </div>
            </div>

            {/* Card Video Kedua */}
            <div className="flex flex-col bg-white text-black border-gray-200 border-2 rounded-xl overflow-hidden shadow-md">
              <Image
                src="/images/foto_vid.png"
                alt="Thumbnail Video"
                width={400}
                height={220}
                className="object-cover w-full h-48"
              />
              <div className="flex flex-col flex-1 p-4 gap-2">
                <div>
                  <h2 className="font-bold text-lg mb-1">Judul video</h2>
                  <p className="font-extralight text-sm mb-2">deskripsi</p>
                </div>
                <span className="font-bold text-base mb-4">10.000</span>
                <button className="mt-auto py-2 px-6 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold w-full">
                  Beli
                </button>
              </div>
            </div>
          </div>
          <div className="flex  flex-col items-center justify-center bg-whte py-10 gap-10 px-10">
            <h1 className="text-3xl text-black font-bold">Mentor Kami</h1>
            <div className="flex flex-col md:flex-row justify-center items-center gap-52 border-2 border-gray-200 rounded-xl p-14 w-full max-w-full mx-auto bg-white">
              <Image
                src="/images/ctokurniawan.png"
                alt="Mentor Master Kurniawan"
                width={340}
                height={380}
                className="object-fit rounded-2xl aspect-square"
              />
              <div className="flex-1 flex flex-col items-center md:items-start justify-center h-full px-8 text-center md:text-left">
                <h2 className="text-2xl text-black font-bold mb-4">
                  Master Kurniawan
                </h2>
                <p className="text-black text-lg leading-relaxed">
                  Kurniawan adalah seorang intelektual dan ahli IT Security, penetration testing, software engineering, dan cloud architecture dengan pengalaman lebih dari 29 tahun di dunia komputer dan 24 tahun di bidang hacking & cyber security. Ia telah menangani berbagai klien besar, termasuk Kementerian Pertahanan RI, Kominfo, KPK, ITB, Metro TV, Kimia Farma, Alterra, Mamikos.com, hingga klien internasional dari Malaysia, Timor Leste, dan Madagascar, serta aktif menjadi pembicara seminar, workshop, dan dosen tamu di berbagai universitas ternama di Indonesia.
                </p>
              </div>
            </div>
          </div>
          {/* Footer*/}
          <div>
            <Footer />
          </div>
        </div>
      </main>
    </div>
  );
}
