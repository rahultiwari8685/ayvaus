"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function RedeemHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/redeem/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setHistory(res.data);
    } catch (err) {
      console.log(err);
      alert("Unable to load history");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";

      case "approved":
        return "bg-blue-500";

      case "paid":
        return "bg-green-500";

      case "rejected":
        return "bg-red-500";

      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Redeem History</h1>

        {history.length === 0 ? (
          <div className="rounded-2xl bg-white/5 p-8 text-center">
            No Redeem History Found
          </div>
        ) : (
          <div className="space-y-5">
            {history.map((item) => (
              <div
                key={item._id}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold">₹{item.amount}</h3>

                    <p className="text-gray-400 mt-2">Coins : {item.coins}</p>

                    <p className="text-gray-400">UPI : {item.upiId}</p>

                    <p className="text-gray-500 text-sm mt-2">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>

                    {item.transactionId && (
                      <p className="text-green-400 text-sm mt-2">
                        Transaction ID : {item.transactionId}
                      </p>
                    )}
                  </div>

                  <div>
                    <span
                      className={`px-4 py-2 rounded-full text-white ${getStatusColor(
                        item.status,
                      )}`}
                    >
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
