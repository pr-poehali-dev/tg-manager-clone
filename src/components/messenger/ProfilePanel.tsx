import { useState } from "react";
import Icon from "@/components/ui/icon";
import type { User } from "@/lib/api";

const STATS = [
  { label: "Чатов", value: "47" },
  { label: "Контактов", value: "128" },
  { label: "Медиа", value: "340" },
];

const MEDIA = [
  "from-violet-500 to-pink-500",
  "from-blue-500 to-cyan-400",
  "from-orange-400 to-pink-500",
  "from-emerald-400 to-teal-500",
  "from-yellow-400 to-orange-500",
  "from-indigo-400 to-violet-500",
];

interface Props {
  user: User;
  onLogout: () => void;
}

export default function ProfilePanel({ user, onLogout }: Props) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [status, setStatus] = useState(user.status || "На связи 🚀");

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-5 pb-3 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold gradient-text">Профиль</h1>
          <button
            onClick={() => setEditing(e => !e)}
            className="w-8 h-8 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all"
          >
            <Icon name={editing ? "Check" : "Pencil"} size={15} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3 mb-6 animate-fade-in-up opacity-0" style={{ animationFillMode: "forwards" }}>
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl gradient-blue flex items-center justify-center text-white text-2xl font-bold neon-glow animate-float">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl gradient-primary flex items-center justify-center text-white hover:scale-110 transition-transform">
              <Icon name="Camera" size={13} />
            </button>
          </div>
          {editing ? (
            <div className="w-full space-y-2">
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass text-sm text-center font-semibold text-foreground outline-none focus:ring-1 focus:ring-primary/50"
              />
              <input
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass text-xs text-center text-muted-foreground outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
          ) : (
            <>
              <div className="text-center">
                <p className="font-bold text-lg">{name}</p>
                <p className="text-sm text-muted-foreground">{status}</p>
              </div>
            </>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-6 animate-fade-in-up opacity-0 delay-150" style={{ animationFillMode: "forwards" }}>
          {STATS.map(stat => (
            <div key={stat.label} className="glass rounded-2xl p-3 text-center">
              <p className="text-xl font-bold gradient-text">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="glass rounded-2xl overflow-hidden mb-4 animate-fade-in-up opacity-0 delay-225" style={{ animationFillMode: "forwards" }}>
          {[
            { icon: "AtSign", label: `@${user.username}` },
            { icon: "Mail", label: user.email },
            { icon: "MapPin", label: "Москва, Россия" },
          ].map((item, i) => (
            <div key={i} className={`flex items-center gap-3 px-4 py-3 ${i < 2 ? "border-b border-border/30" : ""}`}>
              <div className="w-7 h-7 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                <Icon name={item.icon} size={14} className="text-muted-foreground" />
              </div>
              <p className="text-sm text-foreground/80">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Media grid */}
        <div className="animate-fade-in-up opacity-0 delay-300" style={{ animationFillMode: "forwards" }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Медиафайлы</p>
            <button className="text-xs text-primary">Все</button>
          </div>
          <div className="grid grid-cols-3 gap-1.5 mb-4">
            {MEDIA.map((gradient, i) => (
              <div key={i} className={`aspect-square rounded-xl bg-gradient-to-br ${gradient} opacity-60 hover:opacity-100 transition-opacity cursor-pointer`} />
            ))}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="w-full py-2.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
        >
          <Icon name="LogOut" size={15} />
          Выйти из аккаунта
        </button>
      </div>
    </div>
  );
}