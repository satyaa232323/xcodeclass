"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Wallet, BarChart3 } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { fetchAllOrders } from "@/utils/api";
import { Order } from "@/app/generated/prisma";

const stats = {
  totalTransactions: 120,
  totalAmount: 125000000,
  growth: 8.5,
};

const transactions = [
  { id: 1, client: "Byan Hacim", amount: 2500000, date: "2025-09-05" },
  { id: 2, client: "Rido Saja", amount: 3500000, date: "2025-09-07" },
  { id: 3, client: "Teguh Waardhani", amount: 1500000, date: "2025-09-08" },
];

const chartData = [
  { month: "Mei", amount: 40000000 },
  { month: "Jun", amount: 52000000 },
  { month: "Jul", amount: 60000000 },
  { month: "Agu", amount: 70000000 },
  { month: "Sep", amount: 65000000 },
];

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
        setOrders(response.data || []);
        setLoading(false);
      } catch (err: any) {
        setError("Failed to fetch transactions");
        console.log(err);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);


  // Process data for chart
  const chartData = useMemo(() => {
    const monthlyData: Record<string, number> = {};

    orders.forEach(order => {
      if (!order.createdAt) return;

      const date = new Date(order.createdAt);

      if (isNaN(date.getTime())) return;


      const monthYear = date.toLocaleString('id-ID', {
        month: 'short',
        year: '2-digit'
      });

      monthlyData[monthYear] = (monthlyData[monthYear] || 0) + order.totalAmount;
    });

    // Convert to array and sort by date
    return Object.entries(monthlyData).map(([month, amount]) => ({
      month,
      amount,
    }));
  }, [orders]);

  const growth = useMemo(() => {
    if (chartData.length < 2) return 0; // butuh minimal 2 bulan

    const last = chartData[chartData.length - 1].amount;
    const prev = chartData[chartData.length - 2].amount;

    if (prev === 0) return 100; // hindari pembagian nol

    return ((last - prev) / prev) * 100;
  }, [chartData]);


  // Calculate stats from real data
  const stats = useMemo(() => ({
    totalTransactions: orders.length,
    totalAmount: orders.reduce((sum, order) => sum + order.totalAmount, 0),
    growth: growth,  // use the calculated growth
  }), [orders]);




  // Get recent transactions
  const recentTransactions = useMemo(() =>
    [...orders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 4),
    [orders]
  );



  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <h1 className="text-3xl font-bold text-red-700">Transaksi</h1>

      {/* STATS */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.2 },
          },
        }}
      >
        {/* TOTAL NILAI */}
        <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}>
          <Card className="shadow-md hover:shadow-lg transition rounded-xl">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 rounded-full bg-green-100">
                <Wallet className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <p className="text-gray-600">Total Nilai</p>
                <p className="text-2xl font-bold text-green-600">
                  Rp {stats.totalAmount.toLocaleString("id-ID")}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* TOTAL TRANSAKSI */}
        <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}>
          <Card className="shadow-md hover:shadow-lg transition rounded-xl">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 rounded-full bg-blue-100">
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600">Total Transaksi</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.totalTransactions}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* PERTUMBUHAN */}
        <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}>
          <Card className="shadow-md hover:shadow-lg transition rounded-xl">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 rounded-full bg-purple-100">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-600">Pertumbuhan</p>
                <div className="flex items-center text-2xl font-bold">
                  {stats.growth >= 0 ? (
                    <ArrowUpRight className="text-green-500 mr-2" />
                  ) : (
                    <ArrowDownRight className="text-red-500 mr-2" />
                  )}
                  <span className="text-gray-900">{stats.growth}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* CHART */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        <Card className="shadow-md rounded-xl">
          <CardHeader>
            <CardTitle className="text-red-800">Tren Transaksi</CardTitle>
          </CardHeader>
          <CardContent className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis
                  stroke="#6b7280"
                  tickFormatter={(value) =>
                    `Rp ${value >= 1000000 ? value / 1000000 + " jt" : value}`
                  }
                />
                <Tooltip
                  formatter={(value) => `Rp ${Number(value).toLocaleString("id-ID")}`}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  fillOpacity={0.2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* TABLE */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
      >
        <Card className="shadow-md rounded-xl">
          <CardHeader>
            <CardTitle className="text-red-800">Transaksi Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="text-gray-600">Nama Klien</TableHead>
                  <TableHead className="text-gray-600">Jumlah</TableHead>
                  <TableHead className="text-gray-600">Tanggal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx, i) => (
                  <TableRow
                    key={tx.id}
                    className={`${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-gray-100 transition`}
                  >
                    <TableCell className="text-gray-800">{tx.client}</TableCell>
                    <TableCell className="text-gray-800">
                      Rp {tx.amount.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="text-gray-800">
                      {new Date(tx.date).toLocaleDateString("id-ID", {
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
      </motion.div>
    </div>
  );
}
