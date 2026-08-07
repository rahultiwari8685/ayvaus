import deepgram from "../deepgram.js";

class DeepgramService {
  constructor(socket, language = "multi") {
    this.socket = socket;
    this.language = language;

    this.dgConnection = null;
    this.audioQueue = [];
    this.ready = false;
  }

  async connect() {
    console.log("🎤 Creating Deepgram Connection...");

    this.dgConnection = await deepgram.listen.v1.connect({
      model: "nova-3",
      language: this.language,
      encoding: "linear16",
      sample_rate: 48000,
      channels: 1,
      interim_results: true,
      smart_format: true,
      punctuate: true,
      vad_events: true,
      endpointing: 300,
    });

    console.log("✅ Deepgram Connection Created");

    console.log(this.dgConnection);
  }

  sendAudio(audio) {
    console.log("Audio Received:", audio.length);
  }

  close() {
    console.log("Deepgram Closed");
  }
}

export default DeepgramService;
