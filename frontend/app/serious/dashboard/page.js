"use client";

import { useSocket } from "@/context/SocketContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
// import HeroSection from "./components/HeroSection";
import StartMatchingCard from "./components/StartMatchingCard";
import WalletCard from "./components/WalletCard";
import ReferralCard from "./components/ReferralCard";
import RewardGuide from "./components/RewardGuide";
// import StatsCards from "./components/StatsCards";
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

    const ids = historyData.map((x) => x.userId);

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
  };

  useEffect(() => {
    fetchWallet();
    fetchReferral();
    fetchHistory();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("reconnect-accepted", () => {
      router.push("/serious/match");
    });

    return () => {
      socket.off("reconnect-accepted");
    };
  }, [socket]);

  const totalChatTime = history.reduce(
    (sum, item) => sum + (item.duration || 0),
    0,
  );

  return (
    <div className="grid grid-cols-12 gap-6 mt-8">
      {/* Left */}

      <div className="col-span-12 lg:col-span-3 space-y-6">
        <StartMatchingCard router={router} />

        <WalletCard wallet={wallet} />
      </div>

      {/* Center */}

      <div className="col-span-12 lg:col-span-6">
        <ConnectionHistory
          history={history}
          socket={socket}
          onlineMap={onlineMap}
          wallet={wallet}
          totalChatTime={totalChatTime}
        />
      </div>

      {/* Right */}

      <div className="col-span-12 lg:col-span-3 space-y-6">
        <ReferralCard referral={referral} />

        <RewardGuide />
      </div>
    </div>
  );
}
