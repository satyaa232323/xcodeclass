"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  createClass,
  updateClass,
  deleteClass,
  fetchAllClasses,
  uploadImageToCloudinary,
  uploadVideoToCloudinary,
} from "@/utils/api";
import { PencilIcon, TrashIcon } from "lucide-react";


// ===================== TYPES =====================
interface Video {
  id?: string;
  title: string;
  videoUrl: string;
  file?: File;
  duration: number;
  order: number;
  thumbnailUrl?: string;
  originalUrl?: string;  // Store original URL when editing
}

interface Class {
  id: string;
  title: string;
  description: string | null;
  price: number;
  thumbnailUrl: string;
  mentor: string;
  mentorProfileUrl?: string;
  videos: Video[];
}

// ===================== MAIN COMPONENT =====================
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
  const [mentorProfileUrl, setMentorProfileUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);


  // Edit states
  const [editingId, setEditingId] = useState<string | null>(null);

  // Upload states
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingVideos, setUploadingVideos] = useState<Record<number, boolean>>({});
  const [submitting, setSubmitting] = useState(false);

  // ===================== FETCH DATA =====================
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/auth/login");

      const response = await fetchAllClasses(token);
      setClasses(response.data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // ===================== HANDLE SUBMIT =====================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/auth/login");

      // Upload thumbnail if file is provided
      let finalThumbnailUrl = thumbnailUrl;
      if (thumbnailFile) {
        setUploadingThumbnail(true);
        try {
          const uploadResult = await uploadImageToCloudinary(token, thumbnailFile);
          finalThumbnailUrl = uploadResult.secure_url;
        } catch (error) {
          console.error('Error uploading thumbnail:', error);
          setError('Failed to upload thumbnail');
          return;
        } finally {
          setUploadingThumbnail(false);
        }
      }

      // Process videos
      const processedVideos = [];
      for (let i = 0; i < videos.length; i++) {
        const video = videos[i];
        setUploadingVideos(prev => ({ ...prev, [i]: true }));

        try {
          if (video.file) {
            const uploadResult = await uploadVideoToCloudinary(token, video.file);
            if (!uploadResult.secure_url) {
              throw new Error("Failed to upload video");
            }

            processedVideos.push({
              title: video.title,
              videoUrl: uploadResult.secure_url,
              thumbnailUrl: finalThumbnailUrl, // Use the same thumbnail as the course
              duration: uploadResult.duration, // Use duration from Cloudinary
              order: i + 1
            });
          } else if (video.videoUrl) {
            // If we already have a video URL (editing case)
            processedVideos.push({
              title: video.title,
              videoUrl: video.videoUrl,
              thumbnailUrl: video.thumbnailUrl || finalThumbnailUrl,
              duration: video.duration,
              order: i + 1
            });
          }
        } catch (error) {
          console.error(`Error processing video ${i + 1}:`, error);
          setError(`Failed to process video ${i + 1}`);
          return;
        } finally {
          setUploadingVideos(prev => ({ ...prev, [i]: false }));
        }
      }

      // Create the class data object with videos
      const classData = {
        title,
        description,
        price: Number(price),
        thumbnailUrl: finalThumbnailUrl,
        mentor,
        mentorProfileUrl,
        videos: processedVideos
      };

      if (editingId) {
        // Update existing class
        await updateClass(token, editingId, classData);
      } else {
        // Create new class
        await createClass(token, classData);
      }

      await fetchClasses();
      resetForm();
      setShowModal(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ===================== HANDLE DELETE =====================
  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/auth/login");

      const response = await deleteClass(token, id);

      fetchClasses();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // ===================== HELPERS =====================
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPrice("");
    setMentor("");
    setThumbnailUrl("");
    setThumbnailFile(null);
    setVideos([]);
    setEditingId(null);
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

  const updateVideo = (index: number, field: keyof Video, value: string | number | File) => {
    const newVideos = [...videos];
    newVideos[index] = { ...newVideos[index], [field]: value };
    setVideos(newVideos);
  };

  const removeVideo = (index: number) => {
    const newVideos = videos.filter((_, i) => i !== index);
    setVideos(newVideos);
  };

  const handleEditClick = (course: Class) => {
    setEditingId(course.id);
    setTitle(course.title);
    setDescription(course.description || "");
    setPrice(course.price.toString());
    setMentor(course.mentor);
    setMentorProfileUrl(course.mentorProfileUrl || "");
    setThumbnailUrl(course.thumbnailUrl);
    setShowModal(true);
  };

  // ===================== RENDER =====================
  if (loading) return <div>Loading...</div>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold text-red-700">Courses Management</h1>
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
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleEditClick(course)}
                className="p-2 rounded hover:bg-gray-100"
              >
                <PencilIcon />
              </button>
              <button
                onClick={() => handleDelete(course.id)}
                className="p-2 rounded hover:bg-gray-100"
              >
                <TrashIcon />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Edit Course" : "Add New Course"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-black">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="w-full border p-2 rounded"
                required
              />


              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price"
                className="w-full border p-2 rounded"
                required
              />

              {/* Thumbnail Upload */}
              <div>
                <label className="block mb-1 font-medium">Thumbnail</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                  className="w-full border p-2 rounded"
                />
                {uploadingThumbnail && <p className="text-blue-500 text-sm mt-1">Uploading thumbnail...</p>}
                {thumbnailUrl && (
                  <img src={thumbnailUrl} alt="Thumbnail preview" className="mt-2 w-32 h-32 object-cover rounded" />
                )}
                <input
                  type="url"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="Or paste thumbnail URL"
                  className="w-full border p-2 rounded mt-2"
                />
              </div>

              <input
                type="text"
                value={mentor}
                onChange={(e) => setMentor(e.target.value)}
                placeholder="Mentor"
                className="w-full border p-2 rounded"
                required
              />

              <input
                type="file"
                accept="image/*"
                value={mentorProfileUrl}
                onChange={(e) => setMentorProfileUrl(e.target.value)}
                placeholder="Mentor"
                className="w-full border p-2 rounded"
                required
              />

              {/* Videos */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="font-bold">Videos</label>
                  <button
                    type="button"
                    onClick={addVideo}
                    className="text-blue-500 hover:underline"
                  >
                    + Add Video
                  </button>
                </div>

                {videos.map((video, index) => (
                  <div key={index} className="space-y-2 mb-4 p-4 border rounded bg-gray-50">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Video {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeVideo(index)}
                        className="text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="Video Title"
                      value={video.title}
                      onChange={(e) => updateVideo(index, "title", e.target.value)}
                      className="w-full border p-2 rounded"
                      required
                    />

                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => updateVideo(index, "file", e.target.files?.[0] || new File([], ""))}
                      className="w-full border p-2 rounded"
                      required
                    />

                    {uploadingVideos[index] && (
                      <p className="text-blue-500 text-sm">Uploading video...</p>
                    )}

                    {video.videoUrl && (
                      <video src={video.videoUrl} controls className="w-full h-32 rounded" />
                    )}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                  disabled={submitting || uploadingThumbnail || Object.values(uploadingVideos).some(Boolean)}
                >
                  {submitting ? "Saving..." : "Save Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

