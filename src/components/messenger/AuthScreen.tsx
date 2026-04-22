import { useState } from "react";
import Icon from "@/components/ui/icon";
import { register, login, saveSession, type User } from "@/lib/api";

interface Props {
  onAuth: (user: User) => void;
}

export default function AuthScreen({ onAuth }: Props) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "", username: "", email: "", password: "", login: "",
  });

  const set = (key: string, val: string) => {
    setForm(f => ({ ...f, [key]: val }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    let res;
    if (mode === "login") {
      res = await login(form.login, form.password);
    } else {
      res = await register(form.name, form.username, form.email, form.password);
    }

    setLoading(false);

    if (res.error) {
      setError(res.error);
      return;
    }

    const d = res.data as { token: string; user: User };
    saveSession(d.token, d.user);
    onAuth(d.user);
  };

  return (
    <div className="min-h-screen flex items-center justify-center mesh-bg px-4">
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/8 blur-3xl animate-float delay-300" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8 animate-fade-in-up opacity-0" style={{ animationFillMode: "forwards" }}>
          <div className="w-16 h-16 rounded-3xl gradient-primary flex items-center justify-center neon-glow mb-4 animate-float">
            <span className="text-white font-bold text-3xl">P</span>
          </div>
          <h1 className="text-2xl font-bold gradient-text">Pulse</h1>
          <p className="text-sm text-muted-foreground mt-1">Мессенджер нового поколения</p>
        </div>

        {/* Card */}
        <div className="glass-strong rounded-3xl p-6 animate-fade-in-up opacity-0 delay-150" style={{ animationFillMode: "forwards" }}>
          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-2xl bg-black/20 mb-6">
            {(["login", "register"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => { setMode(tab); setError(""); }}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  mode === tab ? "gradient-primary text-white shadow-lg" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab === "login" ? "Войти" : "Регистрация"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === "register" && (
              <>
                <Field icon="User" placeholder="Ваше имя" value={form.name} onChange={v => set("name", v)} />
                <Field icon="AtSign" placeholder="Логин (username)" value={form.username} onChange={v => set("username", v)} />
                <Field icon="Mail" placeholder="Email" type="email" value={form.email} onChange={v => set("email", v)} />
              </>
            )}
            {mode === "login" && (
              <Field icon="AtSign" placeholder="Логин или Email" value={form.login} onChange={v => set("login", v)} />
            )}
            <Field icon="Lock" placeholder="Пароль" type="password" value={form.password} onChange={v => set("password", v)} />

            {error && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs animate-scale-in">
                <Icon name="AlertCircle" size={14} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl gradient-primary text-white font-semibold text-sm neon-glow hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  {mode === "login" ? "Входим..." : "Регистрируем..."}
                </span>
              ) : mode === "login" ? "Войти" : "Создать аккаунт"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4 opacity-50 animate-fade-in delay-400 opacity-0" style={{ animationFillMode: "forwards" }}>
          Pulse · Всё в одном мессенджере
        </p>
      </div>
    </div>
  );
}

function Field({ icon, placeholder, value, onChange, type = "text" }: {
  icon: string; placeholder: string; value: string;
  onChange: (v: string) => void; type?: string;
}) {
  return (
    <div className="relative">
      <Icon name={icon} size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        autoComplete="off"
        className="w-full pl-10 pr-4 py-3 rounded-2xl glass text-sm text-foreground placeholder-muted-foreground outline-none focus:ring-1 focus:ring-primary/50 transition-all"
      />
    </div>
  );
}
