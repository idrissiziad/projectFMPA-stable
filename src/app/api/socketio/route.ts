import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";
import { NextApiRequest, NextApiResponse } from "next";

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: ServerIO;
    };
  };
};

const SocketHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new ServerIO(res.socket.server, {
      path: "/api/socketio",
      addTrailingSlash: false,
      cors: {
        origin: process.env.NODE_ENV === "production" 
          ? process.env.VERCEL_URL 
          : "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);
      
      // Handle messages
      socket.on("message", (msg: { text: string; senderId: string }) => {
        // Echo: broadcast message only the client who send the message
        socket.emit("message", {
          text: `Echo: ${msg.text}`,
          senderId: "system",
          timestamp: new Date().toISOString(),
        });
      });

      // Handle disconnect
      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });

      // Send welcome message
      socket.emit("message", {
        text: "Welcome to WebSocket Echo Server!",
        senderId: "system",
        timestamp: new Date().toISOString(),
      });
    });
  }
  res.end();
};

export default SocketHandler;