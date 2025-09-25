"use client";
import { useState } from "react";

interface Course {
  id: number;
  title: string;
  mentor: string;
  description: string;
  videos: string[];
  thumbnail?: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [showModal, setShowModal] = useState(false);

  // form state
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [mentor, setMentor] = useState("");
  const [description, setDescription] = useState("");
  const [videos, setVideos] = useState<File[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  async function addCourse(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !mentor || !description || !price || !thumbnail) {
      alert("Semua input wajib diisi!");
      return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("mentor", mentor);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("thumbnail", thumbnail);

    // tambahin semua video
    videos.forEach((video, idx) => {
      formData.append(`video_${idx}`, video);
    });

    const res = await fetch("/api/admin/postClass", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();

    if (res.ok) {
      setCourses([...courses, data]);
      setShowModal(false);
      setTitle("");
      setMentor("");
      setDescription("");
      setVideos([]);
      setThumbnail(null);
    } else {
      alert(data.error || "Gagal menambah course");
    }
  }

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files; 
  if (files && files.length > 0) {
    setVideos((prev) => [...prev, ...Array.from(files)]);
  }
};


  // hapus video dari list
  function removeVideo(i: number) {
    setVideos((prev) => prev.filter((_, idx) => idx !== i));
  }

  // edit video (ganti dengan file baru)
  function editVideo(i: number) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "video/*";
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        setVideos((prev) =>
          prev.map((v, idx) => (idx === i ? file : v))
        );
      }
    };
    input.click();
  }

  return (
    <main className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-red-700">Daftar Courses</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-800"
        >
          + Tambah Course
        </button>
      </div>

      {/* Cards mirip dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
{courses.length === 0 ? (
  <p className="text-gray-600">Belum ada course ditambahkan.</p>
) : (
  courses.map((c) => (
    <div
      key={c.id}
      className="bg-white shadow-lg hover:shadow-xl rounded-2xl overflow-hidden transition transform hover:-translate-y-1"
    >
      {/* Thumbnail */}
      <div className="relative h-40 bg-gray-200">
        <img
          src={c.thumbnail || "/default-thumb.jpg"}
          alt={c.title}
          className="w-full h-full object-cover"
        />
        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md">
          New
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-gray-800">{c.title}</h3>
        <p className="text-sm text-gray-500">👨‍🏫 {c.mentor}</p>
        <p className="text-gray-600 text-sm line-clamp-2">{c.description}</p>

        {/* Action */}
        <div className="mt-3 flex justify-between items-center">
          <button className="bg-red-500 text-white text-sm px-3 py-1 rounded-lg hover:bg-red-600 transition">
            Detail
          </button>
          <span className="text-gray-500 text-xs">{c.videos.length} Video</span>
        </div>
      </div>
    </div>
  ))
)}

      </div>

     {/* Modal Tambah Course */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-50 flex justify-center items-center z-50">
          {/* wrapper biar bisa scroll */}
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <form
              onSubmit={addCourse}
              className="flex flex-col gap-4 bg-white p-6 rounded-2xl shadow-lg"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Upload Kelas Baru
              </h2>

              {/* Upload Thumbnail */}
              <div
                className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-red-400 transition"
                onClick={() =>
                  document.getElementById("thumbnail-upload")?.click()
                }
              >
                <input
                  id="thumbnail-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    setThumbnail(e.target.files ? e.target.files[0] : null)
                  }
                />
                {thumbnail ? (
                  <div className="text-sm text-gray-600">{thumbnail.name}</div>
                ) : (
                  <div className="text-gray-500 text-sm">
                    Drop your image here, or{" "}
                    <span className="text-red-500">browse</span>
                  </div>
                )}
              </div>

              {/* Judul */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-800 mb-1">Judul Kelas</label>
                <input
                  className="border border-gray-300 bg-white text-gray-800 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Masukkan judul kelas..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Mentor */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-800 mb-1">Mentor</label>
                <input
                  className="border border-gray-300 bg-white text-gray-800 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Nama mentor..."
                  value={mentor}
                  onChange={(e) => setMentor(e.target.value)}
                />
              </div>

              {/* Deskripsi */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-800 mb-1">Deskripsi</label>
                <textarea
                  rows={3}
                  className="border border-gray-300 bg-white text-gray-800 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Tuliskan deskripsi course..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Harga */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-800 mb-1">Harga</label>
                <input
                  type="number"
                  className="border border-gray-300 bg-white text-gray-800 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Masukkan harga course..."
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              {/* Daftar Video */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-800 mb-2">
                  Daftar Video Kelas
                </label>

                <input
                  type="file"
                  accept="video/*"
                  multiple
                  id="video-upload"
                  className="hidden"
                  onChange={handleVideoUpload}
                />
                <label
                  htmlFor="video-upload"
                  className="cursor-pointer flex items-center justify-center border border-gray-300 bg-gray-50 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
                >
                  + Tambah Video
                </label>

                {videos.length > 0 && (
                  <ul className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-1">
                    {videos.map((v, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between p-3 bg-gray-100 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full">
                            ▶
                          </span>
                          <div>
                            <p className="font-medium text-sm text-gray-800">
                              {i + 1}. {v.name}
                            </p>
                            <p className="text-xs text-gray-500">Durasi: -</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="text-red-500 hover:text-red-700 text-sm"
                            onClick={() => editVideo(i)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="text-red-500 hover:text-red-700 text-sm"
                            onClick={() => removeVideo(i)}
                          >
                            Hapus
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-red-500 hover:bg-red-700 transition-colors text-white px-6 py-2 rounded-lg font-medium"
                >
                  Simpan Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
