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
  const [videoInput, setVideoInput] = useState("");
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
    setVideoInput("");
    setShowModal(false);
  }

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
            className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800"
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
                className="bg-red-900 shadow rounded-xl p-4 flex flex-col gap-3"
              >
                <h3 className="text-lg font-semibold text-white-600">
                  {c.title}
                </h3>
                <p className="text-sm text-white-600">Mentor: {c.mentor}</p>
                <p className="text-white-700">{c.description}</p>
                <div className="flex flex-col gap-2">
                  {c.videos.map((video, idx) => (
                    <video key={idx} controls className="rounded-lg">
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
          <div className="fixed inset-0 bg-white bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-red-900 p-6 rounded-lg shadow-lg w-full max-w-lg">
              <h2 className="text-xl font-bold mb-4">Tambah Course Baru</h2>
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

                {/* Input Video */}
                <div>
                  <div className="flex gap-2">
                    <input
                      className="border p-2 flex-1 rounded"
                      placeholder="Video URL"
                      value={videoInput}
                      onChange={(e) => setVideoInput(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (videoInput.trim() !== "") {
                          setVideos([...videos, videoInput]);
                          setVideoInput("");
                        }
                      }}
                      className="bg-blue-500 text-white px-4 rounded"
                    >
                      Add
                    </button>
                  </div>
                  <ul className="mt-2 text-sm text-gray-700">
                    {videos.map((v, i) => (
                      <li key={i}>{v}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded border"
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
