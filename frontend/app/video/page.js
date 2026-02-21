"use client";

import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  RotateCcw,
  MessageCircle,
  SkipForward,
  PhoneOff,
} from "lucide-react";

const socket = io("https://api.ayvaus.com", {
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
  const [onlineCount, setOnlineCount] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [facingMode, setFacingMode] = useState("user");
  const [showChat, setShowChat] = useState(false);

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

    const pc = new RTCPeerConnection({
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

    streamRef.current.getTracks().forEach((track) => {
      pc.addTrack(track, streamRef.current);
    });

    pc.ontrack = (event) => {
      if (!remoteVideo.current.srcObject) {
        remoteVideo.current.srcObject = new MediaStream();
      }

      remoteVideo.current.srcObject.addTrack(event.track);
    };

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("signal", { candidate: e.candidate });
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log("ICE State:", pc.iceConnectionState);

      if (pc.iceConnectionState === "checking") {
        setStatus("Connecting...");
      }

      if (pc.iceConnectionState === "connected") {
        setStatus("Connected");
      }

      if (
        pc.iceConnectionState === "disconnected" ||
        pc.iceConnectionState === "failed" ||
        pc.iceConnectionState === "closed"
      ) {
        setStatus("Looking for someone...");
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

    socket.on("online-users", (count) => {
      setOnlineCount(count);
    });

    start();

    socket.on("matched", ({ role }) => {
      roleRef.current = role;
      setStatus("Connecting...");

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
        await pcRef.current.setRemoteDescription(
          new RTCSessionDescription(data.offer),
        );

        const answer = await pcRef.current.createAnswer();
        await pcRef.current.setLocalDescription(answer);

        socket.emit("signal", { answer });
      }

      if (data.answer) {
        await pcRef.current.setRemoteDescription(
          new RTCSessionDescription(data.answer),
        );
      }

      if (data.candidate) {
        try {
          await pcRef.current.addIceCandidate(
            new RTCIceCandidate(data.candidate),
          );
        } catch (err) {
          console.log("ICE error:", err);
        }
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

  function toggleMute() {
    if (!streamRef.current) return;

    const audioTrack = streamRef.current
      .getTracks()
      .find((track) => track.kind === "audio");

    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
    }
  }

  function toggleVideo() {
    if (!streamRef.current) return;

    const videoTrack = streamRef.current
      .getTracks()
      .find((track) => track.kind === "video");

    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoOff(!videoTrack.enabled);
    }
  }

  async function switchCamera() {
    if (!streamRef.current) return;

    const newFacingMode = facingMode === "user" ? "environment" : "user";

    try {
      // Stop current video track
      const videoTrack = streamRef.current
        .getTracks()
        .find((track) => track.kind === "video");

      if (videoTrack) videoTrack.stop();

      // Get new camera stream
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: newFacingMode },
        audio: false,
      });

      const newVideoTrack = newStream.getVideoTracks()[0];

      // Replace track in peer connection
      const sender = pcRef.current
        ?.getSenders()
        .find((s) => s.track?.kind === "video");

      if (sender) {
        await sender.replaceTrack(newVideoTrack);
      }

      // Replace local stream track
      streamRef.current.removeTrack(streamRef.current.getVideoTracks()[0]);
      streamRef.current.addTrack(newVideoTrack);

      localVideo.current.srcObject = streamRef.current;

      setFacingMode(newFacingMode);
    } catch (err) {
      console.log("Camera switch error:", err);
    }
  }

  function exitChat() {
    pcRef.current?.close();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    socket.disconnect();
    window.location.href = "/";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white relative flex flex-col items-center justify-center overflow-hidden">
      {/* Header */}
      <div className="absolute top-4 text-center">
        <h1 className="text-2xl font-bold tracking-wide">
          Ayvaus <span className="text-pink-500">(Formerly Flirta)</span>
        </h1>

        <p className="text-sm text-green-400">🟢 {onlineCount} users online</p>

        <p className="text-xs text-gray-400">{status}</p>
      </div>

      {/* Guest Video Full Screen */}
      <div className="relative w-full h-screen flex items-center justify-center">
        <video
          ref={remoteVideo}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Local Video Floating */}
        <div className="absolute bottom-28 right-6 w-32 h-44 md:w-40 md:h-56 rounded-xl overflow-hidden border-2 border-white shadow-xl">
          <video
            ref={localVideo}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover scale-x-[-1]"
          />
        </div>
      </div>

      {/* Chat Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-gray-900/95 backdrop-blur-lg shadow-2xl transform transition-transform duration-300 z-50 ${
          showChat ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Chat Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold">Chat</h2>
            <button onClick={() => setShowChat(false)} className="text-xl">
              ✖
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg max-w-[75%] ${
                  m.from === "me"
                    ? "bg-blue-600 ml-auto"
                    : "bg-gray-700 mr-auto"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={sendMessage}
            className="p-4 flex gap-2 border-t border-gray-700"
          >
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 px-3 py-2 rounded bg-gray-800 outline-none"
              placeholder="Type a message..."
            />
            <button className="bg-green-600 px-4 rounded">Send</button>
          </form>
        </div>
      </div>

      {/* Control Bar */}
      <div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-md flex justify-between items-center bg-black/60 backdrop-blur-xl px-5 py-3 rounded-2xl shadow-2xl border border-white/10"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <button
          onClick={exitChat}
          className="w-13 h-13 rounded-full bg-red-600 flex items-center justify-center shadow-lg"
        >
          <svg width="22" height="22" fill="white" viewBox="0 0 24 24">
            <path d="M3 12l18 0" />
            <path d="M16 7l5 5-5 5" />
          </svg>
        </button>
        {/* Mute */}
        <button
          onClick={toggleMute}
          className={`w-11 h-11 rounded-full flex items-center justify-center transition ${
            isMuted ? "bg-red-600" : "bg-gray-700"
          }`}
        >
          <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
            <path d="M12 15a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v7a3 3 0 0 0 3 3z" />
            <path d="M19 11a7 7 0 0 1-14 0" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        </button>

        {/* Camera */}
        <button
          onClick={toggleVideo}
          className={`w-11 h-11 rounded-full flex items-center justify-center transition ${
            isVideoOff ? "bg-red-600" : "bg-gray-700"
          }`}
        >
          <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
            <rect x="2" y="7" width="15" height="10" rx="2" />
            <polygon points="17 7 22 10 22 14 17 17" />
          </svg>
        </button>

        {/* Switch Camera */}
        <button
          onClick={switchCamera}
          className="w-11 h-11 rounded-full bg-gray-700 flex items-center justify-center"
        >
          <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
            <path d="M7 7h10l-3-3m3 3l-3 3" />
            <path d="M17 17H7l3 3m-3-3l3-3" />
          </svg>
        </button>

        {/* Chat */}
        <button
          onClick={() => setShowChat(!showChat)}
          className="w-11 h-11 rounded-full bg-gray-700 flex items-center justify-center"
        >
          <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
            <path d="M21 15a4 4 0 0 1-4 4H8l-4 4V5a4 4 0 0 1 4-4h9a4 4 0 0 1 4 4z" />
          </svg>
        </button>

        {/* Next */}
        <button
          onClick={nextChat}
          className="w-13 h-13 rounded-full bg-orange-500 flex items-center justify-center shadow-lg"
        >
          <svg width="22" height="22" fill="white" viewBox="0 0 24 24">
            <polygon points="5 4 15 12 5 20 5 4" />
            <rect x="17" y="4" width="2" height="16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
