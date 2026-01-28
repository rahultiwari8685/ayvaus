"use client";

import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
});

export default function VideoChat() {
  const localVideo = useRef(null);
  const remoteVideo = useRef(null);

  const pcRef = useRef(null);
  const streamRef = useRef(null);
  const roleRef = useRef(null);

  const [status, setStatus] = useState("Looking for someone...");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  async function initCamera() {
    if (streamRef.current) return;

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    streamRef.current = stream;
    localVideo.current.srcObject = stream;
  }

  function createPeer() {
    if (!streamRef.current) return;

    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    // const pc = new RTCPeerConnection({
    //   iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    // });

    var myPeerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.relay.metered.ca:80",
        },
        {
          urls: "turn:global.relay.metered.ca:80",
          username: "37f3ba32d1181346eda6fe32",
          credential: "UThQI3FDlqr3JN+a",
        },
        {
          urls: "turn:global.relay.metered.ca:80?transport=tcp",
          username: "37f3ba32d1181346eda6fe32",
          credential: "UThQI3FDlqr3JN+a",
        },
        {
          urls: "turn:global.relay.metered.ca:443",
          username: "37f3ba32d1181346eda6fe32",
          credential: "UThQI3FDlqr3JN+a",
        },
        {
          urls: "turns:global.relay.metered.ca:443?transport=tcp",
          username: "37f3ba32d1181346eda6fe32",
          credential: "UThQI3FDlqr3JN+a",
        },
      ],
    });

    // Transceivers (important for stable negotiation)
    pc.addTransceiver("video", { direction: "sendrecv" });
    pc.addTransceiver("audio", { direction: "sendrecv" });

    streamRef.current.getTracks().forEach((track) => {
      pc.addTrack(track, streamRef.current);
    });

    pc.ontrack = (e) => {
      remoteVideo.current.srcObject = e.streams[0];
    };

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("signal", { candidate: e.candidate });
      }
    };

    pcRef.current = pc;
  }

  useEffect(() => {
    let mounted = true;

    async function start() {
      await initCamera();
      if (!mounted) return;

      createPeer();
      socket.emit("join");
    }

    start();

    socket.on("matched", ({ role }) => {
      roleRef.current = role;
      setStatus("Connected");

      if (role === "callee") {
        socket.emit("ready");
      }
    });

    socket.on("ready", async () => {
      if (roleRef.current !== "caller") return;
      if (!pcRef.current) return;

      const offer = await pcRef.current.createOffer();
      await pcRef.current.setLocalDescription(offer);
      socket.emit("signal", { offer });
    });

    socket.on("signal", async (data) => {
      if (!pcRef.current) return;

      if (data.offer) {
        await pcRef.current.setRemoteDescription(data.offer);
        const answer = await pcRef.current.createAnswer();
        await pcRef.current.setLocalDescription(answer);
        socket.emit("signal", { answer });
      }

      if (data.answer) {
        await pcRef.current.setRemoteDescription(data.answer);
      }

      if (data.candidate) {
        await pcRef.current.addIceCandidate(data.candidate);
      }
    });

    socket.on("chat-message", (msg) => {
      setMessages((m) => [...m, { from: "guest", text: msg }]);
    });

    socket.on("partner-left", () => {
      setStatus("Looking for someone...");
      setMessages([]);
      remoteVideo.current.srcObject = null;
      createPeer();
      socket.emit("join");
    });

    return () => {
      mounted = false;
      pcRef.current?.close();
      streamRef.current?.getTracks().forEach((t) => t.stop());
      socket.off();
    };
  }, []);

  function nextChat() {
    setStatus("Skipping...");
    setMessages([]);
    remoteVideo.current.srcObject = null;
    createPeer();
    socket.emit("next");
  }

  function sendMessage(e) {
    e.preventDefault();
    if (!text.trim()) return;

    socket.emit("chat-message", text);
    setMessages((m) => [...m, { from: "me", text }]);
    setText("");
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4">
      <h1 className="text-2xl font-semibold mb-2">Ayvaus(Formally- Flirta)</h1>
      <p className="text-sm text-gray-400 mb-4">{status}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div className="relative">
          <span className="absolute top-2 left-2 bg-blue-600 text-xs px-2 py-1 rounded">
            Me
          </span>
          <video
            ref={localVideo}
            autoPlay
            muted
            playsInline
            className="w-72 h-56 bg-black rounded-lg"
          />
        </div>

        <div className="relative">
          <span className="absolute top-2 left-2 bg-pink-600 text-xs px-2 py-1 rounded">
            Guest
          </span>
          <video
            ref={remoteVideo}
            autoPlay
            playsInline
            className="w-72 h-56 bg-black rounded-lg"
          />
        </div>
      </div>

      <div className="w-full max-w-md bg-gray-800 rounded-lg p-3 mb-3 h-64 flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-2">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`p-2 rounded max-w-[75%] ${
                m.from === "me" ? "bg-blue-600 ml-auto" : "bg-gray-700 mr-auto"
              }`}
            >
              {m.text}
            </div>
          ))}
        </div>

        <form onSubmit={sendMessage} className="flex mt-2 gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 px-3 py-2 rounded bg-gray-700 outline-none"
            placeholder="Type a message..."
          />
          <button className="bg-green-600 px-4 rounded">Send</button>
        </form>
      </div>

      <button
        onClick={nextChat}
        className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-full"
      >
        Next
      </button>
    </div>
  );
}
