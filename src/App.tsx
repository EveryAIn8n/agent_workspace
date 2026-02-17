import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

export default function App() {
  const sessionId = "default-session";
  const messages = useQuery(api.messages.list, { sessionId });
  const sendMessage = useMutation(api.messages.send);
  
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    await sendMessage({ body: input, author: "User", sessionId });
    setInput("");
  };

  // Loading state
  if (messages === undefined) {
    return <div style={{ background: "#0b0e14", color: "white", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading connection to Convex...</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", backgroundColor: "#0b0e14", color: "white", margin: 0 }}>
      <header style={{ padding: "1rem", borderBottom: "1px solid #1e293b", textAlign: "center" }}>
        <h1 style={{ margin: 0, fontSize: "1.2rem" }}>Antigravity Chat v1.0.3</h1>
      </header>
      
      <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
        {messages.length === 0 && <p style={{ textAlign: "center", color: "#64748b" }}>No messages yet. Say hi!</p>}
        {messages.map((msg: any) => (
          <div key={msg._id} style={{ marginBottom: "1rem", textAlign: msg.author === "User" ? "right" : "left" }}>
            <div style={{ display: "inline-block", padding: "0.5rem 1rem", borderRadius: "1rem", background: msg.author === "User" ? "#2563eb" : "#1e293b" }}>
              {msg.body}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} style={{ padding: "1rem", borderTop: "1px solid #1e293b", display: "flex", gap: "0.5rem" }}>
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          style={{ flex: 1, padding: "0.5rem", borderRadius: "0.5rem", border: "1px solid #334155", background: "#1e293b", color: "white" }} 
          placeholder="Type here..."
        />
        <button type="submit" style={{ padding: "0.5rem 1rem", background: "#2563eb", color: "white", border: "none", borderRadius: "0.5rem", cursor: "pointer" }}>Send</button>
      </form>
    </div>
  );
}
