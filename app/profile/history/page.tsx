"use client";

import { useEffect, useState } from "react";
import { fetchOrders as Orders } from "@/utils/api";
export default function History() {

  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token") || "";
      setToken(token);

      try {
        const response = await Orders(token);
        setOrders(response);

      } catch (err) {
        setError("Gagal memuat history. Silakan coba lagi.");
      } finally {
        setIsLoading(false);
      }

    }
  })
  return (
    <div className="flex p-2 sm:p-4 gap-2 sm:gap-4 flex-col w-full">
      <h1 className="font-bold text-xl sm:text-2xl text-black">
        Berikut history pembayaran anda
      </h1>
      <h1 className="font-medium text-base sm:text-lg text-gray-600">
        Berikut history pembayaran anda
      </h1>

      {isLoading && (
        <div className="flex flex-col gap-4 w-full mt-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-white p-6 rounded-xl shadow-sm border border-gray-300"
            >
              <div className="h-4 bg-gray-200 mb-2 rounded"></div>
              <div className="h-3 bg-gray-200 mb-4 rounded"></div>
              <div className="flex space-x-2">
                <div className="h-8 w-20 bg-gray-200 rounded"></div>
                <div className="h-8 w-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && !isLoading && (
        <div className="text-red-500 text-center mt-4">{error}</div>
      )}

      {!isLoading && orders.length === 0 && (
        <div className="text-gray-500 text-center mt-4">
          Belum ada history pembayaran.
        </div>
      )}

    {orders.map((order => (
      <div className="flex flex-col gap-2 sm:gap-4 max-h-none md:max-h-[600px] overflow-y-auto no-scrollbar w-full">
        {/* Card */}
        <div className="flex flex-col sm:flex-row border-2 justify-between items-start sm:items-center border-gray-200 rounded-2xl shadow-md p-3 sm:p-4 bg-white w-full">
          <h1 className="font-bold text-base sm:text-xl text-gray-600 mb-2 sm:mb-0">
            {order.class.title}
          </h1>
          <div className="flex flex-col sm:items-end justify-between">
            <h1 className="text-xs sm:text-sm font-medium text-gray-400">
              {order.date?.toLocaleDateString("id-ID")}
            </h1>
            <h1 className="text-base sm:text-lg font-bold text-black">
                    Rp {order.price.toLocaleString('id-ID')}
            </h1>
            <h1 className="text-xs sm:text-sm font-medium text-gray-400">
              {order.status}
            </h1>
          </div>
        </div>
        
      </div>
    )))}
    </div>
    
  );
}
