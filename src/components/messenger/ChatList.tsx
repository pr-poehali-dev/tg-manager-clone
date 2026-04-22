import { useState } from "react";
import Icon from "@/components/ui/icon";
import type { Chat } from "@/pages/Index";

interface Props {
  chats: Chat[];
  selectedChat: Chat | null;
  onSelect: (chat: Chat) => void;
}

export default function ChatList({ chats, selectedChat, onSelect }: Props) {
  const [search, setSearch] = useState("");

  const filtered = chats.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-5 pb-3 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold gradient-text">Чаты</h1>
          <button className="w-8 h-8 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all">
            <Icon name="Plus" size={16} />
          </button>
        </div>
        <div className="relative">
          <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск чатов..."
            className="w-full pl-8 pr-3 py-2 rounded-xl glass text-sm text-foreground placeholder-muted-foreground outline-none focus:ring-1 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>

      {/* Chat Items */}
      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
        {filtered.map((chat, i) => {
          const isSelected = selectedChat?.id === chat.id;
          return (
            <button
              key={chat.id}
              onClick={() => onSelect(chat)}
              className={`
                w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 text-left
                animate-fade-in-up opacity-0
                ${isSelected
                  ? "glass-strong neon-glow"
                  : "hover:bg-white/5"}
              `}
              style={{ animationDelay: `${i * 40}ms`, animationFillMode: "forwards" }}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className={`
                  w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-bold text-white
                  ${avatarGradient(chat.id)}
                `}>
                  {chat.avatar}
                </div>
                {chat.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-background" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className={`font-semibold text-sm truncate ${isSelected ? "text-foreground" : "text-foreground/90"}`}>
                    {chat.name}
                  </span>
                  <span className="text-[11px] text-muted-foreground flex-shrink-0 ml-2">{chat.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  {chat.typing ? (
                    <span className="text-xs text-primary flex items-center gap-1">
                      <span className="flex gap-0.5 items-end">
                        {[0, 1, 2].map(d => (
                          <span key={d} className="w-1 h-1 rounded-full bg-primary animate-wave inline-block" style={{ animationDelay: `${d * 150}ms` }} />
                        ))}
                      </span>
                      печатает...
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground truncate">{chat.lastMessage}</span>
                  )}
                  {chat.unread > 0 && (
                    <span className="ml-2 flex-shrink-0 min-w-[20px] h-5 rounded-full gradient-primary text-white text-[10px] font-bold flex items-center justify-center px-1.5">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function avatarGradient(id: number) {
  const gradients = [
    "bg-gradient-to-br from-violet-500 to-pink-500",
    "bg-gradient-to-br from-blue-500 to-cyan-400",
    "bg-gradient-to-br from-orange-400 to-pink-500",
    "bg-gradient-to-br from-emerald-400 to-teal-500",
    "bg-gradient-to-br from-yellow-400 to-orange-500",
    "bg-gradient-to-br from-pink-400 to-rose-500",
    "bg-gradient-to-br from-indigo-400 to-violet-500",
  ];
  return gradients[(id - 1) % gradients.length];
}
