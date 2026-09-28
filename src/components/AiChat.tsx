"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

type ChatRole = "user" | "assistant";

interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
}

const WELCOME: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Сәлем! Мен қазақтың ұлттық музыкалық аспаптары туралы сұрақтарға көмектесемін. Мысалы, «Домбыра мен шертердің айырмашылығы қандай?» деп сұрап көріңіз.",
};

const SUGGESTIONS = [
  "Қобыз қалай ойналады?",
  "Домбыра мен шертердің айырмасы қандай?",
  "Үрмелі аспаптарды аташы",
  "Жетіген атауы нені білдіреді?",
];

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function AiChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, loading]);

  async function sendMessage(text: string) {
    const clean = text.trim();
    if (!clean || loading) return;

    const userMessage: ChatMessage = { id: makeId(), role: "user", content: clean };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setDraft("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({ role, content })),
        }),
      });

      const data = (await response.json()) as { message?: string; error?: string };
      if (!response.ok || !data.message) {
        throw new Error(data.error || "Жауап алу мүмкін болмады.");
      }

      setMessages((current) => [
        ...current,
        { id: makeId(), role: "assistant", content: data.message as string },
      ]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Белгісіз қате пайда болды.");
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(draft);
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage(draft);
    }
  }

  function clearChat() {
    setMessages([WELCOME]);
    setDraft("");
    setError("");
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-surface shadow-[var(--shadow-md)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface-2 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-3">
          <span className="relative grid h-10 w-10 place-items-center rounded-2xl bg-teal-soft text-xl" aria-hidden="true">
            🎶
            <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-surface-2 bg-ok" />
          </span>
          <div>
            <h2 className="font-head text-base font-semibold">Бабалар үні көмекшісі</h2>
            <p className="m-0 text-xs text-muted">Groq арқылы жұмыс істейтін ЖИ моделі</p>
          </div>
        </div>
        <button type="button" onClick={clearChat} className="btn btn-ghost btn-sm" disabled={loading}>
          ↻ Жаңа әңгіме
        </button>
      </div>

      <div
        className="min-h-[28rem] max-h-[60vh] space-y-4 overflow-y-auto bg-[radial-gradient(circle_at_top_left,var(--teal-soft),transparent_38%)] p-4 sm:p-6"
        role="log"
        aria-live="polite"
        aria-label="ЖИ чат хабарламалары"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-[0.95rem] leading-relaxed shadow-[var(--shadow-sm)] sm:max-w-[78%] ${
                message.role === "user"
                  ? "rounded-br-md bg-accent text-white"
                  : "rounded-bl-md border border-line bg-surface text-ink"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start" aria-label="Жауап дайындалып жатыр">
            <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-line bg-surface px-4 py-3 text-sm text-muted shadow-[var(--shadow-sm)]">
              <span className="h-2 w-2 animate-bounce rounded-full bg-teal [animation-delay:-0.2s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-teal [animation-delay:-0.1s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-teal" />
              <span className="ml-1">Жауап дайындалуда…</span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="border-t border-line p-4 sm:p-5">
        {messages.length === 1 && (
          <div className="mb-4 flex flex-wrap gap-2" aria-label="Дайын сұрақтар">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                className="chip text-left"
                onClick={() => void sendMessage(suggestion)}
                disabled={loading}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {error && (
          <p role="alert" className="mb-3 rounded-xl bg-err-soft px-4 py-3 text-sm text-err">
            {error}
          </p>
        )}

        <form onSubmit={onSubmit} className="flex items-end gap-2">
          <label htmlFor="ai-chat-input" className="sr-only">Сұрағыңызды жазыңыз</label>
          <textarea
            id="ai-chat-input"
            value={draft}
            onChange={(event) => setDraft(event.target.value.slice(0, 1000))}
            onKeyDown={onKeyDown}
            rows={2}
            maxLength={1000}
            placeholder="Мысалы: Асатаяқтың үні қалай шығады?"
            className="min-h-14 flex-1 resize-none rounded-2xl border border-line bg-bg px-4 py-3 text-[0.95rem] outline-none transition focus:border-accent focus:ring-3 focus:ring-accent-soft"
            disabled={loading}
          />
          <button
            type="submit"
            className="btn h-14 min-w-14 rounded-2xl px-4"
            disabled={loading || !draft.trim()}
            aria-label="Сұрақты жіберу"
          >
            <span aria-hidden="true" className="text-lg">➤</span>
            <span className="hidden sm:inline">Жіберу</span>
          </button>
        </form>
        <p className="mt-2 mb-0 text-center text-xs text-muted">
          Enter — жіберу · Shift + Enter — жаңа жол · ең көбі 1000 таңба
        </p>
      </div>
    </div>
  );
}
