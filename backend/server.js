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

io.on("connection", (socket) => {
  console.log("🟢 Connected:", socket.id);

  onlineUsers++;
  io.emit("online-users", onlineUsers);

  socket.partner = null;
  socket.lastPartnerId = null;

  function tryMatch() {
    // Remove disconnected sockets
    for (let i = waitingQueue.length - 1; i >= 0; i--) {
      if (waitingQueue[i].disconnected) {
        waitingQueue.splice(i, 1);
      }
    }

    for (let i = 0; i < waitingQueue.length; i++) {
      const candidate = waitingQueue[i];

      if (
        candidate.id !== socket.id &&
        socket.lastPartnerId !== candidate.id &&
        candidate.lastPartnerId !== socket.id
      ) {
        waitingQueue.splice(i, 1);

        socket.partner = candidate;
        candidate.partner = socket;

        socket.lastPartnerId = candidate.id;
        candidate.lastPartnerId = socket.id;

        socket.emit("matched", { role: "caller" });
        candidate.emit("matched", { role: "callee" });

        return;
      }
    }

    waitingQueue.push(socket);
  }

  socket.on("join", () => {
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

      oldPartner.partner = null;
      oldPartner.emit("partner-left");

      socket.partner = null;
    }

    tryMatch();
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

    console.log("🔴 Disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("🚀 Backend running on port 5000");
});
