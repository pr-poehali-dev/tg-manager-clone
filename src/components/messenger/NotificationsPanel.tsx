import Icon from "@/components/ui/icon";

const NOTIFICATIONS = [
  { id: 1, type: "message", name: "Алина Сорокина", text: "Окей, жду тебя в 18:00 👍", time: "сейчас", read: false, avatar: "АС", color: "from-violet-500 to-pink-500" },
  { id: 2, type: "call", name: "Макс Волков", text: "Входящий вызов (пропущен)", time: "5 мин", read: false, avatar: "МВ", color: "from-blue-500 to-cyan-400" },
  { id: 3, type: "message", name: "Дизайн-команда", text: "Катя: Новые макеты готовы!", time: "14:22", read: false, avatar: "ДК", color: "from-orange-400 to-pink-500" },
  { id: 4, type: "mention", name: "Дизайн-команда", text: "Рома упомянул тебя: @ты посмотри", time: "13:10", read: true, avatar: "ДК", color: "from-orange-400 to-pink-500" },
  { id: 5, type: "message", name: "Соня Лебедева", text: "Голосовое сообщение 🎙", time: "вчера", read: true, avatar: "СЛ", color: "from-indigo-400 to-violet-500" },
];

const typeIcon: Record<string, string> = {
  message: "MessageCircle",
  call: "PhoneMissed",
  mention: "AtSign",
};
const typeColor: Record<string, string> = {
  message: "text-primary",
  call: "text-red-400",
  mention: "text-yellow-400",
};

export default function NotificationsPanel() {
  const unread = NOTIFICATIONS.filter(n => !n.read).length;

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-5 pb-3 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold gradient-text">
            Уведомления
          </h1>
          {unread > 0 && (
            <span className="text-xs text-muted-foreground">{unread} новых</span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
        {NOTIFICATIONS.map((n, i) => (
          <div
            key={n.id}
            className={`flex items-start gap-3 p-3 rounded-2xl transition-all animate-fade-in-up opacity-0 ${n.read ? "opacity-60" : "glass"}`}
            style={{ animationDelay: `${i * 50}ms`, animationFillMode: "forwards" }}
          >
            <div className="relative flex-shrink-0">
              <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${n.color} flex items-center justify-center text-white text-sm font-bold`}>
                {n.avatar}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full glass flex items-center justify-center ${typeColor[n.type]}`}>
                <Icon name={typeIcon[n.type]} size={10} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <p className="text-sm font-semibold truncate">{n.name}</p>
                <span className="text-[11px] text-muted-foreground flex-shrink-0 ml-2">{n.time}</span>
              </div>
              <p className="text-xs text-muted-foreground truncate">{n.text}</p>
            </div>
            {!n.read && (
              <div className="w-2 h-2 rounded-full gradient-primary flex-shrink-0 mt-1.5" />
            )}
          </div>
        ))}
      </div>

      <div className="px-4 pb-4 flex-shrink-0">
        <button className="w-full py-2.5 rounded-2xl glass text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">
          Отметить все как прочитанные
        </button>
      </div>
    </div>
  );
}
