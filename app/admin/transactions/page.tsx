"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fetchAllOrders } from "@/utils/api";
import { ArrowUpRight, ArrowDownRight, CreditCard, Receipt, BarChart3 } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

export default function TransactionsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }

        const response = await fetchAllOrders(token);
        setOrders(response.data || []); // fallback array kosong
      } catch (err: any) {
        setError("Failed to fetch transactions");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // 📊 Hitung statistik
  const stats = useMemo(() => ({
    totalTransactions: orders.length,
    totalAmount: orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
    growth: 8.5, // contoh static
  }), [orders]);

  // 📊 Data chart bulanan
  const chartData = useMemo(() => {
    const monthlyData: Record<string, number> = {};

    orders.forEach(order => {
      if (!order.createdAt) return;
      const date = new Date(order.createdAt);
      if (isNaN(date.getTime())) return;

      const monthYear = date.toLocaleString("id-ID", {
        month: "short",
        year: "2-digit",
      });

      monthlyData[monthYear] = (monthlyData[monthYear] || 0) + (order.totalAmount || 0);
    });

    // urutkan berdasarkan bulan (optional)
    return Object.entries(monthlyData).map(([month, amount]) => ({
      month,
      amount,
    }));
  }, [orders]);

  // 📋 Transaksi terbaru
  const recentTransactions = useMemo(() =>
    [...orders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5),
    [orders]
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <h1 className="text-3xl font-bold text-gray-900">Transaksi</h1>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Transaksi */}
      <div className="flex items-center bg-blue-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
        <div className="flex items-center justify-center bg-blue-100 text-blue-600 w-12 h-12 rounded-full mr-4">
          <Receipt size={24} />
        </div>
        <div>
          <h3 className="text-sm text-gray-600">Total Transaksi</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.totalTransactions}</p>
        </div>
      </div>

      {/* Total Nilai */}
      <div className="flex items-center bg-green-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
        <div className="flex items-center justify-center bg-green-100 text-green-600 w-12 h-12 rounded-full mr-4">
          <CreditCard size={24} />
        </div>
        <div>
          <h3 className="text-sm text-gray-600">Total Nilai</h3>
          <p className="text-2xl font-bold text-green-600">
            Rp {stats.totalAmount.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      {/* Rata-rata Transaksi */}
      <div className="flex items-center bg-purple-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
        <div className="flex items-center justify-center bg-purple-100 text-purple-600 w-12 h-12 rounded-full mr-4">
          <BarChart3 size={24} />
        </div>
        <div>
          <h3 className="text-sm text-gray-600">Rata-rata Transaksi</h3>
          <p className="text-2xl font-bold text-purple-600">
            Rp{" "}
            {Math.round(
              stats.totalAmount / (stats.totalTransactions || 1)
            ).toLocaleString("id-ID")}
          </p>
        </div>
      </div>
    </div>

      {/* CHART */}
      <Card>
        <CardHeader>
          <CardTitle className="text-red-800">Tren Transaksi</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis
                stroke="#6b7280"
                tickFormatter={(value) =>
                  `Rp ${value >= 1_000_000 ? value / 1_000_000 + " jt" : value}`
                }
              />
              <Tooltip
                formatter={(value: any) => `Rp ${Number(value).toLocaleString("id-ID")}`}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle className="text-red-800">Transaksi Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-600">Nama Klien</TableHead>
                <TableHead className="text-gray-600">Jumlah</TableHead>
                <TableHead className="text-gray-600">Status</TableHead>
                <TableHead className="text-gray-600">Tanggal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((order) => (
                <TableRow key={order.id} className="hover:bg-gray-100 transition-colors cursor-pointer">
                <TableCell className="text-gray-800 font-medium">
                  {order.user?.name || "Unknown"}
                </TableCell>
                <TableCell className="text-gray-800">
                  Rp {order.totalAmount.toLocaleString("id-ID")}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      order.status === "COMPLETED"
                        ? "bg-green-100 text-green-800"
                        : order.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </TableCell>
                <TableCell className="text-gray-800">
                  {new Date(order.createdAt).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </TableCell>
              </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-gray-700">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center text-2xl font-bold text-gray-900">
        {icon} {value}
      </CardContent>
    </Card>
  );
}
