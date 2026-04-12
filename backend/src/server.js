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

console.log("ENV SECRET:", process.env.JWT_SECRET);

app.use(cors());
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
  const username = Math.floor(Date.now() / 1000) + 3600;

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

const randomUsers = new Set();
const seriousUsers = new Map();

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

function emitSeriousUsers() {
  const users = Array.from(seriousUsers.values());

  io.emit("online-users-list", users);
}

io.on("connection", async (socket) => {
  console.log("VERIFY SECRET:", process.env.JWT_SECRET);
  const { token, mode } = socket.handshake.auth;

  socket.mode = mode;

  if (mode === "serious") {
    if (!token) return socket.disconnect();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.is_serious_profile) {
      return socket.disconnect();
    }

    socket.user = user;
    console.log("❤️ Serious User:", user.name);
  }

  socket.on("get-online-count", () => {
    socket.emit(
      "online-users",
      socket.mode === "serious" ? seriousUsers.size : randomUsers.size,
    );
  });

  if (mode === "random") {
    console.log("🎉 Random User:", socket.id);
  }

  console.log(
    "🟢 Connected:",
    socket.id,
    "| Mode:",
    socket.mode,
    "| User:",
    socket.user ? socket.user.name : "Anonymous",
  );

  function emitOnlineCount() {
    setTimeout(() => {
      io.sockets.sockets.forEach((s) => {
        s.emit(
          "online-users",
          s.mode === "serious" ? seriousUsers.size : randomUsers.size,
        );
      });
    }, 100);
  }

  if (socket.mode === "serious") {
    const userId = socket.user._id.toString();

    if (seriousUsers.has(userId)) {
      const old = seriousUsers.get(userId);
      const oldSocket = io.sockets.sockets.get(old.socketId);
      if (oldSocket) oldSocket.disconnect(true);
    }

    seriousUsers.set(userId, {
      socketId: socket.id,
      name: socket.user.name,
      age: socket.user.age,
      gender: socket.user.gender,
    });

    console.log("🔥 Serious users:", seriousUsers.size);

    emitSeriousUsers();
    emitOnlineCount();
  } else {
    randomUsers.add(socket.id);
  }

  socket.partner = null;
  socket.lastPartnerId = null;
  socket.lastNextTime = 0;

  function tryMatch(mode) {
    const queue = mode === "serious" ? seriousQueue : randomQueue;

    for (let i = 0; i < queue.length; i++) {
      for (let j = i + 1; j < queue.length; j++) {
        const s1 = queue[i];
        const s2 = queue[j];

        if (!s1 || !s2) continue;
        if (s1.partner || s2.partner) continue;

        if (s1.lastPartnerId === s2.id || s2.lastPartnerId === s1.id) {
          continue;
        }

        queue.splice(j, 1);
        queue.splice(i, 1);

        s1.partner = s2;
        s2.partner = s1;

        s1.lastPartnerId = s2.id;
        s2.lastPartnerId = s1.id;

        console.log(
          "🤝 Matched:",
          s1.user?.name || "User1",
          "↔",
          s2.user?.name || "User2",
        );

        s1.emit("matched", {
          role: "caller",
          partner: {
            name: s2.user?.name || "Stranger",
            age: s2.user?.age,
            gender: s2.user?.gender,
          },
        });

        s2.emit("matched", {
          role: "callee",
          partner: {
            name: s1.user?.name || "Stranger",
            age: s1.user?.age,
            gender: s1.user?.gender,
          },
        });

        return tryMatch(mode);
      }
    }
  }

  socket.on("join", () => {
    const queue = socket.mode === "serious" ? seriousQueue : randomQueue;

    if (!queue.includes(socket) && !socket.partner) {
      queue.push(socket);
    }

    emitOnlineCount(); // ✅ important

    // 🔥 immediate match
    tryMatch(socket.mode);
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

      if (!queue.includes(oldPartner)) {
        setTimeout(() => queue.push(oldPartner), 300);
      }
    }

    const index = queue.indexOf(socket);
    if (index !== -1) queue.splice(index, 1);

    socket.partner = null;

    setTimeout(() => {
      queue.push(socket);
      tryMatch(socket.mode);
    }, 300);
  });

  // socket.on("next", () => {
  //   const queue = socket.mode === "serious" ? seriousQueue : randomQueue;

  //   const now = Date.now();

  //   if (now - socket.lastNextTime < 2000) {
  //     socket.emit("next-blocked");
  //     return;
  //   }

  //   socket.lastNextTime = now;

  //   if (socket.partner) {
  //     const oldPartner = socket.partner;

  //     oldPartner.partner = null;
  //     socket.partner = null;

  //     oldPartner.emit("partner-left");

  //     if (!oldPartner.disconnected) {
  //       if (!queue.includes(oldPartner)) {
  //         queue.push(oldPartner);
  //       }
  //     }
  //   }

  //   const index = queue.indexOf(socket);
  //   if (index !== -1) {
  //     queue.splice(index, 1);
  //   }

  //   socket.partner = null;

  //   queue.push(socket);

  //   setTimeout(() => {
  //     tryMatch(socket.mode);
  //   }, 500);
  // });

  socket.on("disconnect", () => {
    if (socket.mode === "serious") {
      const userId = socket.user?._id?.toString();

      if (userId && seriousUsers.get(userId)?.socketId === socket.id) {
        seriousUsers.delete(userId);
        emitSeriousUsers();

        emitOnlineCount();
      }
    } else {
      randomUsers.delete(socket.id);
    }

    if (socket.partner) {
      socket.partner.emit("partner-left");
      socket.partner.partner = null;
    }

    const queue = socket.mode === "serious" ? seriousQueue : randomQueue;
    const idx = queue.indexOf(socket);
    if (idx !== -1) queue.splice(idx, 1);

    console.log(
      "🔴 Disconnected:",
      socket.id,
      "| User:",
      socket.user ? socket.user.name : "Anonymous",
    );
  });

  // ✅ SEND COUNT TO NEW USER
  setTimeout(() => {
    socket.emit(
      "online-users",
      socket.mode === "serious" ? seriousUsers.size : randomUsers.size,
    );

    console.log("📤 Initial count sent:", seriousUsers.size);
  }, 300);
});

server.listen(5000, () => {
  console.log("🚀 Backend running on port 5000");
});
