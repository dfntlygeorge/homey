import { Server as NetServer } from "http";
import { NextApiResponse } from "next";
import { Server as ServerIO } from "socket.io";

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: ServerIO;
    };
  };
};

// Initialize Socket.IO server
export const initSocket = (res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    console.log("Initializing Socket.IO server...");

    const io = new ServerIO(res.socket.server, {
      path: "/api/socket/io",
      addTrailingSlash: false,
      cors: {
        origin:
          process.env.NODE_ENV === "production"
            ? process.env.NEXTAUTH_URL
            : "http://localhost:3000",
        methods: ["GET", "POST"],
      },
    });

    // Handle socket connections
    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      // Join conversation room
      socket.on("join-conversation", (conversationId: string) => {
        socket.join(conversationId);
        console.log(`User ${socket.id} joined conversation ${conversationId}`);
      });

      // Leave conversation room
      socket.on("leave-conversation", (conversationId: string) => {
        socket.leave(conversationId);
        console.log(`User ${socket.id} left conversation ${conversationId}`);
      });

      // Handle typing indicators
      socket.on("typing", ({ conversationId, userId, isTyping }) => {
        socket.to(conversationId).emit("user-typing", { userId, isTyping });
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });

    res.socket.server.io = io;
  }
};
