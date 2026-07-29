import type { TextToSpeech } from "./TextToSpeech";

export class ElevenLabs implements TextToSpeech {
  async speak(text: string): Promise<ReadableStream<Uint8Array>> {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}/stream`,
      {
        method: "POST",
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
        }),
      },
    );

    if (!response.ok) {
      console.log("Status:", response.status);
      console.log("Status Text:", response.statusText);

      const error = await response.text();
      console.log("Error Body:", error);

      throw new Error("ElevenLabs request failed");
    }

    if (!response.body) {
      throw new Error("No audio stream returned");
    }

    return response.body;
  }
}
