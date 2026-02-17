import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

export default function App() {
  const sessionId = "default-session";
  
  // Use a try-catch pattern inside the component if possible, 
  // but for now, let's just use a console log to see if this even runs.
  console.log("App Component Rendering...");

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fallback for when Convex is not yet connected
  let messages;
  try {
    messages = useQuery(api.messages.list, { sessionId });
  } catch (e) {
    console.error("Convex Query Error:", e);
  }

  const sendMessage = useMutation(api.messages.send);

  useEffect(() => {
    console.log("Messages updated:", messages);
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    try {
      await sendMessage({ body: input, author: "User", sessionId });
      setInput("");
    } catch (err) {
      console.error("Send Error:", err);
      alert("Failed to send: " + err);
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
        <h1 style={{ margin: 0, fontSize: "1rem" }}>Antigravity v1.0.5</h1>
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
