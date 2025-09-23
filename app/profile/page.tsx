"use client";
import { verifyJWT } from "@/lib/auth";
import { verifyAuth } from "@/lib/authMiddleware";
import { myClasses, Userprofile } from "@/utils/api";
import Image from "next/image";
import Link from "next/link";
import { NextRequest } from "next/server";
import { useEffect, useState } from "react";

export default function ProfilePage(req: NextRequest) {

  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchMyClasses = async () => {
      setIsLoading(true);

      const token = localStorage.getItem("token") || "";
      setToken(token);
      try {

        const response = await myClasses(token);
        setClasses(response.data);
      } catch (err) {
        setError("Gagal memuat kelas. Silakan coba lagi.");
      } finally {
        setIsLoading(false);
      }
    };

    const me = async () => {
      const token = localStorage.getItem("token") || "";
      try {
        const response = await Userprofile(token);
        setUser(response);

      } catch (err) {
        setError("Gagal memuat user. Silakan coba lagi.");
      }
    }

    fetchMyClasses();
    me();
  }, []);

  return (
    <div className="flex p-4 gap-4 flex-col">
      {/* Profile header */}
      <div className="flex flex-col items-center mb-10">
        <div className="w-40 h-40 rounded-full bg-red-500 flex items-center justify-center text-white text-4xl font-bold mb-2">
          {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
        </div>
        <div className="text-2xl font-bold text-gray-800">{user?.name}</div>
      </div>

      {/* Classes section */}
      <div className="flex flex-col items-start w-full">
        <h1 className="text-black font-bold text-xl">Kelas Yang Kamu Ikuti</h1>

        {/* Kondisi Loading */}
        {isLoading && (
          <div className="flex flex-col gap-4 w-full mt-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="animate-pulse bg-white p-6 rounded-xl shadow-sm border border-gray-300"
              >
                <div className="h-4 bg-gray-200 mb-2 rounded"></div>
                <div className="h-3 bg-gray-200 mb-4 rounded"></div>
                <div className="flex space-x-2">
                  <div className="h-8 w-20 bg-gray-200 rounded"></div>
                  <div className="h-8 w-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Kondisi Error */}
        {error && !isLoading && (
          <div className="mt-4 text-red-600 font-semibold">{error}</div>
        )}

        {/* Kondisi Kosong */}
        {!isLoading && !error && classes.length === 0 && (
          <div className="mt-4 text-gray-600">
            Kamu belum mengikuti kelas apapun.
          </div>
        )}

        {/* Kondisi Ada Data */}
        {!isLoading && !error && classes.length > 0 && (
          <div className="flex flex-col gap-4 max-h-none md:max-h-[420px] overflow-y-auto no-scrollbar w-full pr-2 mt-2 rounded-2xl">
            {classes.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row bg-white rounded-2xl shadow-lg border border-gray-200 min-h-[220px] w-full overflow-hidden"
              >
                <div className="h-48 sm:h-full sm:w-1/3 min-w-[220px] max-w-[340px] flex-shrink-0">
                  <div className="relative w-full h-full min-h-[220px]">
                    <Image
                      src={item.thumbnailUrl || "/images/thumbnail.png"}
                      alt="Kelas"
                      fill
                      className="object-cover object-center rounded-t-xl sm:rounded-tl-xl sm:rounded-bl-xl sm:rounded-tr-none"
                      sizes="(max-width: 768px) 100vw, 240px"
                    />
                  </div>
                </div>

                <div className="flex flex-col flex-1 justify-center p-8 text-center sm:text-left">
                  <div className="font-bold text-2xl text-black mb-2">
                    {item.title}
                  </div>
                  <div className="text-base text-gray-600 mb-4">
                    {item.description}
                  </div>
                  <Link
                    href={`/class/${item.id}?token=${encodeURIComponent(token)}`}
                  >
                    <button className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition w-max mx-auto sm:mx-0 text-base font-bold">
                      Lanjutkan Belajar
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}