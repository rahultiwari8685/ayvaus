"use client";

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { v4 as uuid } from "uuid";

function getOrCreateUserId() {
  let userId = localStorage.getItem("flirtaus_user_id");

  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem("flirtaus_user_id", userId);
  }

  return userId;
}

export default function VideoChat() {
  const socketRef = useRef(null);
  const localVideo = useRef(null);
  const remoteVideo = useRef(null);
  const pcRef = useRef(null);
  const streamRef = useRef(null);
  const roleRef = useRef(null);
  const audioStreamRef = useRef(null);

  const audioContextRef = useRef(null);
  const processorRef = useRef(null);
  const sourceRef = useRef(null);

  const iceQueueRef = useRef([]);
  const subtitleTimerRef = useRef(null);
  const languageRestartTimerRef = useRef(null);
  const lastSpeechEndRef = useRef(0);
  const shouldRestartRecognitionRef = useRef(false);
  const recognitionStartedOnceRef = useRef(false);
  const [status, setStatus] = useState("Looking for someone...");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [onlineCount, setOnlineCount] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [facingMode, setFacingMode] = useState("user");
  const [showChat, setShowChat] = useState(false);
  const recognitionRef = useRef(null);
  const [typing, setTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const draggingRef = useRef(false);
  const [voiceSubtitle, setVoiceSubtitle] = useState(null);
  const [language, setLanguage] = useState("en-US");
  const languageRef = useRef(language);

  useEffect(() => {
    languageRef.current = language;
  }, [language]);

  useEffect(() => {
    const savedLang = localStorage.getItem("subtitle_language");

    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  async function startAudioStreaming() {
    if (audioContextRef.current) {
      console.log("Audio already streaming");
      return;
    }

    if (!streamRef.current) return;

    const audioTrack = streamRef.current.getAudioTracks()[0];

    const stream = new MediaStream([audioTrack]);

    const audioContext = new AudioContext({
      sampleRate: 48000,
    });

    audioContextRef.current = audioContext;

    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }

    const source = audioContext.createMediaStreamSource(stream);

    sourceRef.current = source;

    const processor = audioContext.createScriptProcessor(4096, 1, 1);

    processorRef.current = processor;

    source.connect(processor);

    processor.connect(audioContext.destination);

    // processor.onaudioprocess = (e) => {
    //   const input = e.inputBuffer.getChannelData(0);

    //   const buffer = convertFloat32ToInt16(input);

    //   socketRef.current.emit("audio-stream", buffer);
    // };

    processor.onaudioprocess = (e) => {
      const input = e.inputBuffer.getChannelData(0);

      let volume = 0;

      for (let i = 0; i < input.length; i++) {
        volume = Math.max(volume, Math.abs(input[i]));
      }

      if (volume < 0.003) return;

      const buffer = convertFloat32ToInt16(input);

      if (buffer.byteLength === 0) return;

      socketRef.current.emit("audio-stream", buffer);
    };
  }

  function convertFloat32ToInt16(buffer) {
    let l = buffer.length;

    const result = new Int16Array(l);

    while (l--) {
      result[l] = Math.min(1, buffer[l]) * 0x7fff;
    }

    return result.buffer;
  }

  //   async function startAudioStreaming() {
  //     if (!streamRef.current) return;

  //     const audioTrack = streamRef.current.getAudioTracks()[0];

  //     if (!audioTrack) return;

  //     const stream = new MediaStream([audioTrack]);

  //     audioStreamRef.current = stream;

  //     const recorder = new MediaRecorder(stream, {
  //       mimeType: "audio/webm;codecs=opus",
  //     });

  //     mediaRecorderRef.current = recorder;

  //     recorder.ondataavailable = async (event) => {
  //       if (!event.data || event.data.size === 0) return;

  //    const buffer = await event.data.arrayBuffer();

  // if (buffer.byteLength < 1000) return;

  // socketRef.current.emit("audio-stream", buffer);
  //     };

  //   recorder.start(1200);

  //     console.log("🎤 Audio Streaming Started");
  //   }

  // function stopAudioStreaming() {
  //   if (mediaRecorderRef.current) {
  //     mediaRecorderRef.current.stop();
  //     mediaRecorderRef.current = null;
  //   }

  //   audioStreamRef.current = null;

  //   console.log("🛑 Audio Streaming Stopped");
  // }

  function stopAudioStreaming() {
    processorRef.current?.disconnect();
    sourceRef.current?.disconnect();

    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    processorRef.current = null;
    sourceRef.current = null;
    audioContextRef.current = null;

    console.log("Audio Streaming Stopped");
  }

  async function initCamera() {
    if (streamRef.current) return;

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,

      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        channelCount: 1,
        sampleRate: 48000,
        sampleSize: 16,
      },
    });

    streamRef.current = stream;
    localVideo.current.srcObject = stream;
  }

  function handleTouchStart(e) {
    draggingRef.current = true;
  }

  function handleTouchMove(e) {
    if (!draggingRef.current) return;

    const touch = e.touches[0];

    setPosition({
      x: touch.clientX - 60,
      y: touch.clientY - 80,
    });
  }

  function handleTouchEnd() {
    draggingRef.current = false;
  }

  async function createPeer() {
    iceQueueRef.current = [];

    if (!streamRef.current) return;

    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    iceQueueRef.current = [];

    const res = await fetch("https://api.flirtaus.com/turn-credentials");
    const turn = await res.json();

    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        {
          urls: "turn:72.61.231.247:3478?transport=udp",
          username: turn.username,
          credential: turn.credential,
        },
      ],
      iceTransportPolicy: "all",
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
        socketRef.current.emit("signal", { candidate: e.candidate });
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log("ICE State:", pc.iceConnectionState);

      if (pc.iceConnectionState === "checking") {
        setStatus("Connecting...");
      }

      if (pc.iceConnectionState === "connected") {
        setStatus("Connected");

        if (!audioContextRef.current) {
          startAudioStreaming();
        }
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
        socketRef.current.emit("next");
      }
    };

    pcRef.current = pc;
  }

  useEffect(() => {
    let mounted = true;

    socketRef.current = io("https://api.flirtaus.com", {
      transports: ["websocket", "polling"],
      auth: {
        mode: "random",
      },
    });

    const socket = socketRef.current;

    async function start() {
      await initCamera();
      if (!mounted) return;

      await createPeer();
      socketRef.current.emit("join", {
        language: languageRef.current,
      });

      console.log("🌍 INITIAL LANGUAGE:", languageRef.current);
    }

    socket.on("online-users", (count) => {
      setOnlineCount(count);
    });
    socket.on("connect", () => {
      socket.emit("get-online-count");
    });

    start();

    socket.on("matched", async ({ role }) => {
      if (!pcRef.current) {
        await createPeer();
      }

      roleRef.current = role;

      socketRef.current.emit("update-language", languageRef.current);

      console.log("🌍 RESENT LANGUAGE:", languageRef.current);
      console.log("🌍 RESENT LANGUAGE:", language);

      setStatus("Connecting...");
    });

    socket.on("ready", async () => {
      if (roleRef.current !== "caller") return;
      if (!pcRef.current) return;

      const offer = await pcRef.current.createOffer();
      await pcRef.current.setLocalDescription(offer);
      socketRef.current.emit("signal", {
        sdp: pcRef.current.localDescription,
      });
    });

    socket.on("signal", async (data) => {
      if (!pcRef.current) return;

      try {
        if (data.sdp?.type === "offer") {
          await pcRef.current.setRemoteDescription(
            new RTCSessionDescription(data.sdp),
          );

          while (iceQueueRef.current.length > 0) {
            await pcRef.current.addIceCandidate(iceQueueRef.current.shift());
          }

          const answer = await pcRef.current.createAnswer();
          await pcRef.current.setLocalDescription(answer);

          socketRef.current.emit("signal", {
            sdp: pcRef.current.localDescription,
          });
        }

        if (data.sdp?.type === "answer") {
          await pcRef.current.setRemoteDescription(
            new RTCSessionDescription(data.sdp),
          );

          while (iceQueueRef.current.length > 0) {
            await pcRef.current.addIceCandidate(iceQueueRef.current.shift());
          }
        }

        if (data.candidate) {
          const candidate = new RTCIceCandidate(data.candidate);

          if (pcRef.current.remoteDescription) {
            await pcRef.current.addIceCandidate(candidate);
          } else {
            iceQueueRef.current.push(candidate);
          }
        }
      } catch (err) {
        console.log("Signal handling error:", err);
      }
    });

    socket.on("chat-message", (msg) => {
      setMessages((prev) => [...prev, msg]);

      socketRef.current.emit("message-delivered", msg.id);

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

      shouldRestartRecognitionRef.current = false;

      stopAudioStreaming();
      setVoiceSubtitle("");

      recognitionStartedOnceRef.current = false;

      setTimeout(async () => {
        recognitionStartedOnceRef.current = false;
        await createPeer();
        socketRef.current.emit("join", {
          language: languageRef.current,
        });

        console.log("🌍 REJOIN LANGUAGE:", languageRef.current);
      }, 500);
    });

    socket.on("next-blocked", () => {
      alert("Please wait before skipping again.");
    });

    socket.on("voice-subtitle", (data) => {
      console.log("📥 SUBTITLE RECEIVED:", data);

      console.log("Subtitle:", data.text);

      // setVoiceSubtitle(data);

      // if (subtitleTimerRef.current) {
      //   clearTimeout(subtitleTimerRef.current);
      // }

      // clearTimeout(subtitleTimerRef.current);

      // subtitleTimerRef.current = setTimeout(() => {
      //   setVoiceSubtitle(null);
      // }, 7000);

      setVoiceSubtitle(data);

      clearTimeout(subtitleTimerRef.current);

      subtitleTimerRef.current = setTimeout(() => {
        if (voiceSubtitle?.text === data.text) {
          setVoiceSubtitle(null);
        }
      }, 4000);
    });

    return () => {
      mounted = false;

      stopAudioStreaming();

      clearTimeout(subtitleTimerRef.current);

      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }

      if (socket) {
        socket.off("online-users");
        socket.off("matched");
        socket.off("ready");
        socket.off("signal");
        socket.off("chat-message");
        socket.off("edit-message");
        socket.off("typing");
        socket.off("message-delivered");
        socket.off("message-seen");
        socket.off("partner-left");
        socket.off("next-blocked");
        socket.off("voice-subtitle");

        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (showChat) {
      messages.forEach((msg) => {
        if (msg.sender !== socketRef.current.id && msg.status !== "seen") {
          socketRef.current.emit("message-seen", msg.id);
        }
      });
    }
  }, [showChat]);

  async function nextChat() {
    setStatus("Looking for someone...");
    setMessages([]);

    shouldRestartRecognitionRef.current = false;

    stopAudioStreaming();
    setVoiceSubtitle("");

    if (pcRef.current) {
      pcRef.current.ontrack = null;
      pcRef.current.onicecandidate = null;
      pcRef.current.close();
      pcRef.current = null;
    }

    if (remoteVideo.current?.srcObject) {
      remoteVideo.current.srcObject.getTracks().forEach((t) => t.stop());
      remoteVideo.current.srcObject = null;
    }
    await createPeer();

    socketRef.current.emit("next");
  }

  function sendMessage(e) {
    e.preventDefault();
    if (!text.trim()) return;

    const message = {
      id: uuid(),
      sender: socketRef.current.id,
      text,
      status: "sent",
    };

    socketRef.current.emit("chat-message", message);
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
          sender: socketRef.current.id,
          type: "audio",
          audio: reader.result,
          status: "sent",
        };

        socketRef.current.emit("chat-message", message);
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

      const muted = !audioTrack.enabled;

      setIsMuted(muted);

      // STOP speech recognition when muted
      if (muted) {
        shouldRestartRecognitionRef.current = false;

        stopAudioStreaming();
        recognitionRef.current = null;

        console.log("🎤 Speech recognition stopped");
      } else {
        // RESTART speech recognition when unmuted
        shouldRestartRecognitionRef.current = true;

        setTimeout(() => {
          if (!recognitionRef.current) {
            startAudioStreaming();
          }
        }, 500);

        console.log("🎤 Speech recognition restarted");
      }
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
      const videoTrack = streamRef.current
        .getTracks()
        .find((track) => track.kind === "video");

      if (videoTrack) videoTrack.stop();

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: newFacingMode },
        audio: false,
      });

      const newVideoTrack = newStream.getVideoTracks()[0];

      const sender = pcRef.current
        ?.getSenders()
        .find((s) => s.track?.kind === "video");

      if (sender) {
        await sender.replaceTrack(newVideoTrack);
      }

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
    socketRef.current.disconnect();
    window.location.href = "/";
  }

  function handleImage(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const message = {
        id: crypto.randomUUID(),
        sender: socketRef.current.id,
        type: "image",
        image: reader.result,
        status: "sent",
      };

      socketRef.current.emit("chat-message", message);
      setMessages((prev) => [...prev, message]);
    };

    reader.readAsDataURL(file);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white relative flex flex-col items-center justify-center overflow-hidden">
      {!(isMobile && showChat) && (
        <div className="absolute top-4 text-center">
          <h1 className="text-2xl font-bold tracking-wide">
            Flirta
            {/* <span className="text-pink-500">(Formerly Ayvaus)</span> */}
          </h1>

          <p className="text-sm text-green-400">
            🟢 {onlineCount} Users Online
          </p>

          <p className="text-xs text-gray-400">{status}</p>
        </div>
      )}

      <div className="relative isolate w-full h-screen flex items-center justify-center">
        <video
          controls={false}
          ref={remoteVideo}
          autoPlay
          playsInline
          onClick={() => {
            if (isMobile && showChat) {
              setIsExpanded((prev) => !prev);
            }
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className={`object-cover transition-all duration-300 ${
            isMobile && showChat
              ? isExpanded
                ? "fixed inset-0 z-[999] w-full h-full"
                : "fixed z-[999] w-32 h-44 rounded-xl border-2 border-white shadow-2xl"
              : "w-full h-full"
          }`}
          style={
            isMobile && showChat && !isExpanded
              ? {
                  top: position.y || 16,
                  left: position.x || window.innerWidth - 140,
                }
              : {}
          }
        />

        <div
          className={`absolute bottom-44 right-6 w-32 h-44 md:w-40 md:h-56 rounded-xl overflow-hidden border-2 border-white shadow-xl transition-all duration-300 ${
            isMobile && showChat ? "hidden" : "block"
          }`}
        >
          <video
            ref={localVideo}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover scale-x-[-1]"
          />
        </div>
      </div>

      {voiceSubtitle?.text && (
        <div
          key={voiceSubtitle?.text}
          className="pointer-events-none fixed z-[999999] bottom-[150px] left-1/2 -translate-x-1/2 w-[90%] max-w-2xl opacity-100 scale-100"
        >
          <div className="mx-auto px-4 py-2 rounded-2xl bg-black/70 backdrop-blur-xl border border-white/10 shadow-2xl">
            {/* <p className="text-center text-white font-semibold text-base md:text-lg leading-snug tracking-wide drop-shadow">
              {voiceSubtitle?.text}
            </p> */}
            <p className="text-center text-white font-extrabold text-lg md:text-xl leading-snug tracking-wide drop-shadow">
              {voiceSubtitle?.text}
            </p>
          </div>
        </div>
      )}

      {isMobile ? (
        showChat && (
          <div className="fixed inset-0 z-[900] flex flex-col bg-black/70 ">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-black/50 backdrop-blur-md">
              <div>
                <h2 className="text-sm font-semibold">Stranger</h2>
                <p className="text-xs text-green-400">{status}</p>
              </div>

              <button onClick={() => setShowChat(false)} className="text-xl">
                ✖
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
              {messages.map((m, i) => (
                <div
                  key={m.id || i}
                  className={`flex ${
                    m.sender === socketRef.current.id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`px-3 py-2 rounded-2xl max-w-[75%] text-sm shadow ${
                      m.sender === socketRef.current.id
                        ? "bg-green-500 text-black rounded-br-none"
                        : "bg-white/80 text-black rounded-bl-none"
                    }`}
                  >
                    {m.type === "image" ? (
                      <img src={m.image} className="rounded-lg max-w-[200px]" />
                    ) : m.type === "audio" ? (
                      <audio controls src={m.audio} />
                    ) : (
                      <span>{m.text}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {typing && <p className="text-xs text-gray-300 px-3">Typing...</p>}

            <form
              onSubmit={sendMessage}
              className="flex items-center gap-2 px-3 py-2 bg-black/60 backdrop-blur-md"
            >
              <input
                type="file"
                accept="image/*"
                hidden
                id="mobileImageUpload"
                onChange={handleImage}
              />
              <label
                htmlFor="mobileImageUpload"
                className="text-xl cursor-pointer"
              >
                📎
              </label>

              <input
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  socketRef.current.emit("typing");
                }}
                className="flex-1 px-4 py-2 rounded-full bg-gray-800 text-sm outline-none"
                placeholder="Message"
              />

              {text.trim() ? (
                <button className="bg-green-500 text-black px-4 py-2 rounded-full">
                  ➤
                </button>
              ) : (
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  className="text-xl"
                >
                  🎤
                </button>
              )}
            </form>
          </div>
        )
      ) : (
        <div
          className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-gray-900/95 backdrop-blur-lg shadow-2xl transform transition-transform duration-300 z-50 ${
            showChat ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
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
                    m.sender === socketRef.current.id
                      ? "bg-blue-600 ml-auto"
                      : "bg-gray-700 mr-auto"
                  }`}
                >
                  <div className="flex items-end gap-1">
                    {m.type === "image" ? (
                      <img src={m.image} className="rounded-lg max-w-xs" />
                    ) : m.type === "audio" ? (
                      <audio controls src={m.audio} className="max-w-xs" />
                    ) : (
                      <span>{m.text}</span>
                    )}

                    {m.edited && (
                      <span className="text-xs italic text-gray-300 ml-1">
                        edited
                      </span>
                    )}

                    {m.sender === socketRef.current.id && (
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

                    {m.sender === socketRef.current.id && (
                      <button
                        onClick={() => {
                          const newText = prompt("Edit message", m.text);
                          if (!newText) return;

                          socketRef.current.emit("edit-message", {
                            id: m.id,
                            newText,
                          });
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
                  socketRef.current.emit("typing");
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
      )}

      {!(isMobile && showChat) && (
        <div
          className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[95%] max-w-lg bg-black/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 px-4 py-3 flex flex-col gap-3"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="flex justify-center">
            <select
              value={language}
              onChange={(e) => {
                const newLang = e.target.value;

                setLanguage(newLang);

                localStorage.setItem("subtitle_language", newLang);
                socketRef.current.emit("update-language", newLang);
              }}
              className="bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg border border-white/10"
            >
              <option value="en-US">English</option>
              <option value="hi-IN">Hindi</option>
              <option value="bn-IN">Bengali</option>
              <option value="ta-IN">Tamil</option>
              <option value="te-IN">Telugu</option>
              <option value="mr-IN">Marathi</option>
              <option value="gu-IN">Gujarati</option>
              <option value="kn-IN">Kannada</option>
              <option value="ml-IN">Malayalam</option>
              <option value="pa-IN">Punjabi</option>
              <option value="ur-IN">Urdu</option>
              <option value="or-IN">Odia</option>

              {/* Foreign Languages */}
              <option value="es-ES">Spanish</option>
              <option value="fr-FR">French</option>
              <option value="de-DE">German</option>
              <option value="it-IT">Italian</option>
              <option value="ru-RU">Russian</option>
              <option value="ja-JP">Japanese</option>
              <option value="ko-KR">Korean</option>
              <option value="zh-CN">Chinese</option>
            </select>
          </div>

          <div className="flex justify-between items-center w-full">
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

            <div className="flex flex-col items-center text-xs text-white">
              <button
                onClick={switchCamera}
                className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center"
              >
                🔄
              </button>
              <span className="mt-1 text-gray-300">Flip</span>
            </div>

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
      )}
    </div>
  );
}
