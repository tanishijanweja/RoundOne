export interface TextToSpeech {
  speak(text: string): Promise<ReadableStream<Uint8Array>>;
}
