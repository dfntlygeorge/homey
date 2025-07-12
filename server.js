import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;
// Optionally set hostname if needed:
// const hostname = "0.0.0.0";
const app = next({ dev, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
    cors: {
      origin: dev
        ? "http://localhost:3000"
        : "https://your-production-domain.com",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
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

    socket.on("disconnect", () => {});
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on port ${port}`);
    });
});
