import deepgram from "../deepgram.js";

class DeepgramService {
  constructor(socket) {
    this.socket = socket;
    this.dgConnection = null;
    this.audioQueue = [];
    this.ready = false;
  }

  async connect() {
    console.log("Deepgram Service Starting...");
  }

  sendAudio(audio) {}

  close() {}
}

export default DeepgramService;
