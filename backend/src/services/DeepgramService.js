import WebSocket from "ws";

class DeepgramService {
  constructor(socket, translate = null) {
    this.socket = socket;
    this.translate = translate;

    this.ws = null;
    this.ready = false;
    this.keepAlive = null;
    this.connecting = false;
  }

  connect() {
    if (this.connecting || this.ready) {
      console.log("⚠️ Deepgram already connecting/connected:", this.socket.id);
      return;
    }

    this.connecting = true;

    const params = new URLSearchParams({
      model: "nova-3",

      // IMPORTANT:
      // Do NOT use receiver's subtitle language here.
      // Stranger can speak any supported language.
      language: "multi",

      encoding: "linear16",
      sample_rate: "48000",
      channels: "1",

      interim_results: "true",
      punctuate: "true",
      smart_format: "true",

      // 300 is okay, but 100 is better for multilingual
      // real-time subtitle response.
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

    this.ws.on("open", () => {
      console.log("✅ Deepgram Connected:", this.socket.id);

      this.connecting = false;
      this.ready = true;

      this.socket.emit("deepgram-ready");

      clearInterval(this.keepAlive);

      this.keepAlive = setInterval(() => {
        if (this.ws?.readyState === WebSocket.OPEN) {
          this.ws.send(
            JSON.stringify({
              type: "KeepAlive",
            }),
          );
        }
      }, 8000);
    });

    this.ws.on("message", async (message) => {
      try {
        const data = JSON.parse(message.toString());

        const alternative = data.channel?.alternatives?.[0];

        if (!alternative) return;

        const transcript = alternative.transcript?.trim();

        if (!transcript) return;

        /*
         * IMPORTANT
         *
         * Only translate final transcripts.
         *
         * Deepgram sends interim results while the person
         * is speaking. Translating every interim result
         * causes:
         *
         * - too many translation requests
         * - duplicate subtitles
         * - delayed subtitles
         * - missing subtitles
         */

        if (!data.is_final) {
          return;
        }

        console.log("🎤 FINAL TRANSCRIPT:", this.socket.id, transcript);

        /*
         * Find stranger/partner.
         */
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

        /*
         * Receiver's selected subtitle language.
         *
         * Example:
         *
         * Stranger speaks English
         * Receiver selected Hindi
         *
         * targetLang = hi
         */
        const targetLang = (partnerSocket.language || "en-US").split("-")[0];

        let finalText = transcript;

        if (this.translate) {
          try {
            finalText = await this.translate(transcript, targetLang);
          } catch (translateError) {
            console.log("❌ Translation failed:", translateError.message);

            // If translation fails, show original transcript
            // instead of completely losing the subtitle.
            finalText = transcript;
          }
        }

        console.log("📤 SUBTITLE:", {
          from: this.socket.id,
          fromLanguage: "auto/multi",
          to: partnerSocket.id,
          targetLanguage: targetLang,
          original: transcript,
          translated: finalText,
        });

        partnerSocket.emit("voice-subtitle", {
          text: finalText,
          originalText: transcript,
          language: targetLang,
        });
      } catch (err) {
        console.log("❌ Deepgram Parse Error:", err);
      }
    });

    this.ws.on("close", (code, reason) => {
      console.log(
        "🔴 Deepgram Closed:",
        this.socket.id,
        "code:",
        code,
        "reason:",
        reason?.toString(),
      );

      this.ready = false;
      this.connecting = false;

      clearInterval(this.keepAlive);
      this.keepAlive = null;
    });

    this.ws.on("error", (err) => {
      console.log("❌ Deepgram Error:", this.socket.id, err.message);

      this.ready = false;
      this.connecting = false;
    });
  }

  sendAudio(audio) {
    if (!this.ws) {
      console.log("❌ Deepgram socket does not exist:", this.socket.id);
      return;
    }

    if (!this.ready) {
      console.log("❌ Deepgram not ready:", this.socket.id);
      return;
    }

    if (this.ws.readyState !== WebSocket.OPEN) {
      console.log(
        "❌ Deepgram WebSocket not OPEN:",
        this.socket.id,
        "state:",
        this.ws.readyState,
      );
      return;
    }

    try {
      this.ws.send(Buffer.from(audio));
    } catch (err) {
      console.log("❌ Deepgram sendAudio error:", err.message);
    }
  }

  close() {
    console.log("🛑 Closing Deepgram:", this.socket.id);

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
