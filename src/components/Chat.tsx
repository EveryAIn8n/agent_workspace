import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Send, User, Bot } from "lucide-react";
import { cn } from "../lib/utils";

export function Chat() {
  const [input, setInput] = useState("");
  const sessionId = "default-session"; // Hardcoded for now
  const messages = useQuery(api.messages.list, { sessionId }) || [];
  const sendMessage = useMutation(api.messages.send);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    await sendMessage({
      body: input,
      author: "User",
      sessionId,
    });
    
    setInput("");
    
    // Simulate agent response
    setTimeout(async () => {
      await sendMessage({
        body: "I am your agent. How can I help with your Kanban board today?",
        author: "Agent",
        sessionId,
      });
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 w-96">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Bot size={20} className="text-blue-400" />
          Agent Chat
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg: any) => (
          <div
            key={msg._id}
            className={cn(
              "flex flex-col max-w-[85%] rounded-lg p-3",
              msg.author === "User" 
                ? "bg-blue-600 ml-auto" 
                : "bg-slate-800 mr-auto"
            )}
          >
            <span className="text-xs opacity-50 mb-1 flex items-center gap-1">
              {msg.author === "User" ? <User size={10} /> : <Bot size={10} />}
              {msg.author}
            </span>
            <p className="text-sm">{msg.body}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-800">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="w-full bg-slate-800 border border-slate-700 rounded-full py-2 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
