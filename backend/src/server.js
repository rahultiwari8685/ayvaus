import express from "express";
import http from "http";

import cors from "cors";
import { Server } from "socket.io";

import crypto from "crypto";

import { connectDB } from "./config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import seriousRoutes from "./src/routes/seriousRoutes.js";

const app = express();
app.use(cors());

app.use(
  cors({
    origin: ["https://flirtaus.com", "https://www.flirtaus.com"],
    credentials: true,
  }),
);

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

app.use(express.json()); // ✅ ADD THIS
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/serious", seriousRoutes);

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const waitingQueue = [];
const uniqueUsers = new Set();

function logWaitingQueue() {
  console.log("📋 Waiting Users:", waitingQueue.length);

  waitingQueue.forEach((s, index) => {
    console.log(`   ${index + 1}. Socket: ${s.id} | IP: ${s.userIp}`);
  });

  if (waitingQueue.length === 0) {
    console.log("🧹 Waiting list cleared");
  }
}

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

io.on("connection", (socket) => {
  // console.log("🟢 Connected:", socket.id);

  const userId = socket.handshake.auth.userId;

  if (!userId) {
    socket.disconnect();
    return;
  }

  socket.userId = userId;

  console.log("🟢 Connected:", socket.id, "| User:", userId);

  uniqueUsers.add(userId);
  io.emit("online-users", uniqueUsers.size);

  socket.partner = null;
  socket.lastPartnerId = null;
  socket.lastNextTime = 0;

  function tryMatch() {
    // Clean queue (remove disconnected or already matched users)
    for (let i = waitingQueue.length - 1; i >= 0; i--) {
      if (waitingQueue[i].disconnected || waitingQueue[i].partner) {
        waitingQueue.splice(i, 1);
      }
    }

    for (let i = 0; i < waitingQueue.length; i++) {
      for (let j = i + 1; j < waitingQueue.length; j++) {
        const socket1 = waitingQueue[i];
        const socket2 = waitingQueue[j];

        if (!socket1 || !socket2) continue;
        if (socket1.partner || socket2.partner) continue;

        // 🔥 Prevent same partner again
        if (
          socket1.lastPartnerId === socket2.id ||
          socket2.lastPartnerId === socket1.id
        ) {
          continue;
        }

        // Remove both from queue
        waitingQueue.splice(j, 1);
        waitingQueue.splice(i, 1);

        socket1.partner = socket2;
        socket2.partner = socket1;

        socket1.lastPartnerId = socket2.id;
        socket2.lastPartnerId = socket1.id;

        console.log("🤝 Matched:", socket1.id, "↔", socket2.id);

        socket1.emit("matched", { role: "caller" });
        socket2.emit("matched", { role: "callee" });

        return tryMatch(); // keep matching others
      }
    }

    logWaitingQueue();
  }

  socket.on("join", () => {
    if (!waitingQueue.includes(socket) && !socket.partner) {
      waitingQueue.push(socket);

      console.log("➕ Added to waiting:", socket.id, "| User:", socket.userId);
      logWaitingQueue();
    }

    setTimeout(() => {
      tryMatch();
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

  socket.on("next", () => {
    // ✅ NEXT SPAM PROTECTION
    const now = Date.now();

    if (now - socket.lastNextTime < 2000) {
      console.log("⚠️ Next blocked (too fast):", socket.id);
      socket.emit("next-blocked");
      return;
    }

    socket.lastNextTime = now;
    console.log("⏭ Next clicked:", socket.id);

    // Break existing connection
    if (socket.partner) {
      const oldPartner = socket.partner;

      oldPartner.partner = null;
      socket.partner = null;

      oldPartner.emit("partner-left");

      if (!oldPartner.disconnected) {
        if (!waitingQueue.includes(oldPartner)) {
          waitingQueue.push(oldPartner);
        }
      }
    }

    // Remove self from queue if already inside
    const index = waitingQueue.indexOf(socket);
    if (index !== -1) {
      waitingQueue.splice(index, 1);
    }

    // Reset partner
    socket.partner = null;

    // Add self back to queue
    waitingQueue.push(socket);

    setTimeout(() => {
      tryMatch();
    }, 500);
  });

  socket.on("disconnect", () => {
    // Check if any socket still using same IP
    const stillConnected = Array.from(io.sockets.sockets.values()).some(
      (s) => s.userId === socket.userId,
    );

    if (!stillConnected) {
      uniqueUsers.delete(socket.userId);
    }

    io.emit("online-users", uniqueUsers.size);

    if (socket.partner) {
      socket.partner.emit("partner-left");
      socket.partner.partner = null;
    }

    const idx = waitingQueue.indexOf(socket);
    if (idx !== -1) waitingQueue.splice(idx, 1);

    console.log("🔴 Disconnected:", socket.id, "| User:", socket.userId);
    logActiveConnections();
  });
});

server.listen(5000, () => {
  console.log("🚀 Backend running on port 5000");
});
