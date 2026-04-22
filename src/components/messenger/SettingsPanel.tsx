import { useState } from "react";
import Icon from "@/components/ui/icon";

const SETTINGS = [
  {
    group: "Аккаунт",
    items: [
      { icon: "User", label: "Личные данные", desc: "Имя, фото, статус" },
      { icon: "Lock", label: "Конфиденциальность", desc: "Кто видит мои данные" },
      { icon: "Shield", label: "Безопасность", desc: "Пароль, 2FA" },
    ],
  },
  {
    group: "Уведомления",
    items: [
      { icon: "Bell", label: "Push-уведомления", desc: "Звуки, вибрация", toggle: true, value: true },
      { icon: "Volume2", label: "Звуки", desc: "Сообщения, звонки", toggle: true, value: true },
      { icon: "Moon", label: "Режим «Не беспокоить»", desc: "Выкл", toggle: true, value: false },
    ],
  },
  {
    group: "Внешний вид",
    items: [
      { icon: "Palette", label: "Тема", desc: "Тёмная" },
      { icon: "Type", label: "Размер шрифта", desc: "Средний" },
      { icon: "Image", label: "Фон чата", desc: "Градиент" },
    ],
  },
  {
    group: "Прочее",
    items: [
      { icon: "HelpCircle", label: "Помощь", desc: "FAQ, поддержка" },
      { icon: "Info", label: "О приложении", desc: "Pulse v1.0" },
      { icon: "LogOut", label: "Выйти", desc: "", danger: true },
    ],
  },
];

interface Props { onLogout: () => void; }

export default function SettingsPanel({ onLogout }: Props) {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    "Push-уведомления": true,
    "Звуки": true,
    "Режим «Не беспокоить»": false,
  });

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-5 pb-3 flex-shrink-0">
        <h1 className="text-xl font-bold gradient-text mb-4">Настройки</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-4">
        {SETTINGS.map((section, si) => (
          <div key={section.group} className="animate-fade-in-up opacity-0" style={{ animationDelay: `${si * 80}ms`, animationFillMode: "forwards" }}>
            <p className="px-2 text-xs text-muted-foreground font-medium mb-2 uppercase tracking-wider">{section.group}</p>
            <div className="glass rounded-2xl overflow-hidden">
              {section.items.map((item, ii) => (
                <button
                  key={item.label}
                  onClick={item.danger ? onLogout : undefined}
                  className={`w-full flex items-center gap-3 px-4 py-3 transition-all text-left hover:bg-white/5 ${ii < section.items.length - 1 ? "border-b border-border/30" : ""} ${item.danger ? "text-red-400" : "text-foreground"}`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${item.danger ? "bg-red-500/10" : "bg-white/5"}`}>
                    <Icon name={item.icon} size={16} className={item.danger ? "text-red-400" : "text-muted-foreground"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${item.danger ? "text-red-400" : "text-foreground"}`}>{item.label}</p>
                    {item.desc && <p className="text-xs text-muted-foreground">{item.desc}</p>}
                  </div>
                  {item.toggle ? (
                    <div
                      onClick={e => { e.stopPropagation(); setToggles(t => ({ ...t, [item.label]: !t[item.label] })); }}
                      className={`relative w-10 h-5 rounded-full transition-all duration-300 flex-shrink-0 ${toggles[item.label] ? "gradient-primary" : "bg-muted"}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${toggles[item.label] ? "left-5.5 translate-x-0.5" : "left-0.5"}`} style={{ left: toggles[item.label] ? "22px" : "2px" }} />
                    </div>
                  ) : !item.danger ? (
                    <Icon name="ChevronRight" size={14} className="text-muted-foreground flex-shrink-0" />
                  ) : null}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}