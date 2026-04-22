import { useState } from "react";
import Icon from "@/components/ui/icon";
import { CHATS, type Chat } from "@/pages/Index";

interface Props {
  onSelectChat: (chat: Chat) => void;
}

export default function SearchPanel({ onSelectChat }: Props) {
  const [query, setQuery] = useState("");

  const results = query.trim().length > 0
    ? CHATS.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.lastMessage.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-5 pb-3 flex-shrink-0">
        <h1 className="text-xl font-bold gradient-text mb-4">Поиск</h1>
        <div className="relative">
          <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Поиск сообщений, людей..."
            autoFocus
            className="w-full pl-8 pr-8 py-2 rounded-xl glass text-sm text-foreground placeholder-muted-foreground outline-none focus:ring-1 focus:ring-primary/50 transition-all"
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <Icon name="X" size={13} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {query.trim() === "" ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
            <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center opacity-30">
              <Icon name="Search" size={24} />
            </div>
            <p className="text-sm opacity-50 text-center">Введите запрос для поиска<br />по чатам и сообщениям</p>
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
            <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center opacity-30">
              <Icon name="SearchX" size={24} />
            </div>
            <p className="text-sm opacity-50">Ничего не найдено</p>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="px-2 text-xs text-muted-foreground font-medium mb-2 uppercase tracking-wider">
              {results.length} результат{results.length === 1 ? "" : results.length < 5 ? "а" : "ов"}
            </p>
            {results.map((chat, i) => (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat)}
                className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 transition-all text-left animate-fade-in-up opacity-0"
                style={{ animationDelay: `${i * 40}ms`, animationFillMode: "forwards" }}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                    {chat.avatar}
                  </div>
                  {chat.online && <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-background" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{chat.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{chat.lastMessage}</p>
                </div>
                <Icon name="ChevronRight" size={14} className="text-muted-foreground flex-shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
