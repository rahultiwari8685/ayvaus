class AudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buffer = [];
  }

  process(inputs) {
    const input = inputs[0];

    if (!input || !input[0]) return true;

    this.buffer.push(...input[0]);

    while (this.buffer.length >= 4096) {
      const chunk = this.buffer.splice(0, 4096);
      this.port.postMessage(new Float32Array(chunk));
    }

    return true;
  }
}

registerProcessor("audio-processor", AudioProcessor);
