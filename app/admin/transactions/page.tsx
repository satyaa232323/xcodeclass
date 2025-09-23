"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

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
                    `Rp ${value >= 1000000 ? value / 1000000 + " jt" : value}`
                }
                />
                <Tooltip
                formatter={(value) => `Rp ${Number(value).toLocaleString("id-ID")}`}
                />
                <Line
                type="monotone"
                dataKey="amount"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ r: 5 }}
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
                <TableHead className="text-gray-600">Tanggal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow
                  key={tx.id}
                  className="hover:bg-gray-100 transition-colors cursor-pointer"
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
    </div>
  );
}
