import { useEffect } from "react";
import { useParams } from "react-router";

function floatTo16BitPCM(float32: Float32Array): Int16Array {
  const pcm = new Int16Array(float32.length);

  for (let i = 0; i < float32.length; i++) {
    const sample = Math.max(-1, Math.min(1, float32[i]!));

    pcm[i] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
  }

  return pcm;
}

export function Interview() {
  const { interviewId } = useParams();

  useEffect(() => {
    const ws = new WebSocket(
      `ws://localhost:3001/api/v1/interview?id=${interviewId}`,
    );

    let stream: MediaStream | null = null;
    let audioContext: AudioContext | null = null;
    let processor: AudioWorkletNode | null = null;

    ws.onopen = async () => {
      console.log("Connected to backend");

      try {
        console.log("Requesting microphone...");

        stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        console.log("Microphone granted!");

        audioContext = new AudioContext();
        console.log("Sample rate:", audioContext.sampleRate);

        await audioContext.audioWorklet.addModule("/pcm-processor.js");

        const source = audioContext.createMediaStreamSource(stream);

        processor = new AudioWorkletNode(audioContext, "pcm-processor");

        source.connect(processor);
        processor.connect(audioContext.destination);

        processor.port.onmessage = (event) => {
          if (ws.readyState !== WebSocket.OPEN) return;

          const pcm = floatTo16BitPCM(event.data);

          const buffer = new ArrayBuffer(pcm.byteLength);

          const view = new Int16Array(buffer);

          view.set(pcm);

          ws.send(buffer);
        };
      } catch (err) {
        console.error(err);
      }
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        if (message.type === "transcript") {
          console.log("Transcript:", message.text);
        }
      } catch {
        console.log(event.data);
      }
    };

    ws.onclose = () => {
      console.log("Disconnected");
    };

    return () => {
      audioContext?.close();

      stream?.getTracks().forEach((track) => track.stop());

      ws.close();
    };
  }, [interviewId]);

  // const audioRef = useRef<HTMLAudioElement>(null);

  // useEffect(() => {
  //   (async () => {
  //     // Create a peer connection
  //     const pc = new RTCPeerConnection();

  //     // Set up to play remote audio from the model
  //     audioRef.current = document.createElement("audio");
  //     audioRef.current.autoplay = true;

  //     pc.ontrack = (e) => {
  //       if (audioRef.current) {
  //         audioRef.current.srcObject = e.streams[0]!;
  //       }
  //     };

  //     // Add local audio track for microphone input
  //     const ms = await navigator.mediaDevices.getUserMedia({
  //       audio: true,
  //     });

  //     pc.addTrack(ms.getTracks()[0]!);

  //     // Set up data channel for sending and receiving events
  //     // const dc = pc.createDataChannel("oai-events");

  //     // Start the session using the Session Description Protocol (SDP)
  //     const offer = await pc.createOffer();
  //     await pc.setLocalDescription(offer);

  //     const sdpResponse = await fetch("/api/v1/session", {
  //       method: "POST",
  //       body: offer.sdp,
  //       headers: {
  //         "Content-Type": "application/sdp",
  //       },
  //     });

  //     const answer = {
  //       type: "answer" as const,
  //       sdp: await sdpResponse.text(),
  //     };

  //     await pc.setRemoteDescription(answer);
  //   })();
  // }, [interviewId]);

  return (
    <div>
      {/* <audio autoPlay ref={audioRef} /> */}
      Interview
    </div>
  );
}
