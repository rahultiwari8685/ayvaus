"use client";

import { useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import { useSocket } from "@/context/SocketContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
function getOrCreateUserId() {
  let userId = localStorage.getItem("flirtaus_user_id");

  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem("flirtaus_user_id", userId);
  }

  return userId;
}

export default function MatchPage() {
  // const { socket } = useSocket();
  const { socket, reconnectWithAuth } = useSocket();

  const socketRef = useRef(null);
  const localVideo = useRef(null);
  const remoteVideo = useRef(null);
  const pcRef = useRef(null);
  const streamRef = useRef(null);
  const roleRef = useRef(null);
  const sessionIdRef = useRef(null);
  const iceQueueRef = useRef([]);

  const audioContextRef = useRef(null);
  const workletNodeRef = useRef(null);
  const sourceRef = useRef(null);

  const deepgramReadyRef = useRef(false);

  const subtitleTimerRef = useRef(null);

  const [voiceSubtitle, setVoiceSubtitle] = useState(null);

  const [language, setLanguage] = useState("en-US");

  const languageRef = useRef("en-US");

  useEffect(() => {
    languageRef.current = language;
  }, [language]);

  useEffect(() => {
    const savedLang = localStorage.getItem("subtitle_language");

    if (savedLang) {
      setLanguage(savedLang);
      languageRef.current = savedLang;
    }
  }, []);

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
  const [isMobile, setIsMobile] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const draggingRef = useRef(false);
  const [partner, setPartner] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  function convertFloat32ToInt16(buffer) {
    const out = new Int16Array(buffer.length);

    for (let i = 0; i < buffer.length; i++) {
      let sample = Math.max(-1, Math.min(1, buffer[i]));

      out[i] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
    }

    return out.buffer;
  }

  async function startRemoteSubtitle(remoteAudioTrack) {
    if (!remoteAudioTrack) {
      console.log("❌ No remote audio track");
      return;
    }

    if (remoteAudioTrack.kind !== "audio") {
      console.log("❌ Track is not audio:", remoteAudioTrack.kind);
      return;
    }

    if (audioContextRef.current) {
      console.log("⚠️ Remote subtitle audio already started");
      return;
    }

    console.log("🎧 Starting REMOTE audio subtitle:", {
      trackId: remoteAudioTrack.id,
      label: remoteAudioTrack.label,
    });

    try {
      const audioContext = new AudioContext({
        sampleRate: 48000,
      });

      await audioContext.resume();

      console.log("🎧 AudioContext Sample Rate:", audioContext.sampleRate);

      await audioContext.audioWorklet.addModule("/audio-worklet.js");

      audioContextRef.current = audioContext;

      const remoteAudioStream = new MediaStream([remoteAudioTrack]);

      const source = audioContext.createMediaStreamSource(remoteAudioStream);

      sourceRef.current = source;

      const worklet = new AudioWorkletNode(audioContext, "audio-processor");

      workletNodeRef.current = worklet;

      source.connect(worklet);

      // Keep remote audio audible
      const gainNode = audioContext.createGain();

      gainNode.gain.value = 1;

      source.connect(gainNode);

      gainNode.connect(audioContext.destination);

      worklet.port.onmessage = (event) => {
        if (!deepgramReadyRef.current) {
          return;
        }

        if (!socketRef.current?.connected) {
          return;
        }

        const pcm = convertFloat32ToInt16(event.data);

        if (!pcm || pcm.byteLength === 0) {
          return;
        }

        socketRef.current.emit("audio-stream", new Uint8Array(pcm));
      };

      console.log("✅ REMOTE audio -> Deepgram started");
    } catch (err) {
      console.error("❌ Remote subtitle audio error:", err);

      audioContextRef.current = null;
    }
  }

  function stopAudioStreaming() {
    console.log("🛑 Stopping remote audio subtitle streaming");

    if (workletNodeRef.current) {
      try {
        workletNodeRef.current.port.onmessage = null;
        workletNodeRef.current.disconnect();
      } catch (err) {
        console.log("⚠️ Worklet cleanup error:", err);
      }

      workletNodeRef.current = null;
    }

    if (sourceRef.current) {
      try {
        sourceRef.current.disconnect();
      } catch (err) {
        console.log("⚠️ Source cleanup error:", err);
      }

      sourceRef.current = null;
    }

    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (err) {
        console.log("⚠️ AudioContext cleanup error:", err);
      }

      audioContextRef.current = null;
    }

    console.log("✅ Remote audio subtitle streaming stopped");
  }

  async function initCamera() {
    if (streamRef.current) return;

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
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

  // async function createPeer() {
  //   iceQueueRef.current = [];

  //   if (!streamRef.current) return;

  //   if (pcRef.current) {
  //     pcRef.current.close();
  //     pcRef.current = null;
  //   }

  async function createPeer() {
    console.log("🔵 createPeer START", {
      socketId: socketRef.current?.id,
      sessionId: sessionIdRef.current,
      hasStream: !!streamRef.current,
    });

    iceQueueRef.current = [];

    if (!streamRef.current) {
      console.log("❌ createPeer aborted: camera stream missing");
      return;
    }

    if (pcRef.current) {
      console.log("♻️ Closing old PeerConnection");

      pcRef.current.ontrack = null;
      pcRef.current.onicecandidate = null;
      pcRef.current.oniceconnectionstatechange = null;

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

    pc.ontrack = async (event) => {
      console.log("📡 REMOTE TRACK RECEIVED:", {
        kind: event.track.kind,
        id: event.track.id,
        label: event.track.label,
      });

      if (!remoteVideo.current.srcObject) {
        remoteVideo.current.srcObject = new MediaStream();
      }

      remoteVideo.current.srcObject.addTrack(event.track);

      if (event.track.kind === "audio" && !audioContextRef.current) {
        console.log("🎧 Starting subtitle from REMOTE audio");

        await startRemoteSubtitle(event.track);
      }
    };

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        // socketRef.current.emit("signal", { candidate: e.candidate });
        socketRef.current.emit("signal", {
          sessionId: sessionIdRef.current,
          candidate: e.candidate,
        });
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
        socketRef.current.emit("next");
      }
    };

    pcRef.current = pc;
  }

  useEffect(() => {
    if (!socket) return;

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Login required");
      window.location.href = "/serious/login";
      return;
    }

    socketRef.current = socket;
    reconnectWithAuth();
    socketRef.current.on("deepgram-ready", () => {
      console.log("✅ Serious Mode Deepgram Ready");

      deepgramReadyRef.current = true;
    });

    (async () => {
      await initCamera();

      const joinSeriousMode = () => {
        console.log("❤️ Joining Serious Mode");
        console.log("Socket ID:", socketRef.current?.id);
        console.log("Socket connected:", socketRef.current?.connected);

        const reconnectPartnerId = localStorage.getItem("reconnect_partner_id");

        if (reconnectPartnerId) {
          console.log("🔄 Reconnecting with partner:", reconnectPartnerId);

          socketRef.current.emit("reconnect-user", {
            token,
            partnerId: reconnectPartnerId,
          });

          localStorage.removeItem("reconnect_partner_id");
        } else {
          console.log("🔎 Searching Serious Mode:", languageRef.current);

          socketRef.current.emit("join", {
            language: languageRef.current,
          });
        }

        socketRef.current.emit("get-online-count");
      };

      if (socketRef.current.connected) {
        joinSeriousMode();
      } else {
        socketRef.current.once("connect", joinSeriousMode);
      }
    })();

    socketRef.current.on("online-users", (count) => {
      console.log("👥 Online received:", count);

      if (typeof count === "number" && count >= 0) {
        setOnlineCount(count);
      }
    });

    // socketRef.current.on("matched", async ({ role, partner, sessionId }) => {
    //   console.log("🎯 MATCHED:", {
    //     role,
    //     partner,
    //   });

    //   setPartner(partner);
    //   roleRef.current = role;
    //   sessionIdRef.current = sessionId;

    //   console.log("🆔 SESSION ID:", sessionId);
    //   setStatus("Connecting...");

    //   try {
    //     if (!pcRef.current) {
    //       await createPeer();
    //     }

    //     if (role === "callee") {
    //       console.log("📡 CALLEE → sending ready");
    //       socketRef.current.emit("ready");
    //     }
    //   } catch (err) {
    //     console.error("❌ Failed to create peer after match:", err);

    //     setStatus("Looking for someone...");
    //     socketRef.current.emit("next");
    //   }
    // });

    socketRef.current.on("matched", async ({ role, partner, sessionId }) => {
      console.log("🎯 MATCHED:", {
        role,
        partner,
        sessionId,
      });

      setPartner(partner);
      roleRef.current = role;
      sessionIdRef.current = sessionId;

      setStatus("Connecting...");

      try {
        // Always create a fresh PeerConnection for a new match
        if (pcRef.current) {
          pcRef.current.close();
          pcRef.current = null;
        }

        iceQueueRef.current = [];

        await createPeer();

        console.log("✅ PeerConnection ready:", {
          role,
          sessionId,
          socketId: socketRef.current?.id,
        });

        // Callee tells caller that its PeerConnection is ready
        if (role === "callee") {
          console.log("📡 CALLEE → sending ready");

          socketRef.current.emit("ready", {
            sessionId: sessionIdRef.current,
          });
        }
      } catch (err) {
        console.error("❌ Failed to create peer after match:", err);

        setStatus("Looking for someone...");

        socketRef.current.emit("next");
      }
    });

    // socketRef.current.on("ready", async () => {
    //   if (roleRef.current !== "caller") return;
    //   if (!pcRef.current) return;

    //   const offer = await pcRef.current.createOffer();
    //   await pcRef.current.setLocalDescription(offer);
    //   socketRef.current.emit("signal", {
    //     sessionId: sessionIdRef.current,
    //     offer,
    //   });
    // });

    socketRef.current.on("ready", async ({ sessionId } = {}) => {
      console.log("📡 READY received:", {
        myRole: roleRef.current,
        sessionId,
        currentSession: sessionIdRef.current,
        hasPeer: !!pcRef.current,
      });

      if (roleRef.current !== "caller") {
        console.log("⚠️ READY ignored: I am not caller");
        return;
      }

      if (
        sessionId &&
        sessionIdRef.current &&
        sessionId !== sessionIdRef.current
      ) {
        console.log("⚠️ READY ignored: session mismatch");
        return;
      }

      // Wait until PeerConnection exists
      if (!pcRef.current) {
        console.log("⏳ PeerConnection not ready, retrying...");

        setTimeout(async () => {
          if (!pcRef.current || roleRef.current !== "caller") return;

          try {
            const offer = await pcRef.current.createOffer();

            await pcRef.current.setLocalDescription(offer);

            socketRef.current.emit("signal", {
              sessionId: sessionIdRef.current,
              offer,
            });

            console.log("📤 OFFER sent after retry");
          } catch (err) {
            console.error("❌ Offer retry failed:", err);
          }
        }, 100);

        return;
      }

      try {
        const offer = await pcRef.current.createOffer();

        await pcRef.current.setLocalDescription(offer);

        socketRef.current.emit("signal", {
          sessionId: sessionIdRef.current,
          offer,
        });

        console.log("📤 OFFER sent");
      } catch (err) {
        console.error("❌ Offer creation failed:", err);
      }
    });

    socketRef.current.on("signal", async (data) => {
      // if (!pcRef.current) {
      //   console.log("⚠️ Signal received before PeerConnection ready:", {
      //     offer: !!data.offer,
      //     answer: !!data.answer,
      //     candidate: !!data.candidate,
      //   });

      //   return;
      // }

      if (!pcRef.current) {
        console.log("⏳ Signal received before PeerConnection ready");

        setTimeout(() => {
          if (!pcRef.current) {
            console.log("❌ PeerConnection still not ready for signal");
            return;
          }

          socketRef.current.emit("signal-retry", data);
        }, 100);

        return;
      }

      try {
        if (data.offer) {
          await pcRef.current.setRemoteDescription(
            new RTCSessionDescription(data.offer),
          );

          while (iceQueueRef.current.length > 0) {
            await pcRef.current.addIceCandidate(iceQueueRef.current.shift());
          }

          const answer = await pcRef.current.createAnswer();
          await pcRef.current.setLocalDescription(answer);

          socketRef.current.emit("signal", {
            sessionId: sessionIdRef.current,
            answer,
          });
        }

        if (data.answer) {
          await pcRef.current.setRemoteDescription(
            new RTCSessionDescription(data.answer),
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

    socketRef.current.on("chat-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
      socketRef.current.emit("message-delivered", msg.id);

      if (!showChat) {
        setUnreadCount((prev) => prev + 1);
      }
    });

    socketRef.current.on("edit-message", ({ id, newText }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, text: newText, edited: true } : m,
        ),
      );
    });

    socketRef.current.on("message-delivered", (messageId) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId ? { ...m, status: "delivered" } : m,
        ),
      );
    });

    socketRef.current.on("typing", () => {
      setTyping(true);

      setTimeout(() => {
        setTyping(false);
      }, 2000);
    });

    socketRef.current.on("message-seen", (messageId) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, status: "seen" } : m)),
      );
    });

    socketRef.current.on("voice-subtitle", (data) => {
      console.log("📝 Serious Subtitle:", data);

      setVoiceSubtitle(data);

      clearTimeout(subtitleTimerRef.current);

      subtitleTimerRef.current = setTimeout(() => {
        setVoiceSubtitle(null);
      }, 4000);
    });

    socketRef.current.on("partner-left", () => {
      deepgramReadyRef.current = false;

      stopAudioStreaming();

      clearTimeout(subtitleTimerRef.current);

      setVoiceSubtitle(null);

      setStatus("Looking for someone...");

      setMessages([]);
      setUnreadCount(0);
      setPartner(null);

      roleRef.current = null;

      if (remoteVideo.current) {
        remoteVideo.current.srcObject = null;
      }

      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }

      if (remoteVideo.current?.srcObject) {
        remoteVideo.current.srcObject.getTracks().forEach((t) => t.stop());
        remoteVideo.current.srcObject = null;
      }

      setTimeout(() => {
        if (!socketRef.current?.connected) {
          console.log("⚠️ Socket not connected, cannot rejoin");
          return;
        }

        socketRef.current.emit("join", {
          language: languageRef.current,
        });

        console.log("🚀 Rejoined matchmaking queue");
      }, 100);
    });

    socketRef.current.on("next-blocked", () => {
      alert("Please wait before skipping again.");
    });

    return () => {
      deepgramReadyRef.current = false;

      stopAudioStreaming();

      clearTimeout(subtitleTimerRef.current);

      setVoiceSubtitle(null);

      pcRef.current?.close();
      streamRef.current?.getTracks().forEach((t) => t.stop());
      socketRef.current.off("online-users");
      socketRef.current.off("matched");
      socketRef.current.off("ready");
      socketRef.current.off("signal");
      socketRef.current.off("chat-message");
      socketRef.current.off("edit-message");
      socketRef.current.off("message-delivered");
      socketRef.current.off("typing");
      socketRef.current.off("message-seen");
      socketRef.current.off("partner-left");
      socketRef.current.off("next-blocked");
    };
  }, [socket]);

  useEffect(() => {
    if (showChat) {
      messages.forEach((msg) => {
        if (msg.sender !== socketRef.current.id && msg.status !== "seen") {
          socketRef.current.emit("message-seen", msg.id);
        }
      });
    }
  }, [showChat]);

  useEffect(() => {
    if (!socket) return;

    //     socket.on("reward-earned", (reward) => {
    //       alert(`
    // 🎉 ${reward.title}

    // ⭐ +${reward.xp} XP
    // 🪙 +${reward.coins} Coins
    // 💸 +${reward.fragments} Fragments

    // Level ${reward.level}
    //     `);
    //     });

    socket.on("reward-earned", async (reward) => {
      toast.custom(() => (
        <div className="bg-zinc-900 border border-pink-500 rounded-2xl shadow-2xl p-5 w-80">
          <h2 className="text-pink-400 font-bold text-lg">🎉 {reward.title}</h2>

          <div className="mt-4 space-y-2 text-white">
            <p>⭐ +{reward.xp} XP</p>

            <p>🪙 +{reward.coins} Coins</p>

            <p>💸 +{reward.fragments} Fragments</p>
          </div>

          <div className="mt-4 text-green-400 font-semibold">
            Level {reward.level}
          </div>
        </div>
      ));
      setTimeout(() => {
        router.push("/serious/dashboard");
      }, 2500);
    });

    return () => {
      socket.off("reward-earned");
    };
  }, [socket]);

  async function nextChat() {
    setStatus("Looking for someone...");

    deepgramReadyRef.current = false;

    stopAudioStreaming();

    clearTimeout(subtitleTimerRef.current);

    setVoiceSubtitle(null);
    setMessages([]);
    setUnreadCount(0);
    setPartner(null);
    roleRef.current = null;
    if (remoteVideo.current) {
      remoteVideo.current.srcObject = null;
    }
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
    // await createPeer();

    socketRef.current.emit("next");
  }

  function sendMessage(e) {
    e.preventDefault();

    const messageText = text.trim();

    if (!messageText) return;

    const message = {
      id: uuid(),
      sender: socketRef.current.id,
      text: messageText,
      status: "sent",
      createdAt: Date.now(),
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
          createdAt: Date.now(),
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

  const exitChat = () => {
    socket.emit("end-call");

    setTimeout(() => {
      router.push("/serious/dashboard");
    }, 1000);
  };

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
        createdAt: Date.now(),
      };

      socketRef.current.emit("chat-message", message);
      setMessages((prev) => [...prev, message]);
    };

    reader.readAsDataURL(file);
  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/serious/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white relative flex flex-col items-center justify-center overflow-hidden">
      {!(isMobile && showChat) && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 shadow-lg">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>

            <p className="text-sm text-white font-semibold">
              ❤️ {onlineCount} online
            </p>
          </div>
        </div>
      )}

      <div className="relative w-full h-screen flex items-center justify-center">
        <video
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
          className={`absolute bottom-28 right-6 w-32 h-44 md:w-40 md:h-56 rounded-xl overflow-hidden border-2 border-white shadow-xl transition-all duration-300 ${
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
          key={voiceSubtitle.text}
          className="pointer-events-none fixed z-[999999] bottom-[150px] left-1/2 -translate-x-1/2 w-[90%] max-w-2xl"
        >
          <div className="mx-auto px-4 py-2 rounded-2xl bg-black/70 backdrop-blur-xl border border-white/10 shadow-2xl">
            <p className="text-center text-white font-extrabold text-lg md:text-xl leading-snug tracking-wide drop-shadow">
              {voiceSubtitle.text}
            </p>
          </div>
        </div>
      )}

      {isMobile ? (
        showChat && (
          <div className="fixed inset-0 z-[1000] bg-[#07070a] text-white flex flex-col">
            <div className="shrink-0 px-4 py-3 border-b border-white/[0.08] bg-black/50 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                {/* Close */}
                <button
                  onClick={() => setShowChat(false)}
                  className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center text-white/70 transition"
                >
                  ←
                </button>

                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-sm font-bold">
                    F
                  </div>

                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#07070a]" />
                </div>

                {/* User */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-semibold text-white">Stranger</h2>

                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />

                    <span className="text-[10px] text-emerald-400">
                      {status === "Connected" ? "Connected" : status}
                    </span>
                  </div>
                </div>

                {/* More */}
                <button
                  type="button"
                  className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center text-white/60"
                >
                  ⋮
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3">
              {messages.length > 0 && (
                <div className="flex items-center gap-3 py-2">
                  <div className="h-px flex-1 bg-white/[0.06]" />

                  <span className="text-[9px] uppercase tracking-wider text-white/30">
                    Today
                  </span>

                  <div className="h-px flex-1 bg-white/[0.06]" />
                </div>
              )}

              {messages.map((m, i) => {
                const isMine = m.sender === socketRef.current.id;

                return (
                  <div
                    key={m.id || i}
                    className={`flex ${
                      isMine ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[78%] overflow-hidden ${
                        isMine
                          ? "bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl rounded-br-md"
                          : "bg-white/[0.07] border border-white/[0.08] rounded-2xl rounded-bl-md"
                      }`}
                    >
                      {/* IMAGE */}
                      {m.type === "image" ? (
                        <img
                          src={m.image}
                          alt="Shared image"
                          className="max-w-[240px] max-h-[300px] w-auto object-cover"
                        />
                      ) : m.type === "audio" ? (
                        /* AUDIO */
                        <div className="p-3">
                          <audio
                            controls
                            src={m.audio}
                            className="w-[220px] max-w-full"
                          />
                        </div>
                      ) : (
                        /* TEXT */
                        <div className="px-4 py-2.5">
                          <p className="text-sm leading-relaxed break-words">
                            {m.text}
                          </p>

                          {m.edited && (
                            <span className="text-[9px] italic opacity-50 ml-1">
                              edited
                            </span>
                          )}
                        </div>
                      )}

                      {/* TIME + STATUS */}
                      <div
                        className={`px-3 pb-2 flex items-center justify-end gap-1 ${
                          m.type === "image" ? "pt-1" : ""
                        }`}
                      >
                        <span className="text-[9px] opacity-40">
                          {new Date(
                            m.createdAt || Date.now(),
                          ).toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </span>

                        {isMine && (
                          <span
                            className={`text-[10px] ${
                              m.status === "seen"
                                ? "text-cyan-300"
                                : "text-white/50"
                            }`}
                          >
                            {m.status === "sent" && "✓"}
                            {m.status === "delivered" && "✓✓"}
                            {m.status === "seen" && "✓✓"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* TYPING */}
              {typing && (
                <div className="flex items-center gap-2 px-2 py-2">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-bounce" />

                    <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-bounce [animation-delay:150ms]" />

                    <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-bounce [animation-delay:300ms]" />
                  </div>

                  <span className="text-[10px] text-white/40">
                    Stranger is typing
                  </span>
                </div>
              )}
            </div>

            <form
              onSubmit={sendMessage}
              className="shrink-0 p-3 border-t border-white/[0.08] bg-black/50 backdrop-blur-xl"
            >
              <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/[0.06] border border-white/[0.08]">
                {/* IMAGE */}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  id="mobileImageUpload"
                  onChange={handleImage}
                />

                <label
                  htmlFor="mobileImageUpload"
                  className="w-9 h-9 shrink-0 rounded-xl hover:bg-white/10 flex items-center justify-center cursor-pointer text-white/60 transition"
                >
                  +
                </label>

                {/* TEXT */}
                <input
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    socketRef.current?.emit("typing");
                  }}
                  className="flex-1 min-w-0 bg-transparent outline-none text-sm text-white placeholder:text-white/30"
                  placeholder="Write a message..."
                />

                {/* MIC */}
                {!text.trim() && (
                  <button
                    type="button"
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition ${
                      isRecording
                        ? "bg-red-500 text-white"
                        : "hover:bg-white/10 text-white/60"
                    }`}
                  >
                    🎤
                  </button>
                )}

                {text.trim() && (
                  <button
                    type="submit"
                    className="w-9 h-9 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center font-bold shadow-lg shadow-pink-500/20"
                  >
                    ➤
                  </button>
                )}
              </div>
            </form>
          </div>
        )
      ) : (
        <div
          className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-[#07070a]/95 backdrop-blur-xl shadow-2xl border-l border-white/[0.08] transform transition-transform duration-300 z-50 ${
            showChat ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="px-4 py-3 border-b border-white/[0.08] bg-black/30 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                {/* Back */}
                <button
                  onClick={() => setShowChat(false)}
                  className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center text-white/70 transition"
                >
                  ←
                </button>

                {/* Avatar */}
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-sm font-bold">
                    F
                  </div>

                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-gray-900" />
                </div>

                {/* User */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-semibold text-white">Stranger</h2>

                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />

                    <span className="text-[11px] text-emerald-400">
                      {status}
                    </span>
                  </div>
                </div>

                {/* More */}
                <button
                  type="button"
                  className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center text-white/60"
                >
                  ⋮
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length > 0 && (
                <div className="flex items-center gap-3 py-2">
                  <div className="h-px flex-1 bg-white/[0.06]" />

                  <span className="text-[9px] uppercase tracking-wider text-white/30">
                    Today
                  </span>

                  <div className="h-px flex-1 bg-white/[0.06]" />
                </div>
              )}

              {messages.map((m, i) => {
                const isMine = m.sender === socketRef.current.id;

                return (
                  <div
                    key={m.id || i}
                    className={`flex ${
                      isMine ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[78%] overflow-hidden ${
                        isMine
                          ? "bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl rounded-br-md"
                          : "bg-white/[0.07] border border-white/[0.08] rounded-2xl rounded-bl-md"
                      }`}
                    >
                      {/* IMAGE */}
                      {m.type === "image" ? (
                        <img
                          src={m.image}
                          alt="Shared image"
                          className="max-w-[240px] max-h-[300px] w-auto object-cover"
                        />
                      ) : m.type === "audio" ? (
                        /* AUDIO */
                        <div className="p-3">
                          <audio
                            controls
                            src={m.audio}
                            className="w-[220px] max-w-full"
                          />
                        </div>
                      ) : (
                        /* TEXT */
                        <div className="px-4 py-2.5">
                          <p className="text-sm leading-relaxed break-words">
                            {m.text}
                          </p>

                          {m.edited && (
                            <span className="text-[9px] italic opacity-50 ml-1">
                              edited
                            </span>
                          )}
                        </div>
                      )}

                      {/* TIME + STATUS */}
                      <div
                        className={`px-3 pb-2 flex items-center justify-end gap-1 ${
                          m.type === "image" ? "pt-1" : ""
                        }`}
                      >
                        <span className="text-[9px] opacity-40">
                          {new Date(
                            m.createdAt || Date.now(),
                          ).toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </span>

                        {isMine && (
                          <span
                            className={`text-[10px] ${
                              m.status === "seen"
                                ? "text-cyan-300"
                                : "text-white/50"
                            }`}
                          >
                            {m.status === "sent" && "✓"}
                            {m.status === "delivered" && "✓✓"}
                            {m.status === "seen" && "✓✓"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {typing && (
              <div className="flex items-center gap-2 px-4 pb-3">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-bounce" />

                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-bounce [animation-delay:150ms]" />

                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-bounce [animation-delay:300ms]" />
                </div>

                <span className="text-[10px] text-white/40">
                  Stranger is typing
                </span>
              </div>
            )}

            <form
              onSubmit={sendMessage}
              className="shrink-0 p-3 border-t border-white/[0.08] bg-black/50 backdrop-blur-xl"
            >
              <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/[0.06] border border-white/[0.08]">
                {/* IMAGE */}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  id="imageUpload"
                  onChange={handleImage}
                />

                <label
                  htmlFor="imageUpload"
                  className="w-9 h-9 shrink-0 rounded-xl hover:bg-white/10 flex items-center justify-center cursor-pointer text-white/60 transition"
                >
                  +
                </label>

                {/* TEXT */}
                <input
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    socketRef.current?.emit("typing");
                  }}
                  className="flex-1 min-w-0 bg-transparent outline-none text-sm text-white placeholder:text-white/30"
                  placeholder="Write a message..."
                />

                {/* MICROPHONE */}
                {!text.trim() && (
                  <button
                    type="button"
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition ${
                      isRecording
                        ? "bg-red-500 text-white"
                        : "hover:bg-white/10 text-white/60"
                    }`}
                  >
                    🎤
                  </button>
                )}

                {/* SEND */}
                {text.trim() && (
                  <button
                    type="submit"
                    className="w-9 h-9 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center font-bold shadow-lg shadow-pink-500/20"
                  >
                    ➤
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {!(isMobile && showChat) && (
        <div
          className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[95%] max-w-lg bg-black/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 px-4 py-3 flex flex-col gap-3 z-50"
          style={{
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
        >
          <div className="flex items-center justify-between gap-3 w-full">
            {/* STRANGER INFO */}
            <div className="min-w-0 flex-1">
              {partner ? (
                <div className="flex items-center gap-2 min-w-0">
                  <div className="min-w-0">
                    <p className="text-white font-semibold text-sm truncate">
                      ❤️ {partner.name}({partner.gender}), {partner.age}
                    </p>

                    {/* <p className="text-gray-400 text-xs truncate">
                      {partner.gender}
                    </p> */}
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-xs truncate">
                  Searching for match...
                </p>
              )}
            </div>

            <div className="flex-shrink-0">
              <select
                value={language}
                onChange={(e) => {
                  const newLang = e.target.value;

                  setLanguage(newLang);

                  languageRef.current = newLang;

                  localStorage.setItem("subtitle_language", newLang);

                  socketRef.current.emit("update-language", newLang);
                }}
                className="bg-gray-800 text-white text-xs px-3 py-2 rounded-lg border border-white/10 outline-none w-[150px]"
              >
                <option value="hi-IN">Hindi</option>
                <option value="bn-IN">Bengali</option>
                <option value="te-IN">Telugu</option>
                <option value="mr-IN">Marathi</option>
                <option value="ta-IN">Tamil</option>
                <option value="ur-IN">Urdu</option>
                <option value="gu-IN">Gujarati</option>
                <option value="kn-IN">Kannada</option>
                <option value="ml-IN">Malayalam</option>
                <option value="or-IN">Odia</option>
                <option value="pa-IN">Punjabi</option>
                <option value="as-IN">Assamese</option>
                <option value="ma-IN">Maithili</option>
                <option value="sa-IN">Sanskrit</option>
                <option value="ne-IN">Nepali</option>
                <option value="kok-IN">Konkani</option>
                <option value="sd-IN">Sindhi</option>
                <option value="doi-IN">Dogri</option>
                <option value="mni-IN">Manipuri</option>
                <option value="sat-IN">Santali</option>
                <option value="ks-IN">Kashmiri</option>
                <option value="bho-IN">Bhojpuri</option>

                <option value="en-US">English</option>
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
          </div>

          <div className="flex justify-between items-center w-full">
            {/* EXIT */}
            <div className="flex flex-col items-center text-xs text-white">
              <button
                onClick={exitChat}
                className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-lg"
              >
                ✕
              </button>

              <span className="mt-1 text-gray-300">Exit</span>
            </div>

            {/* MUTE */}
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

            {/* VIDEO */}
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

            {/* FLIP */}
            <div className="flex flex-col items-center text-xs text-white">
              <button
                onClick={switchCamera}
                className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center"
              >
                🔄
              </button>

              <span className="mt-1 text-gray-300">Flip</span>
            </div>

            {/* CHAT */}
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

            {/* NEXT */}
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
