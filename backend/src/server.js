import dotenv from "dotenv";
dotenv.config();
import express from "express";

import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import crypto from "crypto";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import seriousRoutes from "./routes/seriousRoutes.js";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import Connection from "./models/Connection.js";

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
  console.log("TOKEN RECEIVED:", token?.slice(0, 20));

  if (token) {
    socket.mode = "serious";
  } else {
    socket.mode = "random";
  }

  console.log("FINAL MODE:", socket.mode);

  if (socket.mode === "serious") {
    if (!token) return socket.disconnect();

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.log("❌ Invalid token:", err.message);
      return socket.disconnect();
    }
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

  socket.partner = null;
  socket.lastPartnerId = null;
  socket.lastNextTime = 0;

  async function tryMatch(mode) {
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

        // remove from queue
        queue.splice(j, 1);
        queue.splice(i, 1);

        s1.partner = s2;
        s2.partner = s1;

        // ✅ CREATE CONNECTION HERE
        try {
          const connection = await Connection.create({
            user1: s1.user._id,
            user2: s2.user._id,
            socket1: s1.id,
            socket2: s2.id,
            startedAt: new Date(),
            status: "active",
            mode: "serious",
          });

          s1.connectionId = connection._id;
          s2.connectionId = connection._id;

          console.log("📌 Connection created:", connection._id);
        } catch (err) {
          console.log("❌ Connection error:", err.message);
        }

        // emit match
        s1.emit("matched", { role: "caller" });
        s2.emit("matched", { role: "callee" });

        return tryMatch(mode);
      }
    }
  }

  socket.on("join", () => {
    console.log("JOIN MODE:", socket.mode);
    const queue = socket.mode === "serious" ? seriousQueue : randomQueue;

    if (socket.mode === "serious") {
      if (!seriousUsers.has(socket.id)) {
        seriousUsers.set(socket.id, {
          socketId: socket.id,
          name: socket.user.name,
          age: socket.user.age,
          gender: socket.user.gender,
        });

        console.log("🔥 Serious users:", seriousUsers.size);

        emitSeriousUsers();
      }
    }

    if (!queue.includes(socket) && !socket.partner) {
      queue.push(socket);
    }

    emitOnlineCount();

    console.log("🚀 JOIN EVENT:", socket.id);

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

  socket.on("next", async () => {
    const queue = socket.mode === "serious" ? seriousQueue : randomQueue;

    const now = Date.now();
    if (now - socket.lastNextTime < 2000) {
      socket.emit("next-blocked");
      return;
    }

    socket.lastNextTime = now;

    // ✅ STEP 1: UPDATE CONNECTION AS SKIPPED
    if (socket.connectionId) {
      try {
        const conn = await Connection.findById(socket.connectionId);

        if (conn && conn.status === "active") {
          conn.endedAt = new Date();
          conn.duration = Math.floor((conn.endedAt - conn.startedAt) / 1000);
          conn.status = "skipped";

          await conn.save();

          // ✅ CLEAR CONNECTION (IMPORTANT FIX)
          socket.connectionId = null;

          if (socket.partner) {
            socket.partner.connectionId = null;
          }

          console.log("⏭️ Connection skipped:", conn._id);
        }
      } catch (err) {
        console.log("❌ Skip update error:", err.message);
      }
    }

    // ✅ STEP 2: NORMAL NEXT LOGIC
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

  socket.on("disconnect", async () => {
    if (socket.mode === "serious") {
      seriousUsers.delete(socket.id);
      emitSeriousUsers();
      emitOnlineCount();
    } else {
      randomUsers.delete(socket.id);
    }

    if (socket.connectionId) {
      const conn = await Connection.findById(socket.connectionId);

      if (conn && conn.status === "active") {
        conn.endedAt = new Date();
        conn.duration = Math.floor((conn.endedAt - conn.startedAt) / 1000);
        conn.status = "ended";

        await conn.save();

        // ✅ IMPORTANT FIX
        socket.connectionId = null;

        if (socket.partner) {
          socket.partner.connectionId = null;
        }

        console.log("🔚 Connection ended:", conn._id);
      }
    }

    // if (socket.partner) {
    //   socket.partner.emit("partner-left");
    //   socket.partner.partner = null;
    // }

    if (socket.partner) {
      const partner = socket.partner;

      partner.emit("partner-left");

      // ✅ ALSO CLOSE PARTNER CONNECTION
      if (partner.connectionId) {
        try {
          const conn = await Connection.findById(partner.connectionId);

          if (conn && conn.status === "active") {
            conn.endedAt = new Date();
            conn.duration = Math.floor((conn.endedAt - conn.startedAt) / 1000);
            conn.status = "ended";

            await conn.save();

            console.log("🔚 Partner connection ended:", conn._id);
          }
        } catch (err) {
          console.log("❌ Partner error:", err.message);
        }
      }

      partner.connectionId = null;
      partner.partner = null;
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

  setTimeout(() => {
    socket.emit(
      "online-users",
      socket.mode === "serious" ? seriousUsers.size : randomUsers.size,
    );

    console.log("📤 Initial count sent:", seriousUsers.size);
  }, 300);
});

app.get("/api/user/yesterday-history", async (req, res) => {
  try {
    const userId = req.query.userId;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const start = new Date(yesterday.setHours(0, 0, 0, 0));
    const end = new Date(yesterday.setHours(23, 59, 59, 999));

    const connections = await Connection.find({
      $or: [{ user1: userId }, { user2: userId }],
      startedAt: { $gte: start, $lte: end },
    })
      .populate("user1", "name age gender")
      .populate("user2", "name age gender")
      .sort({ startedAt: -1 });

    const result = connections
      .map((conn) => {
        const isUser1 = conn.user1 && conn.user1._id.toString() === userId;

        const partner = isUser1 ? conn.user2 : conn.user1;

        if (!partner) return null;

        return {
          name: partner.name,
          age: partner.age,
          gender: partner.gender,
          duration: conn.duration,
          status: conn.status,

          // ✅ formatted time (ADD HERE)
          startedAt: new Date(conn.startedAt).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          }),

          endedAt: conn.endedAt
            ? new Date(conn.endedAt).toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
              })
            : null,
        };
      })
      .filter(Boolean);

    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

server.listen(5000, () => {
  console.log("🚀 Backend running on port 5000");
});
