const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const crypto = require("crypto");

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

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const waitingQueue = [];
let onlineUsers = 0;

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

  const ip =
    socket.handshake.headers["x-forwarded-for"] || socket.handshake.address;

  socket.userIp = ip;

  console.log("🟢 Connected:", socket.id, "| IP:", ip);

  onlineUsers++;
  io.emit("online-users", onlineUsers);

  socket.partner = null;
  socket.lastPartnerId = null;

  function tryMatch() {
    // Clean queue (remove disconnected or already matched users)
    for (let i = waitingQueue.length - 1; i >= 0; i--) {
      if (waitingQueue[i].disconnected || waitingQueue[i].partner) {
        waitingQueue.splice(i, 1);
      }
    }

    // Match until less than 2 users remain
    while (waitingQueue.length >= 2) {
      const socket1 = waitingQueue.shift();
      const socket2 = waitingQueue.shift();

      if (!socket1 || !socket2) continue;

      // Double check not already matched
      if (socket1.partner || socket2.partner) continue;

      socket1.partner = socket2;
      socket2.partner = socket1;

      socket1.lastPartnerId = socket2.id;
      socket2.lastPartnerId = socket1.id;

      console.log("🤝 Matched:", socket1.id, "↔", socket2.id);

      socket1.emit("matched", { role: "caller" });
      socket2.emit("matched", { role: "callee" });
    }

    logWaitingQueue();
  }

  socket.on("join", () => {
    if (!waitingQueue.includes(socket) && !socket.partner) {
      waitingQueue.push(socket);

      console.log("➕ Added to waiting:", socket.id, "| IP:", socket.userIp);
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
    onlineUsers--;
    io.emit("online-users", onlineUsers);

    if (socket.partner) {
      socket.partner.emit("partner-left");
      socket.partner.partner = null;
    }

    const idx = waitingQueue.indexOf(socket);
    if (idx !== -1) waitingQueue.splice(idx, 1);

    console.log("🔴 Disconnected:", socket.id, "| IP:", socket.userIp);
    logActiveConnections();
  });
});

server.listen(5000, () => {
  console.log("🚀 Backend running on port 5000");
});
