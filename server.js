import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;
const hostname = "0.0.0.0"; // Important for Railway

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
    cors: {
      origin: dev
        ? "http://localhost:3000"
        : "https://homey-production-4d38.up.railway.app",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("⚡ New socket connected!");

    socket.on("join_conversation", (conversationId) => {
      socket.join(`conversation_${conversationId}`);
    });

    socket.on("send_message", (data) => {
      io.to(`conversation_${data.conversationId}`).emit("new_message", data);
    });

    socket.on("mark_messages_seen", (data) => {
      io.to(`conversation_${data.conversationId}`).emit("messages_seen", {
        conversationId: data.conversationId,
        seenByUserId: data.seenByUserId,
        seenAt: data.seenAt,
      });
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });
  });

  httpServer
    .once("error", (err) => {
      console.error("Server error:", err);
      process.exit(1);
    })
    .listen(port, hostname, () => {
      console.log(`🚀 Server ready on ${hostname}:${port}`);
    });
});
