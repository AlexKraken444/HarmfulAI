"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Msg = { role: "user" | "assistant"; content: string; id: string };

const suggestions = [
  "Как мне лучше начать утро?",
  "Что съесть на завтрак?",
  "Как победить лень?",
  "Что подарить начальнику?",
  "Как стать продуктивнее?",
];

export default function Chat() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    const userMsg: Msg = { role: "user", content: q, id: crypto.randomUUID() };
    const aiId = crypto.randomUUID();
    setMessages((m) => [...m, userMsg, { role: "assistant", content: "", id: aiId }]);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: q }),
      });
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("no stream");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((m) =>
          m.map((msg) => (msg.id === aiId ? { ...msg, content: msg.content + chunk } : msg)),
        );
      }
    } catch {
      setMessages((m) =>
        m.map((msg) =>
          msg.id === aiId
            ? { ...msg, content: "Ой, мой вредный совет застрял в проводах. Попробуй ещё раз." }
            : msg,
        ),
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-black/20 border-b border-white/5">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <motion.div
            initial={{ rotate: -10, scale: 0.8, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14 }}
            className="w-10 h-10 rounded-2xl bg-gradient-to-br from-fuchsia-500 via-purple-500 to-pink-500 animate-glow flex items-center justify-center text-xl"
            aria-hidden
          >
            😈
          </motion.div>
          <div>
            <h1 className="text-xl font-semibold leading-none">
              <span className="gradient-text">HarmfulAI</span>
            </h1>
            <p className="text-xs text-purple-200/70 mt-1">
              Самые ужасные советы в интернете · абсолютно нелепо · абсолютно шуточно
            </p>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <motion.div
                className="text-6xl mb-4 animate-floaty"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 180, damping: 12, delay: 0.1 }}
              >
                😈
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                Спроси <span className="gradient-text">HarmfulAI</span> что-нибудь
              </h2>
              <p className="text-purple-200/70 max-w-xl mx-auto mb-8">
                Я дам тебе самый бесполезный, абсурдный, нелепый совет, который ты слышал.
                Не повторяйте дома, на работе и нигде вообще.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {suggestions.map((s, i) => (
                  <motion.button
                    key={s}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.07 }}
                    onClick={() => send(s)}
                    className="text-sm px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-fuchsia-400/40 transition-all"
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          <div className="space-y-5">
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 220, damping: 22 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.role === "assistant" && (
                    <div className="w-9 h-9 mr-3 rounded-xl bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-fuchsia-900/40">
                      😈
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl whitespace-pre-wrap leading-relaxed ${
                      m.role === "user"
                        ? "bg-gradient-to-br from-fuchsia-600 to-pink-600 text-white rounded-br-md shadow-lg shadow-pink-900/30"
                        : "bg-white/[0.04] border border-white/10 text-purple-50 rounded-bl-md"
                    }`}
                  >
                    {m.content || (
                      <span className="typing">
                        <span></span>
                        <span></span>
                        <span></span>
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="sticky bottom-0 backdrop-blur-md bg-black/30 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-end gap-2"
          >
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                rows={1}
                placeholder="Спроси у HarmfulAI совет, который точно не стоит выполнять…"
                className="w-full resize-none bg-white/[0.04] border border-white/10 focus:border-fuchsia-400/50 focus:ring-2 focus:ring-fuchsia-500/20 outline-none rounded-2xl px-4 py-3 pr-14 placeholder:text-purple-200/40 text-purple-50"
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                type="submit"
                disabled={busy || !input.trim()}
                className="absolute right-2 bottom-2 w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-pink-900/40"
                aria-label="Отправить"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12l14-7-7 14-2-5-5-2z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                </svg>
              </motion.button>
            </div>
          </form>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 flex items-center justify-center gap-2 text-center"
          >
            <motion.span
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 2 }}
              className="text-base"
            >
              ⚠️
            </motion.span>
            <p className="text-sm md:text-base font-semibold tracking-wide">
              <span className="gradient-text">Не делайте то, что советует HarmfulAI!</span>
            </p>
            <motion.span
              animate={{ rotate: [0, 10, -10, 10, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 2 }}
              className="text-base"
            >
              ⚠️
            </motion.span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
