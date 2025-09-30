"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fetchAllOrders } from "@/utils/api";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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
      <h1 className="text-3xl font-bold text-gray-900">Transaksi</h1>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-700">Total Transaksi</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-gray-900">
            {stats.totalTransactions}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-gray-700">Total Nilai</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-gray-900">
            Rp {stats.totalAmount.toLocaleString("id-ID")}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-gray-700">Pertumbuhan</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center text-2xl font-bold">
            {stats.growth >= 0 ? (
              <ArrowUpRight className="text-green-500 mr-2" />
            ) : (
              <ArrowDownRight className="text-red-500 mr-2" />
            )}
            <span className="text-gray-900">{stats.growth}%</span>
          </CardContent>
        </Card>
      </div>

      {/* CHART */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-700">Tren Transaksi</CardTitle>
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
          <CardTitle className="text-gray-700">Transaksi Terbaru</CardTitle>
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
                <TableRow
                  key={order.id}
                  className="hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <TableCell className="text-gray-800">
                    {order.user?.name || "Unknown"}
                  </TableCell>
                  <TableCell className="text-gray-800">
                    Rp {order.totalAmount.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="text-gray-800">
                    <span className={`px-2 py-1 rounded-full text-sm ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
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
