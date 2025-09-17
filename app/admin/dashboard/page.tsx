import CourseCard from "@/components/Coursecard";

export default function DashboardPage() {
  const courses = [
    {
      id: 1,
      title: "Next.js for Beginners",
      mentor: "Muhammad Ridho Saj'da",
      description:
        "Belajar dasar-dasar Next.js dari nol sampai bisa bikin project.",
      videos: ["/videos/next1.mp4", "/videos/next2.mp4"],
    },
    {
      id: 2,
      title: "UI/UX Design Fundamentals",
      mentor: "Casandra Putri",
      description:
        "Dasar-dasar desain UI/UX untuk membuat aplikasi lebih menarik.",
      videos: ["/videos/uiux1.mp4"],
    },
  ];

  return (
    <main className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </main>
  );
}
