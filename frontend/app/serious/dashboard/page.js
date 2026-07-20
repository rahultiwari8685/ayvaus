"use client";

import { useSocket } from "@/context/SocketContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import StartMatchingCard from "./components/StartMatchingCard";
import WalletCard from "./components/WalletCard";
import ReferralCard from "./components/ReferralCard";
import RewardGuide from "./components/RewardGuide";
import ConnectionHistory from "./components/ConnectionHistory";

export default function SeriousDashboard() {
  const { socket } = useSocket();
  const router = useRouter();

  const [history, setHistory] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [referral, setReferral] = useState(null);
  const [onlineMap, setOnlineMap] = useState({});

  const handleLogout = () => {
    socket?.disconnect();

    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("reconnect_partner_id");

    router.replace("/serious/login");
  };

  const fetchWallet = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("https://api.flirtaus.com/api/serious/wallet", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (data.success) {
      setWallet(data.wallet);
    }
  };

  const fetchReferral = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("https://api.flirtaus.com/api/serious/referral", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (data.success) {
      setReferral(data);
    }
  };

  const fetchHistory = async () => {
    const userId = localStorage.getItem("userId");

    const res = await fetch(
      `https://api.flirtaus.com/api/user/yesterday-history?userId=${userId}`,
    );

    const historyData = await res.json();

    setHistory(historyData || []);

    const ids = historyData.map((item) => item.userId);

    if (ids.length > 0) {
      const onlineRes = await fetch(
        "https://api.flirtaus.com/api/user/online-status",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userIds: ids,
          }),
        },
      );

      const onlineData = await onlineRes.json();

      setOnlineMap(onlineData);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchWallet(), fetchReferral(), fetchHistory()]);
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("reconnect-accepted", () => {
      router.push("/serious/match");
    });

    return () => {
      socket.off("reconnect-accepted");
    };
  }, [socket, router]);

  const totalChatTime = history.reduce(
    (sum, item) => sum + (item.duration || 0),
    0,
  );

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background */}

      <div className="absolute inset-0">
        <div className="absolute -top-40 -left-32 h-[450px] w-[450px] rounded-full bg-pink-500/20 blur-[120px]" />

        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[140px]" />
      </div>

      <Navbar router={router} referral={referral} handleLogout={handleLogout} />

      <main className="relative z-10 max-w-[1500px] mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* LEFT SIDEBAR */}

          <div className="col-span-12 lg:col-span-3 space-y-6">
            <StartMatchingCard router={router} />

            <WalletCard wallet={wallet} />
          </div>

          {/* CENTER */}

          <div className="col-span-12 lg:col-span-6">
            <ConnectionHistory
              history={history}
              socket={socket}
              onlineMap={onlineMap}
              wallet={wallet}
              totalChatTime={totalChatTime}
            />
          </div>

          {/* RIGHT SIDEBAR */}

          <div className="col-span-12 lg:col-span-3 space-y-6">
            <ReferralCard referral={referral} />

            <RewardGuide />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
