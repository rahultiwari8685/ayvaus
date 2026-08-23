import WebSocket from "ws";

class DeepgramService {
  constructor(socket, translate = null) {
    this.socket = socket;
    this.translate = translate;

    // this.ws = null;
    // this.ready = false;
    // this.keepAlive = null;
    // this.connecting = false;

    this.ws = null;
    this.ready = false;
    this.keepAlive = null;
    this.connecting = false;

    this.reconnectTimer = null;
    this.reconnectAttempts = 0;
    this.closedManually = false;
  }

  // connect() {
  //   if (this.connecting || this.ready) {
  //     console.log("⚠️ Deepgram already connecting/connected:", this.socket.id);
  //     return;
  //   }

  //   this.connecting = true;

  connect() {
    if (this.closedManually) {
      console.log("🛑 Deepgram manually closed:", this.socket.id);
      return;
    }

    if (this.connecting || this.ready) {
      console.log("⚠️ Deepgram already connecting/connected:", this.socket.id);
      return;
    }

    this.connecting = true;

    const params = new URLSearchParams({
      model: "nova-3",

      language: "multi",

      encoding: "linear16",
      sample_rate: "48000",
      channels: "1",

      interim_results: "true",
      punctuate: "true",
      smart_format: "true",

      endpointing: "100",
    });

    const url = `wss://api.deepgram.com/v1/listen?${params.toString()}`;

    console.log("🌐 Connecting Deepgram:", {
      socket: this.socket.id,
      url: url.replace(process.env.DEEPGRAM_API_KEY || "", "***"),
    });

    this.ws = new WebSocket(url, {
      headers: {
        Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
      },
    });

    // this.ws.on("open", () => {
    //   console.log("✅ Deepgram Connected:", this.socket.id);

    //   this.connecting = false;
    //   this.ready = true;

    //   this.socket.emit("deepgram-ready");

    //   clearInterval(this.keepAlive);

    //   // this.keepAlive = setInterval(() => {
    //   //   if (this.ws?.readyState === WebSocket.OPEN) {
    //   //     this.ws.send(
    //   //       JSON.stringify({
    //   //         type: "KeepAlive",
    //   //       }),
    //   //     );
    //   //   }
    //   // }, 3000);

    //   this.keepAlive = setInterval(() => {
    //     if (this.ws?.readyState === WebSocket.OPEN) {
    //       try {
    //         this.ws.send(
    //           JSON.stringify({
    //             type: "KeepAlive",
    //           }),
    //         );

    //         console.log("💓 Deepgram KeepAlive:", this.socket.id);
    //       } catch (err) {
    //         console.log("❌ KeepAlive error:", err.message);
    //       }
    //     }
    //   }, 3000);
    // });

    this.ws.on("open", () => {
      console.log("✅ Deepgram Connected:", this.socket.id);

      this.connecting = false;
      this.ready = true;
      this.reconnectAttempts = 0;

      this.socket.emit("deepgram-ready");

      clearInterval(this.keepAlive);

      this.keepAlive = setInterval(() => {
        if (this.ws?.readyState === WebSocket.OPEN) {
          try {
            this.ws.send(
              JSON.stringify({
                type: "KeepAlive",
              }),
            );

            console.log("💓 Deepgram KeepAlive:", this.socket.id);
          } catch (err) {
            console.log("❌ Deepgram KeepAlive error:", err.message);
          }
        }
      }, 3000);
    });

    // this.ws.on("message", async (message) => {
    //   try {
    //     const data = JSON.parse(message.toString());

    //     const alternative = data.channel?.alternatives?.[0];

    //     if (!alternative) return;

    this.ws.on("message", async (message) => {
      try {
        const data = JSON.parse(message.toString());

        if (data.type === "Error") {
          console.log("❌ DEEPGRAM ERROR:", JSON.stringify(data));
          return;
        }

        const alternative = data.channel?.alternatives?.[0];

        if (!alternative) return;

        const transcript = alternative.transcript?.trim();

        if (!transcript) return;

        if (!data.is_final) {
          return;
        }

        console.log("🎤 FINAL TRANSCRIPT:", this.socket.id, transcript);

        if (!this.socket.partnerId) {
          console.log("❌ No partner for subtitle:", this.socket.id);
          return;
        }

        const partnerSocket = this.socket.nsp.sockets.get(
          this.socket.partnerId,
        );

        if (!partnerSocket) {
          console.log("❌ Partner socket missing:", this.socket.partnerId);
          return;
        }

        // const targetLang = (this.socket.language || "en-US").split("-")[0];

        const selectedLanguage =
          this.socket.subtitleLanguage || this.socket.language || "en-US";

        const targetLang = selectedLanguage.split("-")[0];

        console.log("🌍 TRANSLATION TARGET:", {
          socket: this.socket.id,
          partner: this.socket.partnerId,
          selectedLanguage,
          targetLang,
        });

        let finalText = transcript;

        if (this.translate) {
          try {
            finalText = await this.translate(transcript, targetLang);
          } catch (translateError) {
            console.log("❌ Translation failed:", translateError.message);

            finalText = transcript;
          }
        }

        console.log("📤 SUBTITLE:", {
          speaker: this.socket.partnerId,
          receiver: this.socket.id,
          targetLanguage: targetLang,
          original: transcript,
          translated: finalText,
        });

        this.socket.emit("voice-subtitle", {
          text: finalText,
          originalText: transcript,
          language: targetLang,
        });
      } catch (err) {
        console.log("❌ Deepgram Parse Error:", err);
      }
    });

    // this.ws.on("close", (code, reason) => {
    //   console.log(
    //     "🔴 Deepgram Closed:",
    //     this.socket.id,
    //     "code:",
    //     code,
    //     "reason:",
    //     reason?.toString(),
    //   );

    //   this.ready = false;
    //   this.connecting = false;

    //   clearInterval(this.keepAlive);
    //   this.keepAlive = null;
    // });

    // this.ws.on("close", (code, reason) => {
    //   console.log(
    //     "🔴 Deepgram Closed:",
    //     this.socket.id,
    //     "code:",
    //     code,
    //     "reason:",
    //     reason?.toString(),
    //   );

    //   this.ready = false;
    //   this.connecting = false;

    //   clearInterval(this.keepAlive);
    //   this.keepAlive = null;

    //   if (this.closedManually) {
    //     console.log("🛑 Deepgram closed intentionally:", this.socket.id);
    //     return;
    //   }

    //   this.scheduleReconnect();
    // });

    this.ws.on("close", (code, reason) => {
      console.log("=================================");
      console.log("🔴 DEEPGRAM CLOSED");
      console.log("Socket:", this.socket.id);
      console.log("Code:", code);
      console.log("Reason:", reason?.toString() || "");
      console.log("Ready:", this.ready);
      console.log("Connecting:", this.connecting);
      console.log("Manual close:", this.closedManually);
      console.log("=================================");

      this.ready = false;
      this.connecting = false;

      clearInterval(this.keepAlive);
      this.keepAlive = null;

      if (this.closedManually) {
        console.log("🛑 Deepgram closed intentionally:", this.socket.id);
        return;
      }

      this.scheduleReconnect();
    });

    this.ws.on("error", (err) => {
      console.log("❌ Deepgram Error:", this.socket.id, err.message);

      this.ready = false;
      this.connecting = false;
    });
  }

  // sendAudio(audio) {
  //   if (!this.ws) {
  //     console.log("❌ Deepgram socket does not exist:", this.socket.id);
  //     return;
  //   }

  //   if (!this.ready) {
  //     console.log("❌ Deepgram not ready:", this.socket.id);
  //     return;
  //   }

  //   if (this.ws.readyState !== WebSocket.OPEN) {
  //     console.log(
  //       "❌ Deepgram WebSocket not OPEN:",
  //       this.socket.id,
  //       "state:",
  //       this.ws.readyState,
  //     );
  //     return;
  //   }

  //   try {
  //     this.ws.send(Buffer.from(audio));
  //   } catch (err) {
  //     console.log("❌ Deepgram sendAudio error:", err.message);
  //   }
  // }

  sendAudio(audio) {
    if (!audio) {
      return;
    }

    let buffer;

    try {
      buffer = Buffer.from(audio);
    } catch (err) {
      console.log("❌ Invalid audio packet:", err.message);
      return;
    }

    if (buffer.length === 0) {
      console.log("⚠️ Empty audio packet ignored:", this.socket.id);
      return;
    }

    if (!this.ws) {
      return;
    }

    if (!this.ready) {
      return;
    }

    if (this.ws.readyState !== WebSocket.OPEN) {
      return;
    }

    try {
      this.ws.send(buffer);
    } catch (err) {
      console.log("❌ Deepgram sendAudio error:", err.message);
    }
  }

  // close() {
  //   console.log("🛑 Closing Deepgram:", this.socket.id);

  //   clearInterval(this.keepAlive);
  //   this.keepAlive = null;

  //   this.ready = false;
  //   this.connecting = false;

  //   if (
  //     this.ws &&
  //     (this.ws.readyState === WebSocket.OPEN ||
  //       this.ws.readyState === WebSocket.CONNECTING)
  //   ) {
  //     try {
  //       this.ws.close();
  //     } catch (err) {
  //       console.log("Deepgram close error:", err.message);
  //     }
  //   }

  //   this.ws = null;
  // }

  close() {
    console.log("🛑 Closing Deepgram:", this.socket.id);

    this.closedManually = true;

    clearTimeout(this.reconnectTimer);
    this.reconnectTimer = null;

    clearInterval(this.keepAlive);
    this.keepAlive = null;

    this.ready = false;
    this.connecting = false;

    if (
      this.ws &&
      (this.ws.readyState === WebSocket.OPEN ||
        this.ws.readyState === WebSocket.CONNECTING)
    ) {
      try {
        this.ws.close();
      } catch (err) {
        console.log("Deepgram close error:", err.message);
      }
    }

    this.ws = null;
  }
}

export default DeepgramService;
