import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";
import type { Chat } from "@/pages/Index";

interface Message {
  id: number;
  text: string;
  time: string;
  out: boolean;
  type?: "text" | "voice";
  duration?: string;
}

const INITIAL_MESSAGES: Message[] = [
  { id: 1, text: "Привет! Как дела?", time: "14:10", out: false },
  { id: 2, text: "Всё отлично, спасибо! 😊 Ты как?", time: "14:11", out: true },
  { id: 3, text: "Тоже хорошо! Слушай, ты сможешь сегодня вечером?", time: "14:12", out: false },
  { id: 4, text: "Да, конечно! Во сколько встречаемся?", time: "14:13", out: true },
  { id: 5, text: "Давай в 18:00, у метро?", time: "14:14", out: false, type: "voice", duration: "0:12" },
  { id: 6, text: "Окей, жду тебя в 18:00 👍", time: "сейчас", out: false },
];

interface Props {
  chat: Chat;
  onCall: () => void;
}

export default function ChatWindow({ chat, onCall }: Props) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: input,
      time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }),
      out: true,
    }]);
    setInput("");
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "Понял, отвечу чуть позже 👌",
        time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }),
        out: false,
      }]);
    }, 1200);
  };

  const toggleRecording = () => {
    if (isRecording) {
      clearInterval(timerRef.current!);
      const duration = `0:${recordTime.toString().padStart(2, "0")}`;
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "Голосовое сообщение",
        time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }),
        out: true,
        type: "voice",
        duration,
      }]);
      setRecordTime(0);
      setIsRecording(false);
    } else {
      setIsRecording(true);
      setRecordTime(0);
      timerRef.current = setInterval(() => setRecordTime(t => t + 1), 1000);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 glass border-b border-border/50 flex-shrink-0">
        <div className="relative">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
            {chat.avatar}
          </div>
          {chat.online && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-background" />
          )}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm">{chat.name}</p>
          <p className="text-xs text-emerald-400">{chat.typing ? "печатает..." : chat.online ? "в сети" : "был(а) недавно"}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onCall}
            className="w-9 h-9 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-emerald-400 hover:bg-emerald-400/10 transition-all duration-200 hover:scale-105"
          >
            <Icon name="Phone" size={17} />
          </button>
          <button className="w-9 h-9 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all duration-200 hover:scale-105">
            <Icon name="MoreVertical" size={17} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={msg.id}
            className={`flex animate-fade-in-up opacity-0 ${msg.out ? "justify-end" : "justify-start"}`}
            style={{ animationDelay: `${i * 30}ms`, animationFillMode: "forwards" }}
          >
            <div className={`max-w-[70%] px-4 py-2.5 ${msg.out ? "msg-out" : "msg-in"}`}>
              {msg.type === "voice" ? (
                <VoiceMessage duration={msg.duration || "0:05"} out={msg.out} />
              ) : (
                <p className="text-sm text-white leading-relaxed">{msg.text}</p>
              )}
              <div className={`flex items-center gap-1 mt-1 ${msg.out ? "justify-end" : "justify-start"}`}>
                <span className="text-[10px] text-white/50">{msg.time}</span>
                {msg.out && <Icon name="CheckCheck" size={12} className="text-white/50" />}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="px-5 py-4 glass border-t border-border/50 flex-shrink-0">
        {isRecording ? (
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/30">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm text-red-400 flex-1">Запись... 0:{recordTime.toString().padStart(2, "0")}</span>
            <div className="flex gap-1 items-end h-5">
              {[0,1,2,3,4].map(d => (
                <div key={d} className="w-1 bg-red-400 rounded-full animate-wave" style={{ animationDelay: `${d * 100}ms`, height: "100%" }} />
              ))}
            </div>
            <button onClick={toggleRecording} className="text-red-400 hover:text-red-300 transition-colors">
              <Icon name="Square" size={18} />
            </button>
          </div>
        ) : (
          <div className="flex items-end gap-3">
            <button className="w-9 h-9 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-all hover:scale-105 flex-shrink-0">
              <Icon name="Paperclip" size={17} />
            </button>
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Напишите сообщение..."
                rows={1}
                className="w-full px-4 py-2.5 rounded-2xl glass text-sm text-foreground placeholder-muted-foreground outline-none focus:ring-1 focus:ring-primary/50 transition-all resize-none"
                style={{ minHeight: "42px", maxHeight: "100px" }}
              />
            </div>
            <button
              onClick={toggleRecording}
              className="w-9 h-9 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 hover:scale-105 flex-shrink-0"
            >
              <Icon name="Mic" size={17} />
            </button>
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-white transition-all duration-200 hover:scale-110 neon-glow disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Icon name="Send" size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function VoiceMessage({ duration, out }: { duration: string; out: boolean }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="flex items-center gap-3 min-w-[160px]">
      <button
        onClick={() => setPlaying(p => !p)}
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all hover:scale-110 ${out ? "bg-white/20" : "bg-primary/20"}`}
      >
        <Icon name={playing ? "Pause" : "Play"} size={14} className="text-white" />
      </button>
      <div className="flex-1 flex items-center gap-0.5 h-6">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 rounded-full transition-all ${out ? "bg-white/40" : "bg-primary/40"} ${playing ? "animate-wave" : ""}`}
            style={{
              height: `${20 + Math.sin(i * 0.8) * 14}%`,
              animationDelay: `${i * 40}ms`,
            }}
          />
        ))}
      </div>
      <span className="text-xs text-white/60 flex-shrink-0">{duration}</span>
    </div>
  );
}
