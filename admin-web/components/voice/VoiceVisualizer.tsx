"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Mic, MicOff, Volume2, Sparkles, PhoneOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface VoiceVisualizerProps {
  onTranscriptGenerated?: (text: string) => void;
  assistantId?: string;
}

type CallStatus = "idle" | "connecting" | "connected" | "ended" | "error";

export function VoiceVisualizer({
  onTranscriptGenerated,
  assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || "7256aa53-d8eb-4323-baac-f04eee19576f",
}: VoiceVisualizerProps) {
  const [callStatus, setCallStatus] = useState<CallStatus>("idle");
  const [audioLevel, setAudioLevel] = useState<number[]>([15, 25, 45, 60, 30, 75, 40, 20, 50, 35, 65, 25]);
  const [spokenText, setSpokenText] = useState(
    "Assalam-o-Alaikum! Main aapka AI Voice Concierge hoon. 'Start Voice Concierge' dabayein aur apni service request bolein."
  );
  const [transcript, setTranscript] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const vapiRef = useRef<any>(null);
  const waveIntervalRef = useRef<any>(null);

  // Animate audio waveform bars
  useEffect(() => {
    const isActive = callStatus === "connected";
    if (isActive) {
      waveIntervalRef.current = setInterval(() => {
        setAudioLevel(() => Array.from({ length: 12 }, () => Math.floor(Math.random() * 65) + 15));
      }, 120);
    } else {
      clearInterval(waveIntervalRef.current);
      setAudioLevel([15, 20, 15, 25, 15, 30, 20, 15, 20, 15, 25, 15]);
    }
    return () => clearInterval(waveIntervalRef.current);
  }, [callStatus]);

  const speakResponse = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        // ignore synthesis errors
      }
    }
  };

  const simulateVoiceCall = (presetQuery?: string) => {
    setCallStatus("connected");
    const query = presetQuery || "Mujhe Gulshan Karachi mein AC technician chahiye cooling issue ke liye";
    setSpokenText("🎙️ Listening to voice stream...");

    setTimeout(() => {
      setTranscript(query);
      setSpokenText(`🗣️ Aapne kaha: "${query}"`);
      if (onTranscriptGenerated) onTranscriptGenerated(query);
      speakResponse("Assalam-o-Alaikum! Aapki request process ho rahi hai.");
      setTimeout(() => {
        setSpokenText("✅ Request auto-populated! 5-Agent dispatch executing below.");
        setCallStatus("idle");
      }, 1800);
    }, 1200);
  };

  const startBrowserSpeechFallback = (presetQuery?: string) => {
    if (typeof window === "undefined") return;
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      simulateVoiceCall(presetQuery);
      return;
    }

    try {
      setCallStatus("connected");
      setSpokenText("🎙️ Microphone active! Bolein — kis area mein kya service chahiye?");
      const recognition = new SpeechRec();
      recognition.lang = "ur-PK";
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const text = event.results[current][0].transcript;
        if (text) {
          setTranscript(text);
          setSpokenText(`🗣️ Aapne kaha: "${text}"`);
          if (event.results[current].isFinal) {
            if (onTranscriptGenerated) onTranscriptGenerated(text);
            speakResponse(`Samajh gaya! ${text}. AI agents dispatch ho rahe hain.`);
            setTimeout(() => setCallStatus("idle"), 2000);
          }
        }
      };

      recognition.onerror = () => {
        simulateVoiceCall(presetQuery);
      };

      recognition.onend = () => {
        setCallStatus("idle");
      };

      recognition.start();
    } catch (e) {
      simulateVoiceCall(presetQuery);
    }
  };

  // Load Vapi SDK lazily and setup events
  const initVapi = useCallback(async () => {
    if (vapiRef.current) return vapiRef.current;

    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || "2ba39d06-3c4e-494c-8349-d4e52a2e32fc";
    if (!publicKey) {
      console.error("[VoiceVisualizer] NEXT_PUBLIC_VAPI_PUBLIC_KEY is not set.");
      startBrowserSpeechFallback();
      return null;
    }

    try {
      // Dynamic import — only loads on client side
      const { default: Vapi } = await import("@vapi-ai/web");
      const vapi = new Vapi(publicKey);

      // ─── Vapi Event Listeners ───────────────────────────────────
      vapi.on("call-start", () => {
        console.log("[Vapi] Call started ✅");
        setCallStatus("connected");
        setSpokenText("✅ Connected! Bolein — kis area mein, kya service chahiye?");
      });

      vapi.on("call-end", () => {
        console.log("[Vapi] Call ended");
        setCallStatus("ended");
        setSpokenText("📞 Call khatam. AI Voice Concierge use karne ka shukriya!");
        setTimeout(() => setCallStatus("idle"), 1500);
      });

      vapi.on("speech-start", () => {
        setSpokenText("🎙️ Sun raha hoon... (baat karte rahein)");
      });

      vapi.on("speech-end", () => {
        setSpokenText("🤖 AI soch raha hai, jawab aa raha hai...");
      });

      // Helper to convert any Hindi/Devanagari text to Roman Urdu / Hinglish
      const toHinglish = (t: string): string => {
        if (!t) return t;
        const map: Record<string, string> = {
          "अल्लाह हाफ़िज़": "Allah Hafiz",
          "नहीं, बस": "Nahi, bas",
          "थैंक यू": "Thank you",
          "प्लंबर": "plumber",
          "प्लंबर चाहिए": "plumber chahiye",
          "एसी": "AC",
          "इलेक्ट्रीशियन": "electrician",
          "क्लीनर": "cleaner",
          "ट्यूटर": "tutor",
          "चाहिए": "chahiye",
          "बुकिंग": "booking",
          "कन्फर्म": "confirm",
          "कर दो": "kar do",
          "टाइमिंग": "timing",
          "बता देना": "bata dena",
          "हाँ": "haan",
          "शुक्रिया": "shukriya",
          "कराची": "Karachi",
          "लाहौर": "Lahore",
          "इस्लामाबाद": "Islamabad",
        };
        let cleaned = t;
        for (const [hi, ro] of Object.entries(map)) {
          cleaned = cleaned.replaceAll(hi, ro);
        }
        // If still contains Devanagari characters, replace punctuation
        return cleaned.replaceAll("।", ".");
      };

      // Real-time transcript from assistant & user
      vapi.on("message", (message: any) => {
        if (message?.type === "transcript" && message?.role === "assistant") {
          const raw = message.transcript || "";
          const text = toHinglish(raw);
          if (text) setSpokenText(`🤖 Assistant: "${text}"`);
        }
        if (
          message?.type === "transcript" &&
          message?.role === "user" &&
          message?.transcriptType === "final"
        ) {
          const rawUser = message.transcript || "";
          const userText = toHinglish(rawUser);
          if (userText) {
            setTranscript(userText);
            setSpokenText(`🗣️ Aapne kaha: "${userText}"`);
            if (onTranscriptGenerated) onTranscriptGenerated(userText);
          }
        }
      });

      vapi.on("error", (err: any) => {
        console.error("[Vapi] Error:", err);
        setSpokenText(`❌ Vapi Error: ${err?.message || "Unknown error"}`);
        setCallStatus("error");
        setTimeout(() => setCallStatus("idle"), 3000);
      });

      vapiRef.current = vapi;
      return vapi;
    } catch (e) {
      console.error("[VoiceVisualizer] Failed to init Vapi:", e);
      setSpokenText("❌ Vapi SDK load nahi hua. Console check karein.");
      setCallStatus("error");
      return null;
    }
  }, [onTranscriptGenerated]);

  const handleStartCall = async () => {
    setCallStatus("connecting");
    setSpokenText("⏳ Vapi WebRTC se connect ho raha hai...");
    try {
      const vapi = await initVapi();
      if (!vapi) {
        startBrowserSpeechFallback();
        return;
      }
      await vapi.start(assistantId);
    } catch (err: any) {
      console.warn("[Vapi] start() failed, switching to native voice fallback:", err);
      startBrowserSpeechFallback();
    }
  };

  const handleEndCall = () => {
    vapiRef.current?.stop();
    setCallStatus("ended");
  };

  const handleToggleMute = () => {
    vapiRef.current?.setMuted(!isMuted);
    setIsMuted((prev) => !prev);
  };

  const isActive = callStatus === "connected" || callStatus === "connecting";

  const statusLabel: Record<CallStatus, string> = {
    idle: "Ready",
    connecting: "Connecting...",
    connected: "Live",
    ended: "Ended",
    error: "Error",
  };

  const dotColor: Record<CallStatus, string> = {
    idle: "bg-ink-muted",
    connecting: "bg-status-warn animate-pulse",
    connected: "bg-status-go animate-pulse",
    ended: "bg-ink-muted",
    error: "bg-status-stop",
  };

  return (
    <div className="rounded-3xl bg-[#111C17] border border-[var(--status-go-line)] p-6 relative overflow-hidden transition-all duration-300 shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
      {/* Background ambient light */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-status-go/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left Info */}
        <div className="space-y-2 max-w-md">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${dotColor[callStatus]} opacity-75`} />
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${dotColor[callStatus]}`} />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Vapi WebRTC Voice Concierge
            </span>
            <Badge variant="outline" className="bg-status-go-tint text-status-go border-[#2B493B] text-[10px] font-mono">
              {statusLabel[callStatus]}
            </Badge>
          </div>

          <h2 className="text-lg font-bold text-ink tracking-tight flex items-center gap-2">
            Real-Time Spoken Audio Channel
            <Sparkles className="h-4 w-4 text-status-go" />
          </h2>

          <p className="text-xs text-ink-muted leading-relaxed">
            Roman Urdu, Urdu, ya English mein bolein. AI autonomously providers dhundh ke booking confirm karega.
          </p>
        </div>

        {/* Center Audio Waveform Visualizer */}
        <div className="flex items-center gap-1.5 h-14 px-6 rounded-2xl bg-status-go-tint border border-[var(--status-go-line)] shadow-inner">
          {audioLevel.map((height, idx) => (
            <div
              key={idx}
              className={`w-1.5 rounded-full transition-all duration-100 ease-out ${
                isActive
                  ? "bg-status-go shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                  : "bg-status-go-tint"
              }`}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>

        {/* Right CTA Buttons */}
        <div className="flex items-center gap-3">
          {/* Mute button — only when connected */}
          {callStatus === "connected" && (
            <Button
              onClick={handleToggleMute}
              variant="outline"
              className="h-10 px-4 rounded-xl border-[var(--status-go-line)] bg-status-go-tint text-ink text-xs font-semibold hover:bg-[#1C2F27]"
            >
              {isMuted ? (
                <span className="flex items-center gap-1.5"><Mic className="h-4 w-4 text-status-go" /> Unmute</span>
              ) : (
                <span className="flex items-center gap-1.5"><MicOff className="h-4 w-4 text-ink-muted" /> Mute</span>
              )}
            </Button>
          )}

          {/* Start / End button */}
          {!isActive ? (
            <Button
              onClick={handleStartCall}
              className="h-12 px-6 rounded-2xl font-semibold text-sm bg-status-go-tint hover:bg-[#1E3B2E] text-ink border border-[#2F5444] shadow-[0_0_24px_rgba(52,211,153,0.2)] transition-all duration-200"
            >
              <span className="flex items-center gap-2">
                <Mic className="h-4 w-4 text-status-go animate-pulse" />
                Start Voice Concierge
              </span>
            </Button>
          ) : callStatus === "connecting" ? (
            <Button
              disabled
              className="h-12 px-6 rounded-2xl font-semibold text-sm bg-[#1A2D24] text-ink-muted border border-[#254234] cursor-not-allowed"
            >
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-status-go" />
                Connecting...
              </span>
            </Button>
          ) : (
            <Button
              onClick={handleEndCall}
              className="h-12 px-6 rounded-2xl font-semibold text-sm bg-status-stop-tint hover:bg-status-stop-tint text-status-stop border border-[#52252B] transition-all duration-200"
            >
              <span className="flex items-center gap-2">
                <PhoneOff className="h-4 w-4 text-status-stop" />
                End Call
              </span>
            </Button>
          )}
        </div>
      </div>

      {/* Spoken Dialog Box */}
      <div className="mt-4 p-3.5 rounded-2xl bg-status-go-tint border border-[var(--status-go-line)] flex items-start gap-3">
        <Volume2 className="h-4 w-4 text-status-go shrink-0 mt-0.5" />
        <div className="text-xs text-ink flex-1">
          <span className="font-semibold text-status-go">Assistant Audio: </span>
          <span className="italic text-ink font-sans">{spokenText}</span>
        </div>
      </div>

      {/* Last user transcript chip */}
      {transcript && (
        <div className="mt-2 px-4 py-2 rounded-xl bg-[#132A1F] border border-[#214735] text-xs text-status-go font-medium">
          🗣️ Last speech detected: <span className="italic text-ink">&quot;{transcript}&quot;</span>
        </div>
      )}

      {/* Quick Voice Simulation Trigger Buttons */}
      <div className="mt-3.5 pt-3 border-t border-[#1C2E25] flex flex-wrap items-center gap-2">
        <span className="font-code text-[10px] text-ink-muted uppercase font-semibold">
          Voice Quick Test:
        </span>
        {[
          "Mujhe Gulshan Karachi mein AC technician chahiye",
          "Sector G-13 Islamabad emergency plumber bhejo",
          "DHA Phase 5 Lahore solar inverter electrician",
        ].map((queryText, idx) => (
          <button
            key={idx}
            onClick={() => simulateVoiceCall(queryText)}
            className="px-2.5 py-1 rounded-lg bg-status-go-tint hover:bg-[#1E332A] border border-[#233B30] text-[11px] text-ink-muted hover:text-status-go transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Mic size={11} className="text-status-go" />
            <span>&ldquo;{queryText.slice(0, 35)}...&rdquo;</span>
          </button>
        ))}
      </div>
    </div>
  );
}
