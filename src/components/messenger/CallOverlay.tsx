import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import type { Chat } from "@/pages/Index";

interface Props {
  contact: Chat;
  onEnd: () => void;
}

export default function CallOverlay({ contact, onEnd }: Props) {
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(true);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setConnected(true), 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!connected) return;
    const interval = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, [connected]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-xl" />

      <div className="relative z-10 flex flex-col items-center gap-6 animate-scale-in">
        {/* Rings */}
        <div className="relative flex items-center justify-center">
          {!connected && (
            <>
              <div className="absolute w-32 h-32 rounded-full border border-primary/30 animate-pulse-ring" />
              <div className="absolute w-40 h-40 rounded-full border border-primary/20 animate-pulse-ring delay-300" />
            </>
          )}
          <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold neon-glow">
            {contact.avatar}
          </div>
        </div>

        {/* Name & Status */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-1">{contact.name}</h2>
          <p className="text-muted-foreground text-sm">
            {connected ? (
              <span className="text-emerald-400 font-medium">{formatTime(seconds)}</span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span className="flex gap-1">
                  {[0,1,2].map(d => (
                    <span key={d} className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-wave inline-block" style={{ animationDelay: `${d * 200}ms` }} />
                  ))}
                </span>
                Звоним...
              </span>
            )}
          </p>
        </div>

        {/* Audio wave (when connected) */}
        {connected && (
          <div className="flex items-end gap-1 h-8 animate-fade-in">
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={i}
                className={`w-1.5 rounded-full animate-wave ${muted ? "bg-muted-foreground/30" : "bg-gradient-to-t from-violet-500 to-pink-400"}`}
                style={{
                  height: "100%",
                  animationDelay: `${i * 80}ms`,
                  animationDuration: `${0.6 + Math.random() * 0.4}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center gap-4 mt-2">
          <button
            onClick={() => setMuted(m => !m)}
            className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-200 hover:scale-105 ${muted ? "bg-red-500/20 text-red-400 border border-red-500/30" : "glass text-foreground"}`}
          >
            <Icon name={muted ? "MicOff" : "Mic"} size={20} />
            <span className="text-[10px]">{muted ? "Без звука" : "Микрофон"}</span>
          </button>

          <button
            onClick={onEnd}
            className="w-16 h-16 rounded-2xl bg-red-500 hover:bg-red-600 flex flex-col items-center justify-center gap-1 text-white transition-all duration-200 hover:scale-105 shadow-lg shadow-red-500/30"
          >
            <Icon name="PhoneOff" size={22} />
            <span className="text-[10px]">Завершить</span>
          </button>

          <button
            onClick={() => setSpeaker(s => !s)}
            className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-200 hover:scale-105 ${speaker ? "glass text-foreground" : "bg-muted/20 text-muted-foreground"}`}
          >
            <Icon name={speaker ? "Volume2" : "VolumeX"} size={20} />
            <span className="text-[10px]">{speaker ? "Динамик" : "Выкл"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
