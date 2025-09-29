"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, Edit2, Trash2 } from "lucide-react";

interface Class {
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnailUrl: string;
  mentor: string;
  videos?: Video[];
}

interface Video {
  id?: string;
  title: string;
  duration: number;
  order: number;
  file?: File | null;
  thumbnail?: File | null;
}

export default function CoursesPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // modal flags
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // selected course (for edit/detail)
  const [selectedCourse, setSelectedCourse] = useState<Class | null>(null);

  // shared form state (will be reset when opening Add)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [mentor, setMentor] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }
      const res = await fetch("/api/admin/classes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch classes");
      const data = await res.json();
      setClasses(data.data || []);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPrice("");
    setMentor("");
    setThumbnailUrl("");
    setVideos([]);
    setSelectedCourse(null);
  };

  // Build FormData (used for add & edit)
  const buildFormData = () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("mentor", mentor);
    formData.append("thumbnailUrl", thumbnailUrl);

    videos.forEach((video, i) => {
      formData.append(`videos[${i}][title]`, video.title);
      formData.append(`videos[${i}][duration]`, String(video.duration));
      formData.append(`videos[${i}][order]`, String(video.order));
      if (video.file) formData.append(`videos[${i}][file]`, video.file);
      if (video.thumbnail) formData.append(`videos[${i}][thumbnail]`, video.thumbnail);
    });

    return formData;
  };

  // ADD
  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/auth/login");
      const formData = buildFormData();
      const res = await fetch("/api/admin/classes", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to create class");
      await fetchClasses();
      setShowAddModal(false);
      resetForm();
    } catch (err: any) {
      setError(err.message || "Add failed");
    }
  };

  // EDIT
  // ganti fungsi handleEditCourse yang sekarang dengan yang ini
const handleEditCourse = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!selectedCourse) return;

  try {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/auth/login");

    // buat FormData sekali (kita akan clone/rebuild jika perlu)
    let formData = buildFormData();

    // helper untuk membaca detail error dari response
    const readError = async (res: Response) => {
      const ct = res.headers.get("content-type") || "";
      try {
        if (ct.includes("application/json")) {
          const j = await res.json();
          return j?.message || JSON.stringify(j);
        } else {
          return await res.text();
        }
      } catch (err) {
        return `Status ${res.status}`;
      }
    };

    // coba PUT dulu
    let res = await fetch(`/api/admin/classes/${selectedCourse.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        // IMPORTANT: jangan set Content-Type di sini, biarkan browser handle boundary
      },
      body: formData,
    });

    // kalau PUT gagal karena metode/multipart tidak didukung, coba PATCH, lalu fallback POST dengan _method
    if (!res.ok && (res.status === 405 || res.status === 415 || res.status === 400)) {
      // coba PATCH (beberapa API terima PATCH)
      res = await fetch(`/api/admin/classes/${selectedCourse.id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
    }

    // fallback terakhir: POST + _method override (untuk server yang tidak menerima PUT multipart)
    if (!res.ok) {
      // rebuild formData (safety) and append override
      formData = buildFormData();
      formData.append("_method", "PUT");
      res = await fetch(`/api/admin/classes/${selectedCourse.id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
    }

    // jika masih gagal, baca detail error dan tampilkan
    if (!res.ok) {
      const detail = await readError(res);
      console.error("Update course failed:", res.status, detail);
      setError(typeof detail === "string" ? detail : JSON.stringify(detail));
      return;
    }

    // sukses
    await fetchClasses();
    setShowEditModal(false);
    // jangan clear selectedCourse sebelum sukses (kita pake resetForm setelah success)
    resetForm();
  } catch (err: any) {
    console.error("handleEditCourse error:", err);
    setError(err?.message || "Update failed (client)");
  }
};


  // DELETE (with modal)
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteCourseId, setDeleteCourseId] = useState<string | null>(null);

    const handleDeleteCourse = async () => {
      if (!deleteCourseId) return;
      try {
        const token = localStorage.getItem("token");
        if (!token) return router.push("/auth/login");
        const res = await fetch(`/api/admin/classes/${deleteCourseId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to delete class");
        await fetchClasses();
        setShowDeleteModal(false);
        setDeleteCourseId(null);
      } catch (err: any) {
        setError(err.message || "Delete failed");
      }
    };


  // helpers for videos
  const addVideo = () => {
    setVideos((prev) => [
      ...prev,
      { title: "", duration: 0, order: prev.length + 1, file: null, thumbnail: null },
    ]);
  };
  const updateVideo = (index: number, field: keyof Video, value: any) => {
    setVideos((prev) => {
      const copy = [...prev];
      (copy[index] as any)[field] = value;
      return copy;
    });
  };

  // OPEN add modal (reset form first to avoid carryover)
  const openAddModal = () => {
    resetForm();
    setShowEditModal(false);
    setShowDetailModal(false);
    setShowAddModal(true);
  };

  // OPEN edit modal (populate form with selected course)
  const openEditModal = (course: Class) => {
    setSelectedCourse(course);
    setTitle(course.title);
    setDescription(course.description);
    setPrice(String(course.price));
    setMentor(course.mentor);
    setThumbnailUrl(course.thumbnailUrl);
    setVideos(course.videos ? course.videos.map(v => ({ ...v, file: null, thumbnail: null })) : []);
    setShowAddModal(false);
    setShowDetailModal(false);
    setShowEditModal(true);
  };

  const openDetailModal = (course: Class) => {
    setSelectedCourse(course);
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDetailModal(true);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-700">Courses Management</h1>
        <button onClick={openAddModal} className="bg-red-500 text-white px-4 py-2 rounded">
          Add New Course
        </button>
      </div>

      {/* grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-600">
        {classes.map((course) => (
          <div key={course.id} className="bg-white p-4 rounded-lg shadow relative">
            <img src={course.thumbnailUrl} alt={course.title} className="w-full h-48 object-cover rounded mb-4" />
            <h3 className="font-bold text-lg mb-2">{course.title}</h3>
            <p className="text-gray-600 mb-2 line-clamp-2">{course.description}</p>
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold">Rp {course.price.toLocaleString()}</span>
              <span className="text-gray-500">{course.mentor}</span>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => openDetailModal(course)} className="p-2 text-gray-600 hover:text-gray-800">
                <Eye size={18} />
              </button>
              <button onClick={() => openEditModal(course)} className="p-2 text-blue-600 hover:text-blue-800">
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => {
                  setDeleteCourseId(course.id);
                  setShowDeleteModal(true);
                }}
                className="p-2 text-red-600 hover:text-red-800"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <CourseModal
          modalTitle="Add New Course"
          onClose={() => {
            setShowAddModal(false);
            resetForm();
          }}
          onSubmit={handleAddCourse}
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          price={price}
          setPrice={setPrice}
          mentor={mentor}
          setMentor={setMentor}
          thumbnailUrl={thumbnailUrl}
          setThumbnailUrl={setThumbnailUrl}
          videos={videos}
          addVideo={addVideo}
          updateVideo={updateVideo}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && selectedCourse && (
        <CourseModal
          modalTitle="Edit Course"
          onClose={() => {
            setShowEditModal(false);
            resetForm();
          }}
          onSubmit={handleEditCourse}
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          price={price}
          setPrice={setPrice}
          mentor={mentor}
          setMentor={setMentor}
          thumbnailUrl={thumbnailUrl}
          setThumbnailUrl={setThumbnailUrl}
          videos={videos}
          addVideo={addVideo}
          updateVideo={updateVideo}
        />
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedCourse && (
        <div className="fixed inset-0 bg-gray-800/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-gray-700 text-xl font-bold mb-4">{selectedCourse.title}</h2>
            <img src={selectedCourse.thumbnailUrl} alt={selectedCourse.title} className="w-full h-56 object-cover rounded mb-4" />
            <p className="mb-2 text-gray-700">{selectedCourse.description}</p>
            <p className="mb-2 text-gray-700 font-bold">Rp {selectedCourse.price.toLocaleString()}</p>
            <p className="mb-4 text-gray-600">Mentor: {selectedCourse.mentor}</p>

            <h3 className="text-gray-700 font-semibold mb-2">Videos</h3>
            <ul className="list-disc pl-5 space-y-1">
              {selectedCourse.videos && selectedCourse.videos.length > 0 ? (
                selectedCourse.videos.map((v, i) => (
                  <li key={i} className="text-sm text-gray-700">
                    {v.title} — {v.duration} min
                  </li>
                ))
              ) : (
                <p className="text-gray-500">No videos available.</p>
              )}
            </ul>

            <div className="flex justify-end mt-4">
              <button onClick={() => { setShowDetailModal(false); setSelectedCourse(null); }} className="px-5 py-2 border rounded-lg text-gray-600 hover:bg-gray-100">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-800/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-lg border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Confirm Delete</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this course? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteCourseId(null);
                }}
                className="px-5 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCourse}
                className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

/* Reusable Course Modal component */
interface CourseModalProps {
  modalTitle: string;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  setTitle: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  price: string;
  setPrice: (v: string) => void;
  mentor: string;
  setMentor: (v: string) => void;
  thumbnailUrl: string;
  setThumbnailUrl: (v: string) => void;
  videos: Video[];
  addVideo: () => void;
  updateVideo: (i: number, field: keyof Video, value: any) => void;
}

function CourseModal({
  modalTitle,
  onClose,
  onSubmit,
  title,
  setTitle,
  description,
  setDescription,
  price,
  setPrice,
  mentor,
  setMentor,
  thumbnailUrl,
  setThumbnailUrl,
  videos,
  addVideo,
  updateVideo,
}: CourseModalProps) {
  return (
    <div className="fixed inset-0 bg-gray-800/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-lg border border-gray-200">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-bold text-gray-800">{modalTitle}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <form onSubmit={onSubmit} className="p-6 max-h-[70vh] overflow-y-auto space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Masukkan judul course"
              className="text-gray-700 w-full border border-gray-300 p-3 rounded-lg" 
              required 
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Masukkan deskripsi course"
              className="text-gray-700 w-full border border-gray-300 p-3 rounded-lg" 
              rows={3} 
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Price</label>
              <input 
                type="number" 
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
                placeholder="Masukkan harga course"
                className="text-gray-700 w-full border border-gray-300 p-3 rounded-lg" 
                required 
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Mentor</label>
              <input 
                type="text" 
                value={mentor} 
                onChange={(e) => setMentor(e.target.value)} 
                placeholder="Masukkan nama mentor"
                className="text-gray-700 w-full border border-gray-300 p-3 rounded-lg" 
                required 
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Thumbnail URL</label>
            <input 
              type="url" 
              value={thumbnailUrl} 
              onChange={(e) => setThumbnailUrl(e.target.value)} 
              placeholder="Masukkan URL thumbnail"
              className="text-gray-700 w-full border border-gray-300 p-3 rounded-lg" 
              required 
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="font-semibold text-gray-700">Videos</label>
              <button type="button" onClick={addVideo} className="text-sm font-medium text-red-500">+ Add Video</button>
            </div>

            {videos.map((video, index) => (
              <div key={index} className="space-y-3 mb-4 p-4 border rounded-lg bg-gray-50">
                <input 
                  type="text" 
                  placeholder="Masukkan judul video" 
                  value={video.title} 
                  onChange={(e) => updateVideo(index, "title", e.target.value)} 
                  className="text-gray-700 w-full border border-gray-300 p-2 rounded" 
                  required 
                />

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Upload Video</label>
                  
                  <label className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg cursor-pointer hover:bg-red-600 w-fit">
                    <span>Pilih File</span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => updateVideo(index, "file", e.target.files ? e.target.files[0] : null)}
                      className="hidden"
                    />
                  </label>

                  {video.file && (
                    <video 
                      src={URL.createObjectURL(video.file)} 
                      controls 
                      className="mt-3 rounded-lg w-full max-h-48 shadow-md border"
                    />
                  )}
                </div>


                <input 
                  type="number" 
                  placeholder="Masukkan durasi (menit)" 
                  value={video.duration === 0 ? "" : video.duration} 
                  onChange={(e) => updateVideo(index, "duration", Number(e.target.value))} 
                  className="text-gray-700 w-full border border-gray-300 p-2 rounded" 
                  required 
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 border-t pt-4">
            <button type="button" onClick={onClose} className="px-5 py-2 border rounded-lg text-gray-600 hover:bg-gray-100">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

