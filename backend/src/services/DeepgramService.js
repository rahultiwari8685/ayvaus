import WebSocket from "ws";

class DeepgramService {
  // constructor(socket, language = "en-US") {
  //   this.socket = socket;
  //   this.language = language;

  //   this.ws = null;
  //   this.ready = false;
  //   this.keepAlive = null;
  // }

  constructor(socket, language = "en-US", translate = null) {
    this.socket = socket;
    this.language = language;
    this.translate = translate;

    this.ws = null;
    this.ready = false;
    this.keepAlive = null;
  }

  connect() {
    const params = new URLSearchParams({
      model: "nova-3",
      language: this.language,
      encoding: "linear16",
      sample_rate: "48000",
      channels: "1",
      interim_results: "true",
      punctuate: "true",
      smart_format: "true",
      endpointing: "300",
    });

    this.ws = new WebSocket(
      `wss://api.deepgram.com/v1/listen?${params.toString()}`,
      {
        headers: {
          Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
        },
      },
    );

    // this.ws.on("open", () => {
    //   console.log("✅ Deepgram Connected");

    //   this.ready = true;

    //   this.keepAlive = setInterval(() => {
    //     if (this.ws.readyState === WebSocket.OPEN) {
    //       this.ws.send(JSON.stringify({ type: "KeepAlive" }));
    //     }
    //   }, 8000);
    // });

    this.ws.on("open", () => {
      console.log("✅ Deepgram Connected");

      this.ready = true;

      // Notify frontend that Deepgram is ready
      this.socket.emit("deepgram-ready");

      this.keepAlive = setInterval(() => {
        if (this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({ type: "KeepAlive" }));
        }
      }, 8000);
    });

    this.ws.on("message", async (message) => {
      try {
        const data = JSON.parse(message.toString());

        const transcript = data.channel?.alternatives?.[0]?.transcript || "";

        if (!transcript.trim()) return;

        // Debug
        console.log("🎤", this.socket.id, transcript);

        // const transcript = data.channel?.alternatives?.[0]?.transcript || "";

        // if (!transcript.trim()) return;

        // this.socket.emit("voice-subtitle", {
        //   text: transcript,
        // });

        // if (this.socket.partnerId) {
        //   this.socket.to(this.socket.partnerId).emit("voice-subtitle", {
        //     text: transcript,
        //   });
        // }

        // if (this.socket.partnerId) {
        //   this.socket.to(this.socket.partnerId).emit("voice-subtitle", {
        //     text: transcript,
        //   });
        // }

        // if (!this.socket.partnerId) return;

        // const partnerSocket = this.socket.nsp.sockets.get(
        //   this.socket.partnerId,
        // );

        // if (!partnerSocket) return;

        if (!this.socket.partnerId) {
          console.log("❌ No Partner");
          return;
        }

        const partnerSocket = this.socket.nsp.sockets.get(
          this.socket.partnerId,
        );

        if (!partnerSocket) {
          console.log("❌ Partner Socket Missing");
          return;
        }

        let finalText = transcript;

        if (this.translate) {
          const targetLang = (partnerSocket.language || "en-US").split("-")[0];

          finalText = await this.translate(transcript, targetLang);
        }

        console.log(
          "📤 Subtitle",
          this.socket.id,
          "->",
          partnerSocket.id,
          finalText,
        );

        partnerSocket.emit("voice-subtitle", {
          text: finalText,
        });

        // partnerSocket.emit("voice-subtitle", {
        //   text: finalText,
        // });
      } catch (err) {
        console.log("Deepgram Parse Error", err);
      }
    });

    // this.ws.on("close", () => {
    //   console.log("🔴 Deepgram Closed");
    //   this.ready = false;
    // });

    this.ws.on("close", () => {
      console.log("🔴 Deepgram Closed");

      this.ready = false;

      clearInterval(this.keepAlive);
    });

    this.ws.on("error", (err) => {
      console.log("Deepgram Error", err.message);
    });
  }

  // sendAudio(audio) {
  //   if (!this.ready) return;

  //   if (this.ws.readyState !== WebSocket.OPEN) return;

  //   this.ws.send(Buffer.from(audio));
  // }

  sendAudio(audio) {
    if (!this.ready) {
      console.log("❌ Deepgram Not Ready");
      return;
    }

    if (this.ws.readyState !== WebSocket.OPEN) {
      console.log("❌ Socket Closed");
      return;
    }

    this.ws.send(Buffer.from(audio));
  }

  close() {
    clearInterval(this.keepAlive);

    this.ready = false;

    if (
      this.ws &&
      (this.ws.readyState === WebSocket.OPEN ||
        this.ws.readyState === WebSocket.CONNECTING)
    ) {
      this.ws.close();
    }

    this.ws = null;
  }

  // close() {
  //   clearInterval(this.keepAlive);

  //   if (this.ws) {
  //     this.ws.close();
  //   }

  //   this.ready = false;
  // }
}

export default DeepgramService;
