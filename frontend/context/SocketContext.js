"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";

import { io } from "socket.io-client";

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);

  const [reconnectRequest, setReconnectRequest] = useState(null);
  const ringtoneRef = useRef(null);

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

    // s.on("incoming-reconnect-request", (data) => {
    //   setReconnectRequest(data);
    // });

    s.on("incoming-reconnect-request", (data) => {
      setReconnectRequest(data);

      if (ringtoneRef.current) {
        ringtoneRef.current.currentTime = 0;

        ringtoneRef.current.play().catch((err) => {
          console.log(err);
        });
      }
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

    ringtoneRef.current?.pause();
    ringtoneRef.current.currentTime = 0;

    setReconnectRequest(null);

    window.location.href = "/serious/match";
  };

  // const rejectReconnect = () => {
  //   setReconnectRequest(null);
  // };

  const rejectReconnect = () => {
    ringtoneRef.current?.pause();
    ringtoneRef.current.currentTime = 0;

    setReconnectRequest(null);
  };

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}

      {/* {reconnectRequest && (
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
      )} */}

      {reconnectRequest && (
        <div className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center text-white">
          <div className="animate-pulse text-green-400 text-sm mb-3">
            Incoming reconnect call...
          </div>

          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-5xl font-bold shadow-2xl">
            {reconnectRequest.requesterName?.charAt(0)}
          </div>

          <h2 className="mt-6 text-3xl font-bold">
            {reconnectRequest.requesterName}
          </h2>

          <p className="text-gray-400 mt-2">wants to reconnect</p>

          <div className="flex gap-10 mt-14">
            <button
              onClick={rejectReconnect}
              className="w-20 h-20 rounded-full bg-red-600 text-3xl shadow-xl"
            >
              ✕
            </button>

            <button
              onClick={acceptReconnect}
              className="w-20 h-20 rounded-full bg-green-500 text-3xl shadow-xl animate-bounce"
            >
              📞
            </button>
          </div>
        </div>
      )}
      <audio ref={ringtoneRef} src="/sounds/call.mp3" preload="auto" loop />
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
