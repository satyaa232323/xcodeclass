"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchOrders, myClasses } from "@/utils/api";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function PaymentPage() {
  const router = useRouter();
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [purchasedClasses, setPurchasedClasses] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchOrder = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login to view your order history");
        return;
      }

      try {
        const response = await fetchOrders(token);
        // Filter only PENDING orders
        const pendingOrders = response.orders.filter(
          (order: Order) => order.status === "PENDING"
        );
        setOrders(pendingOrders);

        // Fetch purchased classes
        const purchasedResponse = await myClasses(token);
        setPurchasedClasses(
          new Set(purchasedResponse.data.map((item: Class) => item.id))
        );
      } catch (error) {
        console.error("Error fetching order:", error);
        setError("Terjadi kesalahan memuat Data");
      }
    };

    fetchOrder();
  }, []);

  const handlePay = async (orderId: string) => {
    setIsPaying(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      // Check if class is already purchased
      const orderClass = orders.find(order => order.id === orderId)?.orderItems[0].classObj;
      if (orderClass && purchasedClasses.has(orderClass.id)) {
        setError("You have already purchased this class");
        return;
      }

      const response = await fetch(`/api/payment/${orderId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Payment initiation failed");
      }

      if (data.redirectUrl) {
        // Remove the paid order from the list
        setOrders(prev => prev.filter(order => order.id !== orderId));
        // Redirect to Midtrans payment page
        window.location.href = data.redirectUrl;
      }

    } catch (error: any) {
      console.error("Payment error:", error);
      setError(error.message || "Terjadi kesalahan saat memproses pembayaran");
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col gap-6 max-w-7xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="font-bold text-3xl text-gray-800"
      >
        Checkout Video
      </motion.h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-md divide-y overflow-hidden">
        <AnimatePresence>
          {orders.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex gap-4 p-4 items-center transition transform hover:scale-[1.02] hover:shadow-md bg-red-50 border-l-4 border-red-400"
            >
              <Image
                src={item.orderItems[0].classObj.thumbnailUrl}
                alt={item.orderItems[0].classObj.title}
                width={50}
                height={50}
                className="w-28 h-20 rounded-lg object-cover shadow-sm"
              />
              <div className="flex flex-col flex-1">
                <h2 className="font-semibold text-gray-800">
                  {item.orderItems[0].classObj.title}
                </h2>
                <span className="text-red-600 font-bold mt-1">
                  Rp {item.totalAmount.toLocaleString("id-ID")}
                </span>
                <span className="text-red-600 font-bold mt-1">
                 {item.status}
                </span>
                {purchasedClasses.has(item.orderItems[0].classObj.id) && (
                  <span className="text-yellow-600 text-sm mt-1">
                    You already own this class
                  </span>
                )}
              </div>

              <button
                onClick={() => handlePay(item.id)}
                disabled={isPaying || purchasedClasses.has(item.orderItems[0].classObj.id)}
                className={`px-6 py-3 rounded-xl font-bold text-white transition ${isPaying || purchasedClasses.has(item.orderItems[0].classObj.id)
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600"
                  }`}
              >
                {isPaying ? "Processing..." : "Bayar"}
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {orders.length === 0 && !error && (
        <div className="text-center text-gray-500 mt-8">
          No pending orders found
        </div>
      )}
    </div>
  );
}
 