import express from "express";
import cors from "cors";
import preInterviewRouter from "./routes/preInterview";
import { createServer } from "http";
import { setupInterviewSocket } from "./ws/interview";

const app = express();

app.use(express.json());
app.use(cors());

// Every route inside preInterviewRouter will start with /api/v1
app.use("/api/v1", preInterviewRouter);

const server = createServer(app);

server.on("upgrade", (req) => {
  console.log("Upgrade request:", req.url);
});

setupInterviewSocket(server);

server.listen(3001, () => {
  console.log("Backend running on port 3001");
});
