class AudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buffer = [];
  }

  process(inputs) {
    const input = inputs[0];

    if (!input || !input[0]) {
      return true;
    }

    const channel = input[0];

    this.buffer.push(...channel);

    // Send larger chunks to Deepgram
    if (this.buffer.length >= 9600) {
      const chunk = this.buffer.slice(0, 4096);

      this.buffer = this.buffer.slice(4096);

      this.port.postMessage(new Float32Array(chunk));
    }

    return true;
  }
}

registerProcessor("audio-processor", AudioProcessor);
