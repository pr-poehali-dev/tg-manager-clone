import { useState } from "react";
import Icon from "@/components/ui/icon";
import ChatList from "@/components/messenger/ChatList";
import ChatWindow from "@/components/messenger/ChatWindow";
import ContactsPanel from "@/components/messenger/ContactsPanel";
import SearchPanel from "@/components/messenger/SearchPanel";
import NotificationsPanel from "@/components/messenger/NotificationsPanel";
import SettingsPanel from "@/components/messenger/SettingsPanel";
import ProfilePanel from "@/components/messenger/ProfilePanel";
import CallOverlay from "@/components/messenger/CallOverlay";
import AuthScreen from "@/components/messenger/AuthScreen";
import { getSession, clearSession, type User } from "@/lib/api";

export type Tab = "chats" | "contacts" | "search" | "notifications" | "settings" | "profile";

export interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  typing?: boolean;
}

export const CHATS: Chat[] = [
  { id: 1, name: "Алина Сорокина", avatar: "АС", lastMessage: "Окей, жду тебя в 18:00 👍", time: "сейчас", unread: 3, online: true, typing: true },
  { id: 2, name: "Макс Волков", avatar: "МВ", lastMessage: "Отправил файл, посмотри", time: "2 мин", unread: 1, online: true },
  { id: 3, name: "Дизайн-команда", avatar: "ДК", lastMessage: "Катя: Новые макеты готовы!", time: "14:22", unread: 7, online: false },
  { id: 4, name: "Рома Петров", avatar: "РП", lastMessage: "Ха, точно 😂", time: "12:05", unread: 0, online: false },
  { id: 5, name: "Соня Лебедева", avatar: "СЛ", lastMessage: "Голосовое сообщение 🎙", time: "вчера", unread: 0, online: true },
  { id: 6, name: "Артём Козлов", avatar: "АК", lastMessage: "Хорошо, созвонимся завтра", time: "вчера", unread: 0, online: false },
  { id: 7, name: "Маша Иванова", avatar: "МИ", lastMessage: "Спасибо большое!", time: "пн", unread: 0, online: false },
];

const navItems = [
  { id: "chats" as Tab, icon: "MessageCircle", label: "Чаты" },
  { id: "contacts" as Tab, icon: "Users", label: "Контакты" },
  { id: "search" as Tab, icon: "Search", label: "Поиск" },
  { id: "notifications" as Tab, icon: "Bell", label: "Уведомления" },
  { id: "settings" as Tab, icon: "Settings", label: "Настройки" },
  { id: "profile" as Tab, icon: "User", label: "Профиль" },
];

export default function Index() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => getSession()?.user ?? null);
  const [activeTab, setActiveTab] = useState<Tab>("chats");
  const [selectedChat, setSelectedChat] = useState<Chat | null>(CHATS[0]);
  const [callActive, setCallActive] = useState(false);
  const [callContact, setCallContact] = useState<Chat | null>(null);

  if (!currentUser) {
    return <AuthScreen onAuth={setCurrentUser} />;
  }

  const handleCall = (chat: Chat) => {
    setCallContact(chat);
    setCallActive(true);
  };

  const handleEndCall = () => {
    setCallActive(false);
    setCallContact(null);
  };

  const handleLogout = () => {
    clearSession();
    setCurrentUser(null);
  };

  const totalUnread = CHATS.reduce((a, c) => a + c.unread, 0);

  return (
    <div className="flex h-screen w-screen mesh-bg overflow-hidden">
      {/* Sidebar Navigation */}
      <nav className="flex flex-col items-center py-6 px-3 gap-2 glass border-r border-border/50 z-20 w-[72px] flex-shrink-0">
        <div className="mb-4 w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center neon-glow animate-float">
          <span className="text-white font-bold text-lg">P</span>
        </div>

        {navItems.map((item, i) => {
          const isActive = activeTab === item.id;
          const badge = item.id === "chats" ? totalUnread : item.id === "notifications" ? 4 : 0;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={item.label}
              className={`
                relative w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300
                animate-fade-in-up opacity-0
                ${isActive
                  ? "gradient-primary neon-glow text-white scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5 hover:scale-105"}
              `}
              style={{ animationDelay: `${i * 60}ms`, animationFillMode: "forwards" }}
            >
              <Icon name={item.icon} size={20} />
              {badge > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full gradient-primary text-white text-[10px] font-bold flex items-center justify-center">
                  {badge > 9 ? "9+" : badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="flex-1" />

        <button
          onClick={() => setActiveTab("profile")}
          className={`w-10 h-10 rounded-2xl gradient-blue flex items-center justify-center text-white font-bold text-xs hover:scale-110 transition-transform ${activeTab === "profile" ? "ring-2 ring-primary/50" : ""}`}
          title={currentUser.name}
        >
          {currentUser.name.slice(0, 2).toUpperCase()}
        </button>
      </nav>

      {/* Left Panel */}
      <div className="w-[320px] flex-shrink-0 border-r border-border/50 flex flex-col overflow-hidden" style={{ background: "rgba(255,255,255,0.02)" }}>
        {activeTab === "chats" && (
          <ChatList chats={CHATS} selectedChat={selectedChat} onSelect={setSelectedChat} />
        )}
        {activeTab === "contacts" && <ContactsPanel />}
        {activeTab === "search" && <SearchPanel onSelectChat={(c) => { setSelectedChat(c); setActiveTab("chats"); }} />}
        {activeTab === "notifications" && <NotificationsPanel />}
        {activeTab === "settings" && <SettingsPanel onLogout={handleLogout} />}
        {activeTab === "profile" && <ProfilePanel user={currentUser} onLogout={handleLogout} />}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedChat && activeTab === "chats" ? (
          <ChatWindow chat={selectedChat} onCall={() => handleCall(selectedChat)} />
        ) : (
          <EmptyState tab={activeTab} />
        )}
      </div>

      {callActive && callContact && (
        <CallOverlay contact={callContact} onEnd={handleEndCall} />
      )}
    </div>
  );
}

function EmptyState({ tab }: { tab: Tab }) {
  const icons: Record<Tab, string> = {
    chats: "MessageCircle", contacts: "Users", search: "Search",
    notifications: "Bell", settings: "Settings", profile: "User",
  };
  const texts: Record<Tab, string> = {
    chats: "Выберите чат для начала общения",
    contacts: "Информация отображается в панели слева",
    search: "Введите запрос в панели слева",
    notifications: "Уведомления отображаются слева",
    settings: "Настройки отображаются слева",
    profile: "Ваш профиль отображается слева",
  };
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-muted-foreground animate-fade-in">
      <div className="w-20 h-20 rounded-3xl glass flex items-center justify-center opacity-30">
        <Icon name={icons[tab]} size={36} />
      </div>
      <p className="text-sm opacity-50">{texts[tab]}</p>
    </div>
  );
}