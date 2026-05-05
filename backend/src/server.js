import dotenv from "dotenv";
dotenv.config();
import express from "express";
import fetch from "node-fetch";
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

async function translateText(text, targetLang) {
  try {
    const res = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: text,
        source: "auto",
        target: targetLang.split("-")[0], // en-US → en
        format: "text",
      }),
    });

    const data = await res.json();
    return data.translatedText || text;
  } catch (err) {
    console.log("Translate API error:", err.message);
    return text;
  }
}

io.on("connection", async (socket) => {
  socket.language = "en";

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

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id);

      if (!user || !user.is_serious_profile) {
        return socket.disconnect();
      }

      socket.user = user;

      seriousUsers.set(user._id.toString(), {
        socketId: socket.id,
        userId: user._id.toString(),
        name: user.name,
        age: user.age,
        gender: user.gender,
      });

      emitSeriousUsers();

      console.log("🟢 User online:", user._id.toString());
      console.log("❤️ Serious User:", user.name);
    } catch (err) {
      console.log("❌ Invalid token:", err.message);
      return socket.disconnect();
    }
  }

  socket.on("get-online-count", () => {
    socket.emit(
      "online-users",
      socket.mode === "serious" ? seriousUsers.size : randomUsers.size,
    );
  });

  if (socket.mode === "random") {
    randomUsers.add(socket.id);

    console.log("🎉 Random User:", socket.id);

    emitOnlineCount();
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

        queue.splice(j, 1);
        queue.splice(i, 1);

        s1.partner = s2;
        s2.partner = s1;

        if (mode === "serious") {
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
        }

        if (mode === "serious") {
          s1.emit("matched", {
            role: "caller",
            partner: {
              name: s2.user.name,
              age: s2.user.age,
              gender: s2.user.gender,
            },
          });

          s2.emit("matched", {
            role: "callee",
            partner: {
              name: s1.user.name,
              age: s1.user.age,
              gender: s1.user.gender,
            },
          });
        } else {
          s1.emit("matched", {
            role: "caller",
          });

          s2.emit("matched", {
            role: "callee",
          });
        }

        setTimeout(() => {
          s1.emit("ready");
          s2.emit("ready");
        }, 300);

        return tryMatch(mode);
      }
    }
  }

  socket.on("join", ({ language } = {}) => {
    socket.language = language || "en";

    const queue = socket.mode === "serious" ? seriousQueue : randomQueue;

    if (!queue.includes(socket) && !socket.partner) {
      queue.push(socket);
    }

    emitOnlineCount();
    tryMatch(socket.mode);
  });

  socket.on("update-language", (lang) => {
    socket.language = lang;
  });

  // socket.on("join", () => {
  //   console.log("JOIN MODE:", socket.mode);
  //   const queue = socket.mode === "serious" ? seriousQueue : randomQueue;

  //   if (socket.mode === "serious") {
  //   }

  //   if (!queue.includes(socket) && !socket.partner) {
  //     queue.push(socket);
  //   }

  //   emitOnlineCount();

  //   console.log("🚀 JOIN EVENT:", socket.id);

  //   tryMatch(socket.mode);
  // });

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

    if (socket.connectionId) {
      try {
        const conn = await Connection.findById(socket.connectionId);

        if (conn && conn.status === "active") {
          conn.endedAt = new Date();
          conn.duration = Math.floor((conn.endedAt - conn.startedAt) / 1000);
          conn.status = "skipped";

          await conn.save();
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

    if (socket.partner) {
      const oldPartner = socket.partner;

      socket.lastPartnerId = oldPartner.id;
      oldPartner.lastPartnerId = socket.id;

      oldPartner.partner = null;
      socket.partner = null;

      oldPartner.emit("partner-left");

      if (!queue.includes(oldPartner)) {
        setTimeout(() => {
          if (!queue.includes(oldPartner) && !oldPartner.partner) {
            queue.push(oldPartner);
          }

          setTimeout(() => {
            oldPartner.lastPartnerId = null;
          }, 10000);
        }, 300);
      }
    }

    const index = queue.indexOf(socket);
    if (index !== -1) queue.splice(index, 1);

    socket.partner = null;

    setTimeout(() => {
      if (!queue.includes(socket) && !socket.partner) {
        queue.push(socket);
      }

      setTimeout(() => {
        socket.lastPartnerId = null;
      }, 10000);

      tryMatch(socket.mode);
    }, 300);
  });

  socket.on("disconnect", async () => {
    if (socket.reconnecting) {
      console.log("🔁 Skipping disconnect cleanup during reconnect");
      return;
    }

    if (socket.mode === "serious" && socket.user?._id) {
      seriousUsers.delete(socket.user._id.toString());

      emitSeriousUsers();

      console.log("⚫ User offline:", socket.user._id.toString());
    } else {
      randomUsers.delete(socket.id);
    }

    if (socket.connectionId) {
      try {
        const conn = await Connection.findById(socket.connectionId);

        if (conn && conn.status === "active") {
          conn.endedAt = new Date();
          conn.duration = Math.floor((conn.endedAt - conn.startedAt) / 1000);

          conn.status = "ended";

          await conn.save();

          console.log("🔚 Connection ended:", conn._id);
        }
      } catch (err) {
        console.log("❌ Disconnect error:", err.message);
      }

      socket.connectionId = null;

      if (socket.partner) {
        socket.partner.connectionId = null;
      }
    }

    if (socket.partner) {
      const partner = socket.partner;

      partner.emit("partner-left");

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

    if (idx !== -1) {
      queue.splice(idx, 1);
    }

    console.log(
      "🔴 Disconnected:",
      socket.id,
      "| User:",
      socket.user ? socket.user.name : "Anonymous",
    );
  });

  socket.on("reconnect-user", async ({ token, partnerId }) => {
    try {
      if (!token) throw new Error("No token");

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id || decoded._id;

      const user = await User.findById(userId);

      if (!user) {
        throw new Error("User not found");
      }

      socket.user = user;

      if (!seriousUsers.has(partnerId)) {
        throw new Error("User is offline");
      }

      const partnerData = seriousUsers.get(partnerId);

      const partnerSocket = io.sockets.sockets.get(partnerData.socketId);

      if (!partnerSocket) {
        throw new Error("User not available");
      }

      if (!partnerSocket.user?._id) {
        throw new Error("Partner user invalid");
      }

      socket.reconnecting = true;
      partnerSocket.reconnecting = true;

      socket.partner = partnerSocket;
      partnerSocket.partner = socket;

      const connection = await Connection.create({
        user1: user._id,
        user2: partnerSocket.user._id,
        socket1: socket.id,
        socket2: partnerSocket.id,
        startedAt: new Date(),
        status: "active",
        mode: "serious",
      });

      socket.connectionId = connection._id;
      partnerSocket.connectionId = connection._id;

      socket.emit("matched", {
        role: "caller",
        partner: {
          name: partnerSocket.user.name,
          age: partnerSocket.user.age,
          gender: partnerSocket.user.gender,
        },
      });

      partnerSocket.emit("matched", {
        role: "callee",
        partner: {
          name: socket.user.name,
          age: socket.user.age,
          gender: socket.user.gender,
        },
      });

      console.log(`🔁 Reconnected ${userId} ↔ ${partnerId}`);
    } catch (err) {
      console.log("❌ RECONNECT ERROR:", err.message);
      socket.emit("reconnect-failed", err.message);
    }
  });

  socket.on("send-reconnect-request", async ({ partnerId }) => {
    try {
      if (!socket.user) {
        throw new Error("User not found");
      }

      if (!seriousUsers.has(partnerId)) {
        socket.emit("reconnect-failed", "User is offline");
        return;
      }

      const partnerData = seriousUsers.get(partnerId);

      const partnerSocket = io.sockets.sockets.get(partnerData.socketId);

      if (!partnerSocket) {
        socket.emit("reconnect-failed", "User unavailable");
        return;
      }

      partnerSocket.emit("incoming-reconnect-request", {
        requesterId: socket.user._id,
        requesterName: socket.user.name,
        requesterAge: socket.user.age,
        requesterGender: socket.user.gender,
      });

      socket.emit("reconnect-request-sent", "Reconnect request sent");
    } catch (err) {
      console.log("Reconnect request error:", err.message);

      socket.emit("reconnect-failed", err.message);
    }
  });

  socket.on("accept-reconnect", async ({ requesterId }) => {
    try {
      if (!seriousUsers.has(requesterId)) {
        socket.emit("reconnect-failed", "Requester offline");

        return;
      }

      const requesterData = seriousUsers.get(requesterId);

      const requesterSocket = io.sockets.sockets.get(requesterData.socketId);

      if (!requesterSocket) {
        socket.emit("reconnect-failed", "Requester unavailable");

        return;
      }

      requesterSocket.emit("reconnect-accepted", {
        partnerId: socket.user._id,
      });

      socket.emit("reconnect-accepted", {
        partnerId: requesterSocket.user._id,
      });

      console.log(`🔁 Accepted reconnect ${requesterId} ↔ ${socket.user._id}`);
    } catch (err) {
      console.log("Accept reconnect error:", err.message);

      socket.emit("reconnect-failed", err.message);
    }
  });

  // socket.on("voice-subtitle", (text) => {
  //   if (socket.partner) {
  //     socket.partner.emit("voice-subtitle", text);
  //   }
  // });

  socket.on("voice-subtitle", async ({ text, fromLang }) => {
    const partner = socket.partner;
    if (!partner) return;

    const targetLang = partner.language || "en";

    let translatedText = text;

    try {
      if (fromLang !== targetLang) {
        translatedText = await translateText(text, targetLang);
      }
    } catch (err) {
      console.log("Translation error:", err.message);
    }

    partner.emit("voice-subtitle", translatedText);
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

    const now = new Date();

    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const connections = await Connection.find({
      $or: [{ user1: userId }, { user2: userId }],
      startedAt: {
        $gte: last24Hours,
        $lte: now,
      },
    })
      .populate("user1", "name age gender")
      .populate("user2", "name age gender")
      .sort({ startedAt: -1 });

    const uniqueUsers = new Map();

    connections.forEach((conn) => {
      const isUser1 = conn.user1 && conn.user1._id.toString() === userId;

      const partner = isUser1 ? conn.user2 : conn.user1;

      if (!partner) return;

      const partnerId = partner._id.toString();

      if (!uniqueUsers.has(partnerId)) {
        uniqueUsers.set(partnerId, {
          userId: partnerId,
          name: partner.name,
          age: partner.age,
          gender: partner.gender,
          duration: conn.duration,
          status: conn.status,

          startedAt: new Date(conn.startedAt).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          }),

          endedAt: conn.endedAt
            ? new Date(conn.endedAt).toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
              })
            : null,
        });
      }
    });

    res.json(Array.from(uniqueUsers.values()));
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Server error",
    });
  }
});

app.post("/api/user/online-status", (req, res) => {
  const { userIds } = req.body;

  const result = {};

  userIds.forEach((id) => {
    result[id] = seriousUsers.has(id.toString());
  });

  res.json(result);
});

server.listen(5000, () => {
  console.log("🚀 Backend running on port 5000");
});
