import { Wallet, Receipt, BookOpen } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-full">
            <Wallet className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-gray-500">Income Bulan Ini</h3>
            <p className="text-2xl font-bold text-green-600">Rp 12.500.000</p>
            <span className="text-sm text-gray-400">+12% dibanding bulan lalu</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <Receipt className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-gray-500">Total Transaksi</h3>
            <p className="text-2xl font-bold text-blue-600">320</p>
            <span className="text-sm text-gray-400">+5% dibanding bulan lalu</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
          <div className="p-3 bg-red-100 rounded-full">
            <BookOpen className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-gray-500">Total Courses</h3>
            <p className="text-2xl font-bold text-red-600">25</p>
            <span className="text-sm text-gray-400">+2 courses baru bulan ini</span>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
     <div className="bg-white p-6 rounded-xl shadow">
  {/* Header */}
  <div className="flex justify-between items-center mb-4">
    <h3 className="font-semibold text-red-800 text-lg">Recent Transactions</h3>
    <button className="text-sm text-blue-500 hover:underline">View All</button>
  </div>

    {/* Table */}
      <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 text-sm border-b">
                <th className="py-3 px-2">Nama</th>
                <th className="py-3 px-2">Kelas</th>
                <th className="py-3 px-2">Nominal</th>
                <th className="py-3 px-2">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50 transition">
                <td className="flex items-center gap-3 py-3 px-2">
                  <img
                    src="https://ui-avatars.com/api/?name=Muhammad+Ridho"
                    alt="Muhammad Ridho"
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <span className="font-semibold text-gray-800">Muhammad Ridho</span>
                </td>
                <td className="py-3 px-2 text-gray-600">UI/UX Design</td>
                <td className="py-3 px-2 text-gray-600">Rp 250.000</td>
                <td className="py-3 px-2 text-gray-500 text-sm">17 Sept 2025</td>
              </tr>
              <tr className="border-b hover:bg-gray-50 transition">
                <td className="flex items-center gap-3 py-3 px-2">
                  <img
                    src="https://ui-avatars.com/api/?name=Casandra+Putri"
                    alt="Casandra Putri"
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <span className="font-semibold text-gray-800">Casandra Putri</span>
                </td>
                <td className="py-3 px-2 text-gray-600">Web Development</td>
                <td className="py-3 px-2 text-gray-600">Rp 500.000</td>
                <td className="py-3 px-2 text-gray-500 text-sm">16 Sept 2025</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>


      {/* Recent Class Added */}
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-red-800 font-semibold text-lg">Recent Course Added</h3>
          <button className="text-sm text-blue-500">View All</button>
        </div>
        <ul className="space-y-3">
          <li className="border-b pb-2">
            <p className="text-gray-700 font-medium">Next.js for Beginners</p>
            <span className="text-sm text-gray-500">by Muhammad Ridho • 15 Sept 2025</span>
          </li>
          <li className="border-b pb-2">
            <p className="text-gray-700 font-medium">UI/UX Design Fundamentals</p>
            <span className="text-sm text-gray-500">by Casandra Putri • 14 Sept 2025</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
