import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    // Join user to their own room for private messaging
    socket.on("join_conversation", (conversationId) => {
      socket.join(`conversation_${conversationId}`);
    });

    socket.on("send_message", (data) => {
      // Broadcast to all users in the conversation (including sender)
      io.to(`conversation_${data.conversationId}`).emit("new_message", data);
    });

    socket.on("mark_messages_seen", (data) => {
      // Broadcast to all users in the conversation that messages have been seen
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
    .listen(port, () => {});
});
