import { useState, useEffect, useRef } from "react";
import { useQuery, useAction } from "convex/react";
import { api } from "../convex/_generated/api";
import { Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import { cn } from "./lib/utils";

export default function App() {
  const sessionId = "default-session";
  const messages = useQuery(api.messages.list, { sessionId });
  const handleUserMessage = useAction(api.actions.handleUserMessage);

  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    const currentInput = input;
    setInput("");
    setIsSending(true);

    try {
      await handleUserMessage({ body: currentInput, author: "User", sessionId });
    } catch (err) {
      console.error("Send Error:", err);
      setInput(currentInput);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] text-zinc-100 selection:bg-blue-500/30 overflow-hidden font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-[#0d0d0d]/80 border-b border-zinc-800/50 backdrop-blur-xl sticky top-0 z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/10 rounded-xl border border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]">
            <Sparkles className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-tight bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent">Antigravity AI</h1>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Neural Link Active</span>
            </div>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-tighter">Core Status</span>
            <span className="text-xs font-mono text-emerald-500/80">STABLE</span>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {messages === undefined ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full animate-pulse" />
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin relative" />
              </div>
              <p className="text-sm text-zinc-500 font-medium animate-pulse tracking-wide">Syncing with encrypted datastore...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 text-center animate-in fade-in zoom-in duration-700">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full" />
                <div className="relative p-6 bg-zinc-900/50 rounded-3xl border border-zinc-800 shadow-2xl">
                  <Bot className="w-12 h-12 text-zinc-700" />
                </div>
              </div>
              <div className="space-y-2 max-w-sm">
                <p className="text-zinc-300 font-semibold text-lg">Initialize Protocol</p>
                <p className="text-sm text-zinc-500 leading-relaxed">System is ready for input. No prior logs found in this session. Start the conversation to begin processing.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6 pb-4">
              {messages.map((msg: any) => (
                <div
                  key={msg._id}
                  className={cn(
                    "flex items-start gap-4 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4",
                    msg.author === "User" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div className={cn(
                    "flex-shrink-0 p-2.5 rounded-2xl border transition-colors shadow-sm",
                    msg.author === "User" 
                      ? "bg-zinc-900 border-zinc-800 text-zinc-500 group-hover:text-zinc-400" 
                      : "bg-blue-600/10 border-blue-500/20 text-blue-500"
                  )}>
                    {msg.author === "User" ? <User size={18} /> : <Bot size={18} />}
                  </div>
                  <div className={cn(
                    "max-w-[85%] sm:max-w-[70%] space-y-2",
                    msg.author === "User" ? "items-end flex flex-col" : "items-start"
                  )}>
                    <div className={cn(
                      "px-5 py-3.5 rounded-3xl text-[15px] leading-relaxed shadow-lg backdrop-blur-sm",
                      msg.author === "User"
                        ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-none shadow-blue-900/20"
                        : "bg-zinc-900/80 border border-zinc-800/50 text-zinc-200 rounded-tl-none shadow-black/20"
                    )}>
                      {msg.body}
                    </div>
                    <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-tight px-2 opacity-50">
                      {new Date(msg._creationTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {isSending && (
            <div className="flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex-shrink-0 p-2.5 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-500 shadow-sm">
                <Bot size={18} />
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800/50 px-5 py-4 rounded-3xl rounded-tl-none shadow-xl flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s] shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s] shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                </div>
                <span className="text-xs text-zinc-400 font-semibold tracking-wide italic">Antigravity is calculating...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-6 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent shrink-0">
        <div className="max-w-3xl mx-auto relative">
          <form
            onSubmit={handleSubmit}
            className="group relative flex items-center gap-2 p-2 bg-zinc-900/80 border border-zinc-800 rounded-[2rem] focus-within:border-blue-500/50 focus-within:ring-4 focus-within:ring-blue-500/5 transition-all duration-500 backdrop-blur-2xl shadow-2xl"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent px-5 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none disabled:opacity-50"
              placeholder="Command Antigravity..."
              disabled={isSending}
            />
            <button
              type="submit"
              disabled={!input.trim() || isSending}
              className={cn(
                "p-3 rounded-full transition-all duration-300 flex items-center justify-center",
                input.trim() && !isSending
                  ? "bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] active:scale-90"
                  : "bg-zinc-800 text-zinc-600 cursor-not-allowed opacity-50"
              )}
            >
              {isSending ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Send size={20} className={cn("transition-transform", input.trim() && "group-hover:translate-x-0.5 group-hover:-translate-y-0.5")} />
              )}
            </button>
          </form>
          <div className="flex justify-between items-center mt-4 px-2">
            <p className="text-[9px] text-zinc-700 font-black uppercase tracking-[0.2em]">
              System Protocol 7.4.2
            </p>
            <p className="text-[9px] text-zinc-700 font-black uppercase tracking-[0.2em]">
              Encrypted Tunnel
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
