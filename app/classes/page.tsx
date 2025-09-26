"use client";

import Navbar from "@/components/navbar";
import { fetchClasses } from "@/utils/api";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchClasses();
        setClasses(res.data);
        setError("");
      } catch (err) {
        setError("Gagal memuat data kelas");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredClasses = classes.filter((item) =>
    item.title.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onSearchChange={setSearchKeyword} />
      <main className="flex flex-col items-center py-10 px-4 md:px-20 w-full">
        <h1 className="text-3xl font-bold text-black mb-4 text-center mt-15">
          Kelas Kami
        </h1>
        <p className="text-lg text-gray-700 mb-12 text-center max-w-2xl">
          Pilih kelas yang sesuai dengan minat dan kebutuhanmu. Semua kelas
          didesain untuk pembelajaran praktis dan siap kerja!
        </p>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full">
          {filteredClasses.slice(0, 4).map((item) => (
            <div
              key={item.id}
              className="flex flex-col bg-white text-black border-gray-200 border-2 rounded-xl overflow-hidden shadow-md"
            >
              <Image
                src={item.thumbnailUrl || "/images/foto_vid.png"}
                alt={`${item.title} Thumbnail`}
                width={400}
                height={220}
                className="object-cover w-full h-48"
              />
              <div className="flex flex-col flex-1 p-4 gap-2">
                <div>
                  <h2 className="font-bold text-lg mb-1">{item.title}</h2>
                  <p className="font-extralight text-sm mb-2 line-clamp-2">
                    {item.description}
                  </p>
                  <p className="text-sm text-gray-600">Mentor: {item.mentor}</p>
                </div>
                <span className="font-bold text-base mb-4">
                  Rp {item.price.toLocaleString("id-ID")}
                </span>
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
