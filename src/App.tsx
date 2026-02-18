import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../convex/_generated/api";

export default function App() {
  const sessionId = "default-session";
  
  // Explicitly type the query result to satisfy TypeScript
  const messages = useQuery(api.messages.list, { sessionId });
  const handleUserMessage = useAction(api.actions.handleUserMessage);

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const currentInput = input;
    setInput(""); // Optimistic clear
    try {
      await handleUserMessage({ body: currentInput, author: "User", sessionId });
    } catch (err) {
      console.error("Send Error:", err);
      setInput(currentInput); // Rollback on error
    }
  };

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      height: "100vh", 
      backgroundColor: "#1a1a1a", 
      color: "white", 
      margin: 0,
      padding: 0,
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }}>
      <header style={{ padding: "10px", background: "#333", borderBottom: "1px solid #444", textAlign: "center" }}>
        <h1 style={{ margin: 0, fontSize: "1rem" }}>Antigravity v1.0.6</h1>
      </header>
      
      <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
        {messages === undefined ? (
          <p>Connecting to database...</p>
        ) : messages.length === 0 ? (
          <p style={{ color: "#888" }}>No messages. Backend is connected.</p>
        ) : (
          messages.map((msg: any) => (
            <div key={msg._id} style={{ margin: "5px 0", textAlign: msg.author === "User" ? "right" : "left" }}>
              <div style={{ 
                display: "inline-block", 
                padding: "8px 12px", 
                borderRadius: "10px", 
                background: msg.author === "User" ? "#007bff" : "#444" 
              }}>
                {msg.body}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} style={{ padding: "10px", background: "#222", display: "flex", gap: "5px" }}>
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          style={{ flex: 1, padding: "8px", borderRadius: "5px", border: "1px solid #444", background: "#000", color: "#fff" }} 
          placeholder="Say hello..."
        />
        <button type="submit" style={{ padding: "8px 15px", background: "#007bff", color: "#fff", border: "none", borderRadius: "5px" }}>
          Send
        </button>
      </form>
    </div>
  );
}
