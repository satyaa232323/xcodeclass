"use client";
import { Wallet, Receipt, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { fetchAllClasses, fetchAllOrders } from "@/utils/api";
import Link from "next/link";

export default function DashboardPage() {

  const [recentTransactions, setRecentTransactions] = useState<Order[]>([]);
  const [recentCourses, setRecentCourses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    try {
      const fetchData = async () => {
        setLoading(true);

        const token = localStorage.getItem("token");
        if (!token) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }

        // fetch recent transactions & courses
        const recentTransactions = await fetchAllOrders(token);
        setRecentTransactions(recentTransactions.data || []);

        const recentCourses = await fetchAllClasses(token);

        setRecentCourses(recentCourses.data || []);
        setLoading(false);
        setError("");
      };
      fetchData();
    } catch (err: any) {
      console.error("Failed to fetch dashboard data:", err);
      setError(err.message || "Unknown error");
    }
  }, [])

  function totalAmount(){
    return recentTransactions.reduce((total, transaction) => total + transaction.totalAmount, 0);
  }
  return (
    <div className="p-6 space-y-6 h-screen overflow-y-auto custom-scroll">
      {/* Summary Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.2 },
          },
        }}
      >
        {/* Card 1 */}
        <motion.div
          className="bg-white p-6 rounded-xl shadow flex items-center gap-4"
          variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
        >
          <div className="p-3 bg-green-100 rounded-full">
            <Wallet className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-gray-500">Income Bulan Ini</h3>
            <p className="text-2xl font-bold text-green-600">{totalAmount().toLocaleString("id-ID")}</p>
          </div>
        </motion.div>

        {/* Card 2 */}
        <motion.div
          className="bg-white p-6 rounded-xl shadow flex items-center gap-4"
          variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
        >
          <div className="p-3 bg-blue-100 rounded-full">
            <Receipt className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-gray-500">Total Transaksi</h3>
            {recentTransactions.length > 0 ? (
              <p className="text-2xl font-bold text-blue-600">{recentTransactions.length}</p>
            ) : (
              <p className="text-gray-500">0</p>
            )}
          </div>
        </motion.div>

        {/* Card 3 */}
        <motion.div
          className="bg-white p-6 rounded-xl shadow flex items-center gap-4"
          variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
        >
          <div className="p-3 bg-red-100 rounded-full">
            <BookOpen className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-gray-500">Total Courses</h3>
            {recentCourses.length > 0 ? (
              <p className="text-2xl font-bold text-red-600">{recentCourses.length}</p>
            ) : (
              <p className="text-gray-500">0</p>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div
        className="bg-white p-6 rounded-xl shadow"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-red-800 text-lg">Recent Transactions</h3>
          <Link href={'/admin/transactions'} className="text-sm text-blue-500 hover:underline">View All</Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left" >
            <thead>
              <tr className="text-gray-500 text-sm border-b">
                <th className="py-3 px-2">Nama</th>
                <th className="py-3 px-2">Kelas</th>
                <th className="py-3 px-2">Nominal</th>
                <th className="py-3 px-2">Tanggal</th>
              </tr>
            </thead>
            {recentTransactions.slice(0, 3).map((transaction) => (
              <tbody key={transaction.id}>
                <tr className="border-b hover:bg-gray-50 transition">
                  <td className="flex items-center gap-3 py-3 px-2">
                    <img
                      src="https://ui-avatars.com/api/?name=Muhammad+Ridho"
                      alt={transaction.user?.name || "User Avatar"}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <span className="font-semibold text-gray-800">{transaction.user?.name || "Someone"}</span>
                  </td>
                  <td className="py-3 px-2 text-gray-600">{transaction.orderItems.map((item) => item.classObj.title).join(", ")}</td>
                  <td className="py-3 px-2 text-gray-600">{transaction.totalAmount.toLocaleString("id-ID")}</td>
                  <td className="py-3 px-2 text-gray-500 text-sm">{transaction.createdAt}</td>
                </tr>

              </tbody>
            ))}
          </table>
          {recentTransactions.length === 0 && !loading && (
            <p className="text-gray-500 text-center py-6">Tidak ada transaksi terbaru</p>
          )}
        </div>
      </motion.div>

      {/* Recent Class Added */}
      <motion.div
        className="bg-white p-6 rounded-xl shadow"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-red-800 font-semibold text-lg">Recent Class Added</h3>
          <Link href="/admin/classes" className="text-sm text-blue-500 hover:underline">
            View All
          </Link>
        </div>

        {recentCourses && recentCourses.length > 0 ? (
          recentCourses
            .slice() // buat salinan supaya gak ubah array asli
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) // urutkan dari terbaru
            .slice(0, 2) // ambil 3 data paling baru
            .map((course) => (
              <ul className="space-y-3" key={course.id}>
                <li className="border-b pb-2">
                  <p className="text-gray-700 font-medium">{course.title}</p>
                  <span className="text-sm text-gray-500">
                    by {course.mentor} •{" "}
                    {new Date(course.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </li>
              </ul>
            ))
        ) : (
          <p className="text-gray-500 text-center py-6">Tidak ada course terbaru</p>
        )}
      </motion.div>
    </div>
  );
}
