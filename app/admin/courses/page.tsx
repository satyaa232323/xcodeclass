"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar";
import Header from "@/components/Header";

interface Course {
  id: number;
  title: string;
  mentor: string;
  description: string;
  videos: string[];
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [showModal, setShowModal] = useState(false);

  // form state
  const [title, setTitle] = useState("");
  const [mentor, setMentor] = useState("");
  const [description, setDescription] = useState("");
  const [videos, setVideos] = useState<string[]>([]);

  function addCourse(e: React.FormEvent) {
    e.preventDefault();
    const newCourse: Course = {
      id: Date.now(),
      title,
      mentor,
      description,
      videos,
    };
    setCourses([...courses, newCourse]);

    // reset & close
    setTitle("");
    setMentor("");
    setDescription("");
    setVideos([]);
    setShowModal(false);
  }

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const videoUrl = URL.createObjectURL(file);
      setVideos([...videos, videoUrl]);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6">
        <Header title="Courses Dashboard" />

        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-600">Daftar Courses</h1>
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
                className="bg-white shadow rounded-xl p-4 flex flex-col gap-3"
              >
                <h3 className="text-lg font-semibold text-red-600">
                  {c.title}
                </h3>
                <p className="text-sm text-gray-600">Mentor: {c.mentor}</p>
                <p className="text-gray-600">{c.description}</p>
                <div className="flex overflow-x-auto gap-3 pb-2">
                  {c.videos.map((video, idx) => (
                    <video
                      key={idx}
                      controls
                      className="rounded-lg w-64 flex-shrink-0"
                    >
                      <source src={video} type="video/mp4" />
                    </video>
                  ))}
                </div>

              </div>
            ))
          )}
        </div>

        {/* Modal Tambah Course */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-200 bg-opacity-50 flex justify-center items-center z-50">
              <form
                onSubmit={addCourse}
                className="flex flex-col gap-4 bg-white p-6 rounded-2xl shadow-lg w-full max-w-lg mx-auto"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Tambah Course</h2>

                {/* Judul */}
                <div className="flex flex-col">
                  <label className="text-sm text-gray-800 mb-1">Judul Course</label>
                  <input
                    className="border border-gray-700 bg-white text-gray-800 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Masukkan judul course..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {/* Mentor */}
                <div className="flex flex-col">
                  <label className="text-sm text-gray-800 mb-1">Mentor</label>
                  <input
                    className="border border-gray-700 bg-white text-gray-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Nama mentor..."
                    value={mentor}
                    onChange={(e) => setMentor(e.target.value)}
                  />
                </div>

                {/* Deskripsi */}
                <div className="flex flex-col">
                  <label className="text-sm text-gray-800 mb-1">Deskripsi</label>
                  <textarea
                    rows={4}
                    className="border border-gray-700 bg-white text-gray-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Tuliskan deskripsi course..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* Input Video File Upload */}
                <div className="flex flex-col">
                  <label className="block text-sm text-gray-800 mb-2">
                    Upload Video (bisa lebih dari 1)
                  </label>

                  {/* hidden input */}
                  <input
                    type="file"
                    accept="video/*"
                    multiple
                    id="video-upload"
                    className="hidden"
                    onChange={handleVideoUpload}
                  />

                  {/* custom button */}
                  <label
                    htmlFor="video-upload"
                    className="cursor-pointer bg-red-600 hover:bg-red-700 transition-colors text-white px-4 py-2 rounded-lg font-medium w-fit"
                  >
                    Pilih Video
                  </label>

                  {videos.length > 0 && (
                    <ul className="mt-3 space-y-1 text-sm text-gray-300">
                      {videos.map((v, i) => (
                        <li
                          key={i}
                          className="px-3 py-2 bg-gray-800 rounded-md border border-gray-700"
                        >
                          🎬 Video {i + 1}
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
                    className="px-4 py-2 rounded-lg border border-gray-600 text-gray-800 hover:bg-gray-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 transition-colors text-white px-4 py-2 rounded-lg font-medium"
                  >
                    Simpan
                  </button>
                </div>
              </form>
          </div>
        )}
      </main>
    </div>
  );
}
