"use client";

import { socket } from "@/socket";
import { useEffect, useState } from "react";

export default function Home() {
  const [reply, setReply] = useState<string | null>(null);
  useEffect(() => {
    socket.connect();

    socket.emit("send_message", {
      text: "Hi there!",
      conversationId: 1,
      senderId: "123",
    });

    socket.on("new_message", (data) => {
      console.log(data);
      setReply(data.text);
    });
    return () => {
      socket.off("new_message");
      socket.disconnect();
    };
  }, []);

  return <div>{reply}</div>;
}
