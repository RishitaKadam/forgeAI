import { useEffect, useRef, useState } from "react";
import { Mic, Send, Volume2, VolumeX, Square, Sparkles, FileText } from "lucide-react";
import { useDocumentsContext } from "../../context/DocumentsContext";
import { askQuestion } from "../../services/api";
import { useSpeechRecognition, useSpeechSynthesis } from "../../hooks/useSpeech";
import MarkdownRenderer from "../../components/ui/MarkdownRenderer";
import { Badge, EmptyState, ErrorNotice } from "../../components/ui/Primitives";

const SUGGESTIONS = [
  "Summarize the key points of this document",
  "What are the important specifications or values mentioned?",
  "Explain the main concept in simple terms",
];

export default function Chat() {
  const { activeDocId, activeDocument, documents } = useDocumentsContext();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [autoSpeak, setAutoSpeak] = useState(false);
  const scrollRef = useRef(null);

  const { speak, cancel, speaking, supported: ttsSupported } = useSpeechSynthesis();
  const { listening, supported: sttSupported, start, stop } = useSpeechRecognition({
    onResult: (transcript) => setInput((prev) => (prev ? `${prev} ${transcript}` : transcript)),
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(question) {
    const text = (question ?? input).trim();
    if (!text || loading) return;

    setInput("");
    setError("");
    setMessages((prev) => [...prev, { role: "user", text }]);
    setLoading(true);

    try {
      const result = await askQuestion(text, activeDocId);
      setMessages((prev) => [...prev, { role: "assistant", text: result.answer, sources: result.sources }]);
      if (autoSpeak) speak(result.answer);
    } catch (err) {
      setError(err.message || "Something went wrong talking to ForgeAI.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  if (documents.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="Upload a PDF to start chatting"
        description="Use the Upload PDF button in the sidebar. Once it's indexed, ask anything about it here - with voice, if you like."
      />
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-9rem)]">
      <div className="mb-4 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Chat</h1>
          <p className="text-slate-400 text-sm mt-1">
            {activeDocument ? `Asking questions about "${activeDocument.filename}"` : "Ask across all uploaded documents"}
          </p>
        </div>
        {ttsSupported && (
          <button
            onClick={() => setAutoSpeak((v) => !v)}
            className={`flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg border transition ${
              autoSpeak
                ? "bg-blue-600/15 text-blue-300 border-blue-600/30"
                : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
            }`}
          >
            {autoSpeak ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            Read answers aloud
          </button>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-5">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center py-10">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/15 border border-blue-600/30 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-slate-300 font-medium mb-1">Ask ForgeAI anything about your document</p>
            <p className="text-slate-500 text-sm mb-6">Try one of these to get started:</p>
            <div className="flex flex-col gap-2 w-full max-w-md">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-left text-sm text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl px-4 py-3 transition"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-2xl px-5 py-3.5 ${
              m.role === "user"
                ? "bg-blue-600 text-white rounded-br-md"
                : "bg-slate-800/80 border border-slate-700 rounded-bl-md"
            }`}>
              {m.role === "user" ? (
                <p className="leading-6">{m.text}</p>
              ) : (
                <>
                  <MarkdownRenderer content={m.text} />
                  {m.sources?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-700/60">
                      {m.sources
                        .filter((s, idx, arr) => arr.findIndex((x) => x.page === s.page && x.source === s.source) === idx)
                        .slice(0, 6)
                        .map((s, idx) => (
                          <Badge key={idx} tone="slate">
                            📄 {s.source}{s.page ? ` · p.${s.page}` : ""}
                          </Badge>
                        ))}
                    </div>
                  )}
                  {ttsSupported && (
                    <button
                      onClick={() => (speaking ? cancel() : speak(m.text))}
                      className="mt-2 text-xs text-slate-400 hover:text-blue-300 flex items-center gap-1.5"
                    >
                      {speaking ? <Square className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                      {speaking ? "Stop" : "Listen"}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl rounded-bl-md px-5 py-3.5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
            </div>
          </div>
        )}
      </div>

      {error && <div className="mt-3"><ErrorNotice message={error} /></div>}

      <div className="mt-4 flex items-end gap-2 bg-slate-900 border border-slate-800 rounded-2xl p-2 focus-within:border-blue-600/50 transition">
        {sttSupported && (
          <button
            onClick={() => (listening ? stop() : start())}
            title="Speak your question"
            className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition ${
              listening ? "bg-red-500/20 text-red-400 animate-pulse" : "bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <Mic className="w-5 h-5" />
          </button>
        )}
        <textarea
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={listening ? "Listening..." : "Ask ForgeAI about your document..."}
          className="flex-1 bg-transparent resize-none outline-none text-white placeholder-slate-500 px-2 py-2.5 max-h-32"
        />
        <button
          onClick={() => send()}
          disabled={loading || !input.trim()}
          className="shrink-0 w-11 h-11 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 flex items-center justify-center transition"
        >
          <Send className="w-4.5 h-4.5 text-white" />
        </button>
      </div>
    </div>
  );
}
