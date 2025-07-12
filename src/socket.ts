"use client";

import { io } from "socket.io-client";

// Connect to the same server since Socket.IO is running alongside Next.js
export const socket = io({
  transports: ["websocket", "polling"], // Include polling as fallback
});
