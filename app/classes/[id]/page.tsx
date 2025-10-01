"use client";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Image from "next/image";
import XLoading from "@/components/LoadingEffect";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  createOrder,
  fetchClassDetails,
  fetchClasses,
  myClasses,
} from "@/utils/api";

export default function DetailClass() {
  const { id } = useParams();
  const router = useRouter();
  const [detailClass, setDetailClass] = useState<DetailClass | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchClassDetails(id as string);
        setDetailClass(response?.data);

        const all = await fetchClasses();
        setFilteredClasses(all?.data || []);
      } catch (err) {
        setError("Gagal memuat data");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <XLoading size={120} />
      </div>
    );
  }

  if (error || !detailClass) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>{error || "Data tidak ditemukan"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-10 flex flex-col gap-2">
        {/* Bagian Atas */}
        <Link
          href="/"
          className="relative text-gray-500 text-xl font-semibold mb-4 pl-6 hover:text-gray-700 transition before:content-['←'] before:absolute before:left-0"
        >
          Kembali
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Kiri: Thumbnail + Course Content */}
          <div className="col-span-2 flex flex-col gap-6">
            {/* Thumbnail */}
            <div className="bg-white shadow rounded-lg p-4 border">
              <Image
                src={detailClass.thumbnailUrl}
                alt="Thumbnail Class"
                width={800}
                height={500}
                className="rounded-xl object-cover w-full h-auto"
              />
              <div className="mt-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {detailClass.title}
                </h1>
                <p className="text-gray-600">{detailClass.description}</p>
                <div className="flex gap-6 text-sm text-gray-500 mt-2">
                  <span>📹 {detailClass.videos.length} Videos</span>
                  <span>⏱ {detailClass.videos.length * 5} minutes</span>
                </div>
              </div>
            </div>

            {/* Course Content */}
            <div className="bg-white shadow rounded-lg p-6 border flex-1">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Course Content
              </h2>
              <div className="flex flex-col gap-3">
                {detailClass.videos.map((video, idx) => (
                  <div
                    key={video.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-red-500">🎬</span>
                      <p className="font-medium text-black">Part {idx + 1}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Kanan: Card Price + Mentor + Rekomendasi */}
          <div className="flex flex-col gap-6">
            {/* Mentor Card */}
            <div className="bg-white shadow rounded-lg p-4 border">
              <h2 className="text-lg font-bold text-gray-700">Mentor</h2>
              <div className="flex items-center mt-2 gap-3">
                <Image
                  src="/images/avatar.png"
                  alt="Mentor"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <p className="font-bold text-black">{detailClass.mentor}</p>
                  <p className="text-sm text-gray-700">Course Instructor</p>
                </div>
              </div>
            </div>

            {/* Price Card */}
            <div className="bg-white shadow rounded-lg p-4 border">
              <h2 className="text-lg font-bold text-gray-700">
                Price Information
              </h2>
              <p className="text-red-600 font-bold text-xl mt-2">
                Rp {detailClass.price.toLocaleString("id-ID")}
              </p>
              <button className="mt-4 w-full py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                Beli
              </button>
            </div>

            {/* Rekomendasi Kelas */}
            <div className="p-4 ">
              <h2 className="text-lg font-bold text-gray-700 mb-4">
                Rekomendasi Kelas
              </h2>
              <div className="grid gap-4 grid-cols-1 ">
                {filteredClasses.slice(0, 2).map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col bg-white text-black border-gray-200 border rounded-xl overflow-hidden shadow-md"
                  >
                    <Image
                      src={item.thumbnailUrl || `/images/foto_vid.png`}
                      alt="Thumbnail Video"
                      width={400}
                      height={220}
                      className="object-cover w-full h-auto"
                    />
                    <div className="flex flex-col flex-1 p-2 gap-2">
                      <h2 className="font-bold text-lg line-clamp-1">
                        {item.title}
                      </h2>
                      <span className="font-bold text-sm">
                        Rp {item.price.toLocaleString("id-ID")}
                      </span>
                      <Link key={item.id} href={`/classes/${item.id}`}>
                        <button className="mt-4 w-full py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                          Lihat
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}
