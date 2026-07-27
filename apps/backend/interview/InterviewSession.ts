import { WebSocket } from "ws";
import { DeepgramSTT } from "../providers/stt/DeepgramSTT";
import { Gemini } from "../providers/llm/Gemini";
import type { LanguageModel } from "../providers/llm/LanguageModel";

export class InterviewSession {
  constructor(private socket: WebSocket) {}

  async start() {
    console.log("Interview session started");

    this.stt.onTranscript(async (text) => {
      console.log("Transcript:", text);
      try {
        const response = await this.llm.generateResponse(text);

        console.log("Gemini:", response);

        this.socket.send(
          JSON.stringify({
            type: "response",
            transcript: text,
            response,
          }),
        );
      } catch (error) {
        console.error("Gemini error:", error);
      }
    });

    await this.stt.connect();

    this.socket.send("Welcome!");

    this.socket.on("message", this.handleMessage);

    this.socket.on("close", this.handleClose);
  }

  private handleMessage = (message: WebSocket.RawData) => {
    let audio: ArrayBuffer;

    if (Buffer.isBuffer(message)) {
      console.log("Recieved:", message.length, "bytes");

      audio = message.buffer.slice(
        message.byteOffset,
        message.byteOffset + message.byteLength,
      ) as ArrayBuffer;
    } else if (message instanceof ArrayBuffer) {
      console.log("Recieved:", message.byteLength, "bytes");

      audio = message;
    } else if (Array.isArray(message)) {
      const buffer = Buffer.concat(message);

      console.log("Recieved:", buffer.length, "bytes");

      audio = buffer.buffer.slice(
        buffer.byteOffset,
        buffer.byteOffset + buffer.byteLength,
      ) as ArrayBuffer;
    } else {
      return;
    }

    this.stt.sendAudio(audio);
  };

  private handleClose = () => {
    console.log("Client disconnected");

    this.stt.disconnect();
  };

  private stt = new DeepgramSTT();
  private llm = new Gemini();
}
