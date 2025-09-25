"use client";

import { useEffect, useState } from "react";
import { fetchOrders } from "@/utils/api";

export default function History() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrderHistory = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login to view your order history");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetchOrders(token);
        console.log("Fetched orders:", response);
        if (response.orders) {
          // Format dates for each order and orderItem
          const formattedOrders = response.orders.map((order: Order) => ({
            ...order,
            createdAt: new Date(order.createdAt).toLocaleDateString("id-ID"),
            orderItems: order.orderItems.map(item => ({
              ...item,
              date: new Date(item.date).toLocaleDateString("id-ID")
            }))
          }));
          setOrders(formattedOrders);
        }
      } catch (err) {
        setError("Gagal memuat history. Silakan coba lagi.");
        console.error("Error fetching orders:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  return (
    <div className="flex p-2 sm:p-4 gap-2 sm:gap-4 flex-col w-full">
      <h1 className="font-bold text-xl sm:text-2xl text-black">
        History Pembayaran
      </h1>
      <p className="font-medium text-base sm:text-lg text-gray-600">
        Berikut history pembayaran anda
      </p>

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

      <div className="flex flex-col gap-2 sm:gap-4 max-h-none md:max-h-[600px] overflow-y-auto no-scrollbar w-full">
        {orders.map((order) => (
          <div key={order.id} className="border-2 border-gray-200 rounded-2xl shadow-md p-4 bg-white">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-bold text-gray-500 text-lg">Order #{order.id.slice(-6)}</h2>
              <span className="text-gray-500">{order.createdAt}</span>
            </div>

            {order.orderItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center border-t border-gray-100 py-3">
                <div>
                  <h3 className="font-semibold text-gray-500">{item.classObj.title}</h3>
                  {/* <p className="text-gray-500 text-sm">Staty{order.status}</p> */}
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center border-t border-gray-200 pt-3 mt-2">
              <span className="font-bold text-lg text-gray-700">Rp {order.totalAmount.toLocaleString('id-ID')}</span>
              <span className="font-bold text-lg text-gray-700">{order.status}</span>
            </div>
          
          </div>
        ))}
      </div>
    </div>
  );
}
