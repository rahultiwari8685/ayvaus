import express from "express";

import dotenv from "dotenv";
dotenv.config();

import http from "http";

import cors from "cors";
import { Server } from "socket.io";

import crypto from "crypto";

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import seriousRoutes from "./routes/seriousRoutes.js";

import jwt from "jsonwebtoken";
import User from "./models/User.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// app.use("/api/auth", authRoutes);
app.use("/api/serious", seriousRoutes);

app.use(
  cors({
    origin: ["https://flirtaus.com", "https://www.flirtaus.com"],
    credentials: true,
  }),
);

const randomQueue = [];
const seriousQueue = [];

function generateTurnCredentials() {
  const secret = "MySuperSecretKey123";
  const username = Math.floor(Date.now() / 1000) + 3600; // valid 1 hour

  const hmac = crypto.createHmac("sha1", secret);
  hmac.update(username.toString());
  const password = hmac.digest("base64");

  return {
    username: username.toString(),
    credential: password,
  };
}

app.get("/", (req, res) => {
  res.send("✅ Flirtaus backend is running");
});

app.get("/turn-credentials", (req, res) => {
  res.json(generateTurnCredentials());
});

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// const waitingQueue = [];
// const uniqueUsers = new Set();

const randomUsers = new Set();
const seriousUsers = new Map(); // userId → socket.id

// function logWaitingQueue() {
//   console.log("📋 Waiting Users:", waitingQueue.length);

//   waitingQueue.forEach((s, index) => {
//     console.log(`   ${index + 1}. Socket: ${s.id} | IP: ${s.userIp}`);
//   });

//   if (waitingQueue.length === 0) {
//     console.log("🧹 Waiting list cleared");
//   }
// }

function logActiveConnections() {
  const clients = Array.from(io.sockets.sockets.values());

  console.log("🌐 Active Connections:", clients.length);

  clients.forEach((s, index) => {
    console.log(
      `   ${index + 1}. Socket: ${s.id} | IP: ${s.userIp} | Partner: ${
        s.partner ? s.partner.id : "None"
      }`,
    );
  });

  console.log("--------------------------------------------------");
}

io.on("connection", async (socket) => {
  // console.log("🟢 Connected:", socket.id);

  // const userId = socket.handshake.auth.userId;

  // if (!userId) {
  //   socket.disconnect();
  //   return;
  // }

  // socket.userId = userId;

  const { token, mode } = socket.handshake.auth;

  socket.mode = mode;

  // ❤️ SERIOUS MODE
  if (mode === "serious") {
    if (!token) return socket.disconnect();

    const decoded = jwt.verify(token, "YOUR_SECRET");
    const user = await User.findById(decoded.id);

    if (!user || !user.is_serious_profile) {
      return socket.disconnect();
    }

    socket.user = user;
    console.log("❤️ Serious User:", user.name);
  }

  // 🎉 RANDOM MODE
  if (mode === "random") {
    console.log("🎉 Random User:", socket.id);
  }

  // console.log("🟢 Connected:", socket.id, "| User:", userId);

  console.log(
    "🟢 Connected:",
    socket.id,
    "| Mode:",
    socket.mode,
    "| User:",
    socket.user ? socket.user.name : "Anonymous",
  );

  // uniqueUsers.add(userId);

  // if (socket.mode === "serious") {
  //   uniqueUsers.add(socket.user._id.toString());
  // } else {
  //   uniqueUsers.add(socket.id);
  // }

  // io.emit("online-users", uniqueUsers.size);

  if (socket.mode === "serious") {
    const userId = socket.user._id.toString();

    // remove old connection (important for refresh)
    if (seriousUsers.has(userId)) {
      const oldSocketId = seriousUsers.get(userId);
      const oldSocket = io.sockets.sockets.get(oldSocketId);
      if (oldSocket) oldSocket.disconnect(true);
    }

    seriousUsers.set(userId, socket.id);
  } else {
    randomUsers.add(socket.id);
  }

  // emit correct count
  socket.emit(
    "online-users",
    socket.mode === "serious" ? seriousUsers.size : randomUsers.size,
  );

  socket.partner = null;
  socket.lastPartnerId = null;
  socket.lastNextTime = 0;

  // function tryMatch() {
  //   // Clean queue (remove disconnected or already matched users)
  //   for (let i = waitingQueue.length - 1; i >= 0; i--) {
  //     if (waitingQueue[i].disconnected || waitingQueue[i].partner) {
  //       waitingQueue.splice(i, 1);
  //     }
  //   }

  //   for (let i = 0; i < waitingQueue.length; i++) {
  //     for (let j = i + 1; j < waitingQueue.length; j++) {
  //       const socket1 = waitingQueue[i];
  //       const socket2 = waitingQueue[j];

  //       if (!socket1 || !socket2) continue;
  //       if (socket1.partner || socket2.partner) continue;

  //       // 🔥 Prevent same partner again
  //       if (
  //         socket1.lastPartnerId === socket2.id ||
  //         socket2.lastPartnerId === socket1.id
  //       ) {
  //         continue;
  //       }

  //       // Remove both from queue
  //       waitingQueue.splice(j, 1);
  //       waitingQueue.splice(i, 1);

  //       socket1.partner = socket2;
  //       socket2.partner = socket1;

  //       socket1.lastPartnerId = socket2.id;
  //       socket2.lastPartnerId = socket1.id;

  //       console.log("🤝 Matched:", socket1.id, "↔", socket2.id);

  //       socket1.emit("matched", { role: "caller" });
  //       socket2.emit("matched", { role: "callee" });

  //       return tryMatch(); // keep matching others
  //     }
  //   }

  //   logWaitingQueue();
  // }

  function isCompatible(u1, u2) {
    return (
      u1.gender === u2.looking_for &&
      u2.gender === u1.looking_for &&
      u1.intent === u2.intent &&
      Math.abs(u1.age - u2.age) <= 5
    );
  }

  function tryMatch(mode) {
    const queue = mode === "serious" ? seriousQueue : randomQueue;

    for (let i = 0; i < queue.length; i++) {
      for (let j = i + 1; j < queue.length; j++) {
        const s1 = queue[i];
        const s2 = queue[j];

        if (!s1 || !s2) continue;
        if (s1.partner || s2.partner) continue;

        // ❤️ ONLY FOR SERIOUS
        if (mode === "serious") {
          if (!isCompatible(s1.user, s2.user)) continue;
        }

        // match users
        queue.splice(j, 1);
        queue.splice(i, 1);

        s1.partner = s2;
        s2.partner = s1;

        s1.emit("matched", { role: "caller" });
        s2.emit("matched", { role: "callee" });

        return tryMatch(mode);
      }
    }
  }

  // socket.on("join", () => {
  //   if (!waitingQueue.includes(socket) && !socket.partner) {
  //     waitingQueue.push(socket);

  //     console.log("➕ Added to waiting:", socket.id, "| User:", socket.userId);
  //     logWaitingQueue();
  //   }

  //   setTimeout(() => {
  //     tryMatch();
  //   }, 500);
  // });

  socket.on("join", () => {
    const queue = socket.mode === "serious" ? seriousQueue : randomQueue;

    if (!queue.includes(socket) && !socket.partner) {
      queue.push(socket);
    }

    setTimeout(() => {
      tryMatch(socket.mode);
    }, 500);
  });

  socket.on("ready", () => {
    socket.partner?.emit("ready");
  });

  socket.on("signal", (data) => {
    socket.partner?.emit("signal", data);
  });

  socket.on("edit-message", (data) => {
    socket.partner?.emit("edit-message", data);
  });

  socket.on("typing", () => {
    socket.partner?.emit("typing");
  });

  socket.on("chat-message", (msg) => {
    socket.partner?.emit("chat-message", msg);
  });

  socket.on("message-delivered", (messageId) => {
    socket.partner?.emit("message-delivered", messageId);
  });

  socket.on("message-seen", (messageId) => {
    socket.partner?.emit("message-seen", messageId);
  });

  // socket.on("next", () => {
  //   // ✅ NEXT SPAM PROTECTION
  //   const now = Date.now();

  //   if (now - socket.lastNextTime < 2000) {
  //     console.log("⚠️ Next blocked (too fast):", socket.id);
  //     socket.emit("next-blocked");
  //     return;
  //   }

  //   socket.lastNextTime = now;
  //   console.log("⏭ Next clicked:", socket.id);

  //   // Break existing connection
  //   if (socket.partner) {
  //     const oldPartner = socket.partner;

  //     oldPartner.partner = null;
  //     socket.partner = null;

  //     oldPartner.emit("partner-left");

  //     if (!oldPartner.disconnected) {
  //       if (!waitingQueue.includes(oldPartner)) {
  //         waitingQueue.push(oldPartner);
  //       }
  //     }
  //   }

  //   // Remove self from queue if already inside
  //   const index = waitingQueue.indexOf(socket);
  //   if (index !== -1) {
  //     waitingQueue.splice(index, 1);
  //   }

  //   // Reset partner
  //   socket.partner = null;

  //   // Add self back to queue
  //   waitingQueue.push(socket);

  //   setTimeout(() => {
  //     tryMatch();
  //   }, 500);
  // });

  socket.on("next", () => {
    const queue = socket.mode === "serious" ? seriousQueue : randomQueue;

    const now = Date.now();

    if (now - socket.lastNextTime < 2000) {
      socket.emit("next-blocked");
      return;
    }

    socket.lastNextTime = now;

    if (socket.partner) {
      const oldPartner = socket.partner;

      oldPartner.partner = null;
      socket.partner = null;

      oldPartner.emit("partner-left");

      if (!oldPartner.disconnected) {
        if (!queue.includes(oldPartner)) {
          queue.push(oldPartner);
        }
      }
    }

    const index = queue.indexOf(socket);
    if (index !== -1) {
      queue.splice(index, 1);
    }

    socket.partner = null;

    queue.push(socket);

    setTimeout(() => {
      tryMatch(socket.mode);
    }, 500);
  });

  socket.on("disconnect", () => {
    // Check if any socket still using same IP
    // const stillConnected = Array.from(io.sockets.sockets.values()).some(
    //   // (s) => s.userId === socket.userId,
    //   (s) =>
    //     socket.mode === "serious"
    //       ? s.user?._id?.toString() === socket.user?._id?.toString()
    //       : s.id === socket.id,
    // );

    // if (!stillConnected) {
    //   uniqueUsers.delete(socket.userId);
    // }

    if (socket.mode === "serious") {
      const userId = socket.user?._id?.toString();

      if (userId && seriousUsers.get(userId) === socket.id) {
        seriousUsers.delete(userId);
      }
    } else {
      randomUsers.delete(socket.id);
    }

    // send updated count
    socket.emit(
      "online-users",
      socket.mode === "serious" ? seriousUsers.size : randomUsers.size,
    );

    io.emit("online-users", uniqueUsers.size);

    if (socket.partner) {
      socket.partner.emit("partner-left");
      socket.partner.partner = null;
    }

    // const idx = waitingQueue.indexOf(socket);

    const queue = socket.mode === "serious" ? seriousQueue : randomQueue;

    const idx = queue.indexOf(socket);
    if (idx !== -1) queue.splice(idx, 1);
    // if (idx !== -1) waitingQueue.splice(idx, 1);

    // console.log("🔴 Disconnected:", socket.id, "| User:", socket.userId);

    console.log(
      "🔴 Disconnected:",
      socket.id,
      "| User:",
      socket.user ? socket.user.name : "Anonymous",
    );

    logActiveConnections();
  });
});

server.listen(5000, () => {
  console.log("🚀 Backend running on port 5000");
});
