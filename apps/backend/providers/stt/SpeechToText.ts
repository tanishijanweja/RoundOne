export interface SpeechToText {
  connect(): Promise<void>;

  sendAudio(audio: ArrayBuffer): void;

  disconnect(): void;

  onTranscript(callback: (text: string) => void): void;
}
