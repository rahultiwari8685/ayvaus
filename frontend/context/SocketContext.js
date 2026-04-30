"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { io } from "socket.io-client";

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);

  const [reconnectRequest, setReconnectRequest] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    const s = io("https://api.flirtaus.com", {
      transports: ["websocket"],
      auth: {
        token,
        mode: "serious",
      },
    });

    setSocket(s);

    s.on("incoming-reconnect-request", (data) => {
      setReconnectRequest(data);
    });

    s.on("reconnect-accepted", (data) => {
      localStorage.setItem("reconnect_partner_id", data.partnerId);

      window.location.href = "/serious/match";
    });

    return () => {
      s.disconnect();
    };
  }, []);

  const acceptReconnect = () => {
    if (!socket || !reconnectRequest) return;

    localStorage.setItem("reconnect_partner_id", reconnectRequest.requesterId);

    socket.emit("accept-reconnect", {
      requesterId: reconnectRequest.requesterId,
    });

    setReconnectRequest(null);

    window.location.href = "/serious/match";
  };

  const rejectReconnect = () => {
    setReconnectRequest(null);
  };

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}

      {reconnectRequest && (
        <div className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center">
          <div className="bg-zinc-900 p-6 rounded-2xl border border-white/10 w-[90%] max-w-sm text-center">
            <h2 className="text-xl font-bold text-white mb-2">
              ❤️ Reconnect Request
            </h2>

            <p className="text-gray-300 mb-6">
              <span className="text-pink-400 font-semibold">
                {reconnectRequest.requesterName}
              </span>{" "}
              wants to reconnect
            </p>

            <div className="flex gap-3">
              <button
                onClick={rejectReconnect}
                className="flex-1 py-2 rounded-xl bg-gray-700 text-white"
              >
                Reject
              </button>

              <button
                onClick={acceptReconnect}
                className="flex-1 py-2 rounded-xl bg-pink-500 text-white"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
