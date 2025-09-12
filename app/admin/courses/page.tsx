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
          <div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-red-500 p-6 rounded-lg shadow-lg w-full max-w-lg">
              <h2 className="text-xl font-bold mb-4 text-white">
                Tambah Course Baru
              </h2>
              <form onSubmit={addCourse} className="flex flex-col gap-3">
                <input
                  className="border p-2 rounded"
                  placeholder="Judul Course"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <input
                  className="border p-2 rounded"
                  placeholder="Mentor"
                  value={mentor}
                  onChange={(e) => setMentor(e.target.value)}
                />
                <textarea
                  className="border p-2 rounded"
                  placeholder="Deskripsi"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                {/* Input Video File Upload */}
                <div>
                  <label className="block text-white mb-2">
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
                    className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded inline-block"
                  >
                    Pilih Video
                  </label>

                  <ul className="mt-2 text-sm text-gray-200">
                    {videos.map((v, i) => (
                      <li key={i}>Video {i + 1}</li>
                    ))}
                  </ul>
                </div>


                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded border text-white"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
