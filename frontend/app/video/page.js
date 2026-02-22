"use client";

import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { v4 as uuid } from "uuid";

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

  const [typing, setTyping] = useState(false);

  const [unreadCount, setUnreadCount] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

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

      if (pc.iceConnectionState === "failed") {
        console.log("ICE failed, retrying...");
        socket.emit("next");
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
      setMessages((prev) => [...prev, msg]);

      socket.emit("message-delivered", msg.id);

      // Increase unread if chat is closed
      if (!showChat) {
        setUnreadCount((prev) => prev + 1);
      }
    });

    socket.on("edit-message", ({ id, newText }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, text: newText, edited: true } : m,
        ),
      );
    });

    socket.on("message-delivered", (messageId) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId ? { ...m, status: "delivered" } : m,
        ),
      );
    });

    socket.on("typing", () => {
      setTyping(true);

      setTimeout(() => {
        setTyping(false);
      }, 2000);
    });

    socket.on("message-seen", (messageId) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, status: "seen" } : m)),
      );
    });

    socket.on("partner-left", () => {
      setStatus("Looking for someone...");
      setMessages([]);

      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }

      if (remoteVideo.current?.srcObject) {
        remoteVideo.current.srcObject.getTracks().forEach((t) => t.stop());
        remoteVideo.current.srcObject = null;
      }

      setTimeout(() => {
        createPeer();
        socket.emit("join");
      }, 500);
    });

    return () => {
      mounted = false;
      pcRef.current?.close();
      streamRef.current?.getTracks().forEach((t) => t.stop());
      socket.off();
    };
  }, [showChat]);

  useEffect(() => {
    if (showChat) {
      messages.forEach((msg) => {
        if (msg.sender !== socket.id && msg.status !== "seen") {
          socket.emit("message-seen", msg.id);
        }
      });
    }
  }, [showChat]);

  function nextChat() {
    setStatus("Skipping...");
    setMessages([]);

    // Close old peer
    if (pcRef.current) {
      pcRef.current.ontrack = null;
      pcRef.current.onicecandidate = null;
      pcRef.current.close();
      pcRef.current = null;
    }

    // Clear remote video
    if (remoteVideo.current?.srcObject) {
      remoteVideo.current.srcObject.getTracks().forEach((t) => t.stop());
      remoteVideo.current.srcObject = null;
    }

    socket.emit("next");
  }

  function sendMessage(e) {
    e.preventDefault();
    if (!text.trim()) return;

    const message = {
      id: uuid(),
      sender: socket.id,
      text,
      status: "sent",
    };

    socket.emit("chat-message", message);
    setMessages((prev) => [...prev, message]);
    setText("");
  }

  async function startRecording() {
    if (!streamRef.current) return;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;
    audioChunksRef.current = [];

    recorder.ondataavailable = (e) => {
      audioChunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const reader = new FileReader();

      reader.onloadend = () => {
        const message = {
          id: crypto.randomUUID(),
          sender: socket.id,
          type: "audio",
          audio: reader.result,
          status: "sent",
        };

        socket.emit("chat-message", message);
        setMessages((prev) => [...prev, message]);
      };

      reader.readAsDataURL(blob);
    };

    recorder.start();
    setIsRecording(true);
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
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

  function handleImage(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const message = {
        id: crypto.randomUUID(),
        sender: socket.id,
        type: "image",
        image: reader.result,
        status: "sent",
      };

      socket.emit("chat-message", message);
      setMessages((prev) => [...prev, message]);
    };

    reader.readAsDataURL(file);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white relative flex flex-col items-center justify-center overflow-hidden">
      {/* Header */}
      <div className="absolute top-4 text-center">
        <h1 className="text-2xl font-bold tracking-wide">
          Flirta <span className="text-pink-500">(Formerly Ayvaus)</span>
        </h1>

        <p className="text-sm text-green-400">🟢 {onlineCount} Users Online</p>

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

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div
                key={m.id || i}
                className={`p-2 rounded-lg max-w-[75%] ${
                  m.sender === socket.id
                    ? "bg-blue-600 ml-auto"
                    : "bg-gray-700 mr-auto"
                }`}
              >
                <div className="flex items-end gap-1">
                  <span>{m.text}</span>

                  {/* Edited Label */}
                  {m.edited && (
                    <span className="text-xs italic text-gray-300 ml-1">
                      edited
                    </span>
                  )}

                  {m.sender === socket.id && (
                    <span className="text-xs ml-1">
                      {m.status === "sent" && "✓"}
                      {m.status === "delivered" && "✓✓"}
                      {m.status === "seen" && (
                        <span className="text-blue-400">✓✓</span>
                      )}
                      {m.type === "audio" && (
                        <audio controls src={m.audio} className="max-w-xs" />
                      )}

                      {m.type === "image" && (
                        <img src={m.image} className="rounded-lg max-w-xs" />
                      )}
                    </span>
                  )}

                  {m.sender === socket.id && (
                    <button
                      onClick={() => {
                        const newText = prompt("Edit message", m.text);
                        if (!newText) return;

                        socket.emit("edit-message", { id: m.id, newText });
                        setMessages((prev) =>
                          prev.map((msg) =>
                            msg.id === m.id
                              ? { ...msg, text: newText, edited: true }
                              : msg,
                          ),
                        );
                      }}
                      className="text-xs text-gray-300 ml-2"
                    >
                      ✏
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {typing && (
            <p className="text-xs text-gray-400 px-4 pb-2">Typing...</p>
          )}

          <form
            onSubmit={sendMessage}
            className="p-4 flex  border-t border-gray-700"
          >
            <input
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                socket.emit("typing");
              }}
              className="flex-1 px-3 py-2 rounded bg-gray-800 outline-none"
              placeholder="Type a message..."
            />

            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className="bg-purple-600 px-3 rounded"
            >
              {isRecording ? "Stop" : "🎙"}
            </button>
            <input
              type="file"
              accept="image/*"
              hidden
              id="imageUpload"
              onChange={handleImage}
            />

            <label htmlFor="imageUpload" className="cursor-pointer px-2">
              📷
            </label>
            <button className="bg-green-600 px-4 rounded">Send</button>
          </form>
        </div>
      </div>

      <div
        className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[95%] max-w-lg bg-black/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 px-4 py-3 flex justify-between items-center"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex flex-col items-center text-xs text-white">
          <button
            onClick={exitChat}
            className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-lg"
          >
            ✕
          </button>
          <span className="mt-1 text-gray-300">Exit</span>
        </div>

        <div className="flex flex-col items-center text-xs text-white">
          <button
            onClick={toggleMute}
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isMuted ? "bg-red-600" : "bg-gray-700"
            }`}
          >
            🎤
          </button>
          <span className="mt-1 text-gray-300">
            {isMuted ? "Unmute" : "Mute"}
          </span>
        </div>

        <div className="flex flex-col items-center text-xs text-white">
          <button
            onClick={toggleVideo}
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isVideoOff ? "bg-red-600" : "bg-gray-700"
            }`}
          >
            📷
          </button>
          <span className="mt-1 text-gray-300">
            {isVideoOff ? "On" : "Off"}
          </span>
        </div>

        {/* Switch */}
        <div className="flex flex-col items-center text-xs text-white">
          <button
            onClick={switchCamera}
            className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center"
          >
            🔄
          </button>
          <span className="mt-1 text-gray-300">Flip</span>
        </div>

        {/* Chat */}
        <div className="flex flex-col items-center text-xs text-white relative">
          <div className="relative">
            <button
              onClick={() => {
                setShowChat(true);
                setUnreadCount(0);
              }}
              className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center"
            >
              💬
            </button>

            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full px-2 py-0.5">
                {unreadCount}
              </span>
            )}
          </div>

          <span className="mt-1 text-gray-300">Chat</span>
        </div>

        <div className="flex flex-col items-center text-xs text-white">
          <button
            onClick={nextChat}
            className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center shadow-lg"
          >
            ➤
          </button>
          <span className="mt-1 text-orange-400 font-semibold">Next</span>
        </div>
      </div>
    </div>
  );
}
