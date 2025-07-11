"use client";

import { io } from "socket.io-client";

export const socket = io("http://13.239.64.114:3001", {
  transports: ["websocket"],
});
