import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

let waitingUser = null;

io.on("connection", (socket) => {
  console.log("✅ Connected:", socket.id);

  socket.on("join", () => {
    if (waitingUser && waitingUser.id !== socket.id) {
      socket.partner = waitingUser;
      waitingUser.partner = socket;

      socket.emit("matched", { role: "caller" });
      waitingUser.emit("matched", { role: "callee" });

      waitingUser = null;
    } else {
      waitingUser = socket;
    }
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
    socket.partner?.emit("partner-left");
    socket.partner = null;
    waitingUser = socket;
  });

  socket.on("disconnect", () => {
    if (waitingUser === socket) waitingUser = null;
    socket.partner?.emit("partner-left");
  });
});

server.listen(5000, () =>
  console.log("🚀 Signaling server running on http://localhost:5000"),
);
