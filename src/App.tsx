import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

export default function App() {
  const [input, setInput] = useState("");
  const sessionId = "default-session";
  const messages = useQuery(api.messages.list, { sessionId }) || [];
  const sendMessage = useMutation(api.messages.send);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    console.log("Sending:", input);
    await sendMessage({
      body: input,
      author: "User",
      sessionId,
    });
    setInput("");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", backgroundColor: "#0f172a", color: "white", height: "100vh" }}>
      <h1>Agent Chat (Simple)</h1>
      
      <div style={{ border: "1px solid #334155", height: "70vh", overflowY: "auto", marginBottom: "20px", padding: "10px", borderRadius: "8px" }}>
        {messages.map((msg: any) => (
          <div key={msg._id} style={{ margin: "10px 0", textAlign: msg.author === "User" ? "right" : "left" }}>
            <div style={{ display: "inline-block", padding: "8px 12px", borderRadius: "12px", backgroundColor: msg.author === "User" ? "#2563eb" : "#1e293b" }}>
              <small style={{ opacity: 0.5, display: "block" }}>{msg.author}</small>
              {msg.body}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type 'Hi'..."
          style={{ flex: 1, padding: "10px", borderRadius: "4px", border: "1px solid #334155", backgroundColor: "#1e293b", color: "white" }}
        />
        <button type="submit" style={{ padding: "10px 20px", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          Send
        </button>
      </form>
    </div>
  );
}
