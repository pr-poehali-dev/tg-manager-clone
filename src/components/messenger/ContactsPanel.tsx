import { useState } from "react";
import Icon from "@/components/ui/icon";

const CONTACTS = [
  { id: 1, name: "Алина Сорокина", phone: "+7 999 123-45-67", status: "На встрече", online: true, avatar: "АС", color: "from-violet-500 to-pink-500" },
  { id: 2, name: "Артём Козлов", phone: "+7 912 234-56-78", status: "Всё хорошо", online: false, avatar: "АК", color: "from-blue-500 to-cyan-400" },
  { id: 3, name: "Дизайн-команда", phone: "Группа", status: "5 участников", online: false, avatar: "ДК", color: "from-orange-400 to-pink-500" },
  { id: 4, name: "Маша Иванова", phone: "+7 926 345-67-89", status: "На работе", online: true, avatar: "МИ", color: "from-emerald-400 to-teal-500" },
  { id: 5, name: "Макс Волков", phone: "+7 901 456-78-90", status: "Занят", online: true, avatar: "МВ", color: "from-yellow-400 to-orange-500" },
  { id: 6, name: "Рома Петров", phone: "+7 945 567-89-01", status: "Не беспокоить", online: false, avatar: "РП", color: "from-pink-400 to-rose-500" },
  { id: 7, name: "Соня Лебедева", phone: "+7 967 678-90-12", status: "Доступна", online: true, avatar: "СЛ", color: "from-indigo-400 to-violet-500" },
];

export default function ContactsPanel() {
  const [search, setSearch] = useState("");
  const filtered = CONTACTS.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-5 pb-3 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold gradient-text">Контакты</h1>
          <button className="w-8 h-8 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all">
            <Icon name="UserPlus" size={16} />
          </button>
        </div>
        <div className="relative">
          <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Найти контакт..."
            className="w-full pl-8 pr-3 py-2 rounded-xl glass text-sm text-foreground placeholder-muted-foreground outline-none focus:ring-1 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
        <p className="px-2 text-xs text-muted-foreground font-medium mb-2 uppercase tracking-wider">
          {filtered.length} контактов
        </p>
        {filtered.map((c, i) => (
          <button
            key={c.id}
            className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 transition-all text-left animate-fade-in-up opacity-0"
            style={{ animationDelay: `${i * 40}ms`, animationFillMode: "forwards" }}
          >
            <div className="relative flex-shrink-0">
              <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center text-white text-sm font-bold`}>
                {c.avatar}
              </div>
              {c.online && <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-background" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{c.name}</p>
              <p className="text-xs text-muted-foreground truncate">{c.status}</p>
            </div>
            <div className="flex gap-1.5">
              <div className="w-7 h-7 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-emerald-400 transition-colors">
                <Icon name="Phone" size={13} />
              </div>
              <div className="w-7 h-7 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                <Icon name="MessageCircle" size={13} />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
