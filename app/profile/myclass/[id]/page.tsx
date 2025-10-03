"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { fetchMyClassVideos } from "@/utils/api";
import Link from "next/link";

export default function IsiVideoPage() {
  const { id } = useParams();
  const [classData, setClassData] = useState<UserClassVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const token = localStorage.getItem("token") || "";
        if (!token) {
          setError("Silakan login untuk mengakses kelas ini.");
          setLoading(false);
          return;
        }

        const response = await fetchMyClassVideos(token, id as string);
        setClassData(response.data);
        console.log("Fetched class videos:", response);
        // Set initial selected video to first video in list
        if (response.data?.classObj?.videos?.length > 0) {
          setSelectedVideo(response.data.classObj.videos[0]);
        }
      } catch (err) {
        setError("Gagal memuat video. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col h-screen">
        <div className="flex items-center justify-center flex-1">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen">
        <div className="flex items-center justify-center flex-1 text-red-500">{error}</div>
      </div>
    );
  }

  if (!classData?.classObj?.videos?.length || !selectedVideo) {
    return (
      <div className="flex flex-col h-screen">
        <div className="flex items-center justify-center flex-1">No videos available</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* NAVBAR */}

      {/* CONTENT */}
      <div className="flex flex-1 flex-col md:flex-row">
        {/* MAIN VIDEO SECTION */}
        <main className="flex-1 bg-white p-4 sm:p-6 overflow-y-auto flex flex-col items-center">
          <div className="w-full max-w-5xl">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-black">
              {selectedVideo.title}
            </h2>

            {/* Video player selalu 16:9 */}
            <div className="relative w-full mb-4 aspect-video bg-black rounded-lg overflow-hidden">
              {!playing ? (
                <div
                  className="relative w-full h-full cursor-pointer"
                  onClick={() => setPlaying(true)}
                >
                  <Image
                    src={selectedVideo.thumbnailUrl || ""}
                    alt="Video Thumbnail"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-red-600 text-white rounded-full w-14 h-14 flex items-center justify-center">
                      ▶
                    </div>
                  </div>
                </div>
              ) : (
                <video
                  controls
                  autoPlay
                  className="w-full h-full object-cover"
                  src={selectedVideo.videoUrl || ""}
                />
              )}
            </div>

            <p className="text-base sm:text-lg mb-6 text-black">
              {classData.classObj.description}
            </p>

            {/* Info creator + laporkan */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
              <div className="flex items-center space-x-2">
                <Image
                  src={classData.classObj.mentorProfileUrl || "/images/profile.svg"}
                  alt="Avatar"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-black">{classData.classObj.mentor}</p>
                </div>
              </div>
              <p className="text-sm text-black">
                Ada masalah dengan video?{" "}
                <Link 
                href={"https://api.whatsapp.com/send/?phone=6285728917933&text&type=phone_number&app_absent=0"} 
                className="text-red-600 font-semibold cursor-pointer hover:text-red-900 ">
                  laporkan
                </Link>
              </p>
            </div>

            {/* Description */}
            <div className="bg-gray-200 p-4 sm:p-6 rounded-lg shadow w-full">
              <p className="text-sm sm:text-base leading-relaxed text-black">
                {classData.classObj.description}
              </p>
            </div>
          </div>
        </main>

        {/* SIDEBAR VIDEO LIST */}
        <aside className="bg-black-500 w-full md:w-1/4 p-4 md:p-9 space-y-4 md:space-y-8 overflow-y-auto">
          {classData.classObj.videos.map((video: Video, index: number) => (
            <div
              key={video.id}
              onClick={() => {
                setSelectedVideo(video);
                setPlaying(false); // reset biar muncul thumbnail dulu
              }}
              className={`bg-white rounded-lg overflow-hidden shadow cursor-pointer border-3 ${selectedVideo.id === video.id
                ? "border-gray-600"
                : "border-transparent"
                }`}
            >
              {/* Thumbnail sidebar juga 16:9 */}
              <div className="w-full aspect-video bg-black relative">
                <Image
                  src={video.thumbnailUrl || ""}
                  alt="Thumbnail"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-2">
                <h3 className="font-semibold text-xs sm:text-sm text-black line-clamp-2">
                  {video.title}
                </h3>
                <p className="text-[10px] sm:text-xs text-gray-500 line-clamp-2">
                  {video.title} - Part {index + 1}
                </p>
              </div>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}
