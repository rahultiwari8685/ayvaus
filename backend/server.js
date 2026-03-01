const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

app.use(
  cors({
    origin: ["https://flirtaus.com", "https://www.flirtaus.com"],
    credentials: true,
  }),
);

app.get("/", (req, res) => {
  res.send("✅ Flirtaus backend is running");
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

  // function tryMatch() {
  //   // Remove disconnected sockets
  //   for (let i = waitingQueue.length - 1; i >= 0; i--) {
  //     if (waitingQueue[i].disconnected) {
  //       waitingQueue.splice(i, 1);
  //     }
  //   }

  //   const selfIndex = waitingQueue.indexOf(socket);
  //   if (selfIndex !== -1) {
  //     waitingQueue.splice(selfIndex, 1);
  //   }

  //   for (let i = 0; i < waitingQueue.length; i++) {
  //     const candidate = waitingQueue[i];

  //     if (
  //       candidate.id !== socket.id &&
  //       socket.lastPartnerId !== candidate.id &&
  //       candidate.lastPartnerId !== socket.id
  //     ) {
  //       waitingQueue.splice(i, 1);

  //       socket.partner = candidate;
  //       candidate.partner = socket;

  //       socket.lastPartnerId = candidate.id;
  //       candidate.lastPartnerId = socket.id;

  //       socket.emit("matched", { role: "caller" });
  //       candidate.emit("matched", { role: "callee" });

  //       return;
  //     }
  //   }

  //   if (!waitingQueue.includes(socket)) {
  //     waitingQueue.push(socket);
  //   }
  // }

  function tryMatch() {
    // Remove disconnected OR already connected users
    for (let i = waitingQueue.length - 1; i >= 0; i--) {
      if (waitingQueue[i].disconnected || waitingQueue[i].partner) {
        waitingQueue.splice(i, 1);
      }
    }

    // Match as long as 2 users available
    while (waitingQueue.length >= 2) {
      const socket1 = waitingQueue.shift();
      const socket2 = waitingQueue.shift();

      if (!socket1 || !socket2) continue;

      socket1.partner = socket2;
      socket2.partner = socket1;

      socket1.lastPartnerId = socket2.id;
      socket2.lastPartnerId = socket1.id;

      console.log("🤝 Matched:", socket1.id, "↔", socket2.id);

      socket1.emit("matched", { role: "caller" });
      socket2.emit("matched", { role: "callee" });
    }

    console.log("📋 Waiting left:", waitingQueue.length);
    logWaitingQueue();
  }

  // socket.on("join", () => {
  //   if (!waitingQueue.includes(socket)) {
  //     waitingQueue.push(socket);
  //   }

  //   tryMatch();
  // });

  socket.on("join", () => {
    if (!waitingQueue.includes(socket) && !socket.partner) {
      waitingQueue.push(socket);

      console.log("➕ Added to waiting:", socket.id, "| IP:", socket.userIp);
      logWaitingQueue();
    }

    tryMatch();
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
    if (socket.partner) {
      const oldPartner = socket.partner;

      // Break connection both sides
      oldPartner.partner = null;
      socket.partner = null;

      // Notify old partner
      oldPartner.emit("partner-left");

      // Put old partner back in queue (if still connected)
      if (!oldPartner.disconnected && !waitingQueue.includes(oldPartner)) {
        waitingQueue.push(oldPartner);
      }
    }

    // Remove self from queue if already inside
    const selfIndex = waitingQueue.indexOf(socket);
    if (selfIndex !== -1) {
      waitingQueue.splice(selfIndex, 1);
    }

    // Add self to queue
    waitingQueue.push(socket);

    // Try matching for everyone
    setTimeout(() => {
      tryMatch();
    }, 100);
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
