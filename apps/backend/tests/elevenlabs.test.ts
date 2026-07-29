import { ElevenLabs } from "../providers/tts/ElevenLabs";
import "dotenv/config";

async function main() {
  const tts = new ElevenLabs();

  console.log("Generating speech...");

  const stream = await tts.speak("Hello! This is a test from ElevenLabs.");

  // Convert ReadableStream -> ArrayBuffer
  const arrayBuffer = await new Response(stream).arrayBuffer();

  // Save to disk
  await Bun.write("test.mp3", arrayBuffer);

  console.log("✅ Saved test.mp3");
}

main().catch(console.error);
