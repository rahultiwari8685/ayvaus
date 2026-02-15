const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("✅ Ayvaus backend is running");
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const waitingQueue = [];

io.on("connection", (socket) => {
  console.log("🟢 Connected:", socket.id);

  socket.partner = null;
  socket.recentPartners = new Set();

  function tryMatch() {
    for (let i = 0; i < waitingQueue.length; i++) {
      const candidate = waitingQueue[i];

      if (
        candidate.id !== socket.id &&
        !socket.recentPartners.has(candidate.id) &&
        !candidate.recentPartners.has(socket.id)
      ) {
        waitingQueue.splice(i, 1);

        socket.partner = candidate;
        candidate.partner = socket;

        socket.recentPartners.add(candidate.id);
        candidate.recentPartners.add(socket.id);

        socket.emit("matched", { role: "caller" });
        candidate.emit("matched", { role: "callee" });

        console.log("🔗 Matched:", socket.id, candidate.id);
        return;
      }
    }

    waitingQueue.push(socket);
    console.log("⏳ Waiting:", socket.id);
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

  socket.on("chat-message", (msg) => {
    socket.partner?.emit("chat-message", msg);
  });

  socket.on("next", () => {
    if (socket.partner) {
      socket.partner.partner = null;
      socket.partner.emit("partner-left");
    }

    socket.partner = null;
    tryMatch();
  });

  socket.on("disconnect", () => {
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
