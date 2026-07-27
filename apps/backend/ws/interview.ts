import { WebSocketServer } from "ws";
import type { Server } from "http";
import { InterviewSession } from "../interview/InterviewSession";

export function setupInterviewSocket(server: Server) {
  console.log("Setting up websocket server...");

  const wss = new WebSocketServer({
    server,
    path: "/api/v1/interview",
  });

  wss.on("connection", (socket) => {
    console.log("Client connected");
    const session = new InterviewSession(socket);

    session.start();
  });
}
