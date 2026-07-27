import "dotenv/config";
import { Gemini } from "../providers/llm/Gemini";

const gemini = new Gemini();

async function main() {
  const response = await gemini.generateResponse(
    "Say hello in exactly one sentence.",
  );

  console.log(response);
}

main();
