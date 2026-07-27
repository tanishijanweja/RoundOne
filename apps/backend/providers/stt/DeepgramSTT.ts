import type { SpeechToText } from "./SpeechToText";
import WebSocket from "ws";

export class DeepgramSTT implements SpeechToText {
  private transcriptCallback?: (text: string) => void;

  private connection: WebSocket | null = null;

  async connect(): Promise<void> {
    console.log("Connecting to Deepgram STT...");

    const params = new URLSearchParams({
      model: "nova-3",
      language: "en",
      encoding: "linear16",
      sample_rate: "48000",
      channels: "1",
      interim_results: "true",
      smart_format: "true",
      endpointing: "true",
    });

    const url = `wss://api.deepgram.com/v1/listen?${params.toString()}`;

    this.connection = new WebSocket(url, {
      headers: {
        Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
      },
    });

    if (!this.connection) {
      throw new Error("Failed to create Deepgram connection");
    }

    const connection = this.connection;

    await new Promise<void>((resolve, reject) => {
      connection.on("open", () => {
        console.log("Deeepgram connected");
        resolve();
      });

      connection.on("close", (code, reason) => {
        console.log("Deepgram closed:", code, reason.toString());
      });
      connection.on("error", (err) => {
        console.error("Deepgram error:", err);
        reject(err);
      });

      connection.on("message", (message) => {
        const msg = JSON.parse(message.toString());

        console.log(msg);

        if (msg.type === "Results") {
          const transcript = msg.channel?.alternatives?.[0]?.transcript;

          if (transcript) {
            this.transcriptCallback?.(transcript);
          }
        }
      });
    });
  }

  sendAudio(audio: ArrayBuffer): void {
    console.log(
      "Sending to Deepgram:",
      audio.byteLength,
      "ReadyState:",
      this.connection?.readyState,
    );

    if (this.connection?.readyState === WebSocket.OPEN) {
      this.connection.send(Buffer.from(audio));
    } else {
      console.log("Deepgram socket is not open");
    }
  }

  disconnect(): void {
    this.connection?.close();
    this.connection = null;
  }

  onTranscript(callback: (text: string) => void): void {
    this.transcriptCallback = callback;
  }
}
