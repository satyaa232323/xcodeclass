"use client";

import Image from "next/image";

export default function ProfilePage() {
  return (
    <div className="flex p-4 gap-4 flex-col">
      <div className="flex flex-col items-center mb-10">
        <div className="w-40 h-40 rounded-full bg-red-500 flex items-center justify-center text-white text-4xl font-bold mb-2">
          AB
        </div>
        <div className="text-2xl font-bold text-gray-800">Andi Budi</div>
      </div>
      <div className="flex flex-col items-start">
        <h1 className="text-black font-bold text-xl">Kelas Yang Kamu Ikuti</h1>
        <div className="flex flex-col gap-4 max-h-none md:max-h-[420px] overflow-y-auto no-scrollbar w-full pr-2 mt-2 rounded-2xl">
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
                Deskripsi singkat kelas yang kamu ikuti akan tampil di sini.
              </div>
              <button className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition w-max mx-auto sm:mx-0 text-base font-bold">
                Lanjutkan Belajar
              </button>
            </div>
          </div>
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
                Deskripsi singkat kelas yang kamu ikuti akan tampil di sini.
              </div>
              <button className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition w-max mx-auto sm:mx-0 text-base font-bold">
                Lanjutkan Belajar
              </button>
            </div>
          </div>
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
                Deskripsi singkat kelas yang kamu ikuti akan tampil di sini.
              </div>
              <button className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition w-max mx-auto sm:mx-0 text-base font-bold">
                Lanjutkan Belajar
              </button>
            </div>
          </div>
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
                Deskripsi singkat kelas yang kamu ikuti akan tampil di sini.
              </div>
              <button className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition w-max mx-auto sm:mx-0 text-base font-bold">
                Lanjutkan Belajar
              </button>
            </div>
          </div>
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
                Deskripsi singkat kelas yang kamu ikuti akan tampil di sini.
              </div>
              <button className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition w-max mx-auto sm:mx-0 text-base font-bold">
                Lanjutkan Belajar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
