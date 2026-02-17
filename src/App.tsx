import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

export default function App() {
  const [input, setInput] = useState("");
  const sessionId = "default-session";
  const messages = useQuery(api.messages.list, { sessionId }) || [];
  const sendMessage = useMutation(api.messages.send);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    await sendMessage({
      body: input,
      author: "User",
      sessionId,
    });
    setInput("");
  };

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      height: "100vh", 
      backgroundColor: "#0b0e14", 
      color: "#e1e7ef",
      fontFamily: "Inter, system-ui, sans-serif" 
    }}>
      <header style={{ 
        padding: "1rem 2rem", 
        borderBottom: "1px solid #1e293b",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <h1 style={{ fontSize: "1.25rem", fontWeight: "bold", margin: 0 }}>Antigravity Chat</h1>
        <span style={{ fontSize: "0.75rem", color: "#64748b" }}>v1.0.2 • Connected</span>
      </header>
      
      <div style={{ 
        flex: 1, 
        overflowY: "auto", 
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem"
      }}>
        {messages.map((msg: any) => (
          <div key={msg._id} style={{ 
            alignSelf: msg.author === "User" ? "flex-end" : "flex-start",
            maxWidth: "70%"
          }}>
            <div style={{ 
              padding: "0.75rem 1rem", 
              borderRadius: "1rem", 
              backgroundColor: msg.author === "User" ? "#2563eb" : "#1e293b",
              borderBottomRightRadius: msg.author === "User" ? "0.25rem" : "1rem",
              borderBottomLeftRadius: msg.author === "User" ? "1rem" : "0.25rem",
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
            }}>
              <p style={{ margin: 0, fontSize: "0.9375rem", lineHeight: "1.5" }}>{msg.body}</p>
            </div>
            <div style={{ 
              fontSize: "0.7rem", 
              color: "#64748b", 
              marginTop: "0.25rem",
              textAlign: msg.author === "User" ? "right" : "left"
            }}>
              {msg.author}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} style={{ 
        padding: "1.5rem 2rem", 
        borderTop: "1px solid #1e293b",
        backgroundColor: "#0b0e14"
      }}>
        <div style={{ position: "relative", maxWidth: "800px", margin: "0 auto" }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            style={{ 
              width: "100%", 
              padding: "0.75rem 1.25rem", 
              borderRadius: "9999px", 
              border: "1px solid #334155", 
              backgroundColor: "#1e293b", 
              color: "white",
              outline: "none",
              fontSize: "0.9375rem"
            }}
          />
          <button type="submit" style={{ 
            position: "absolute",
            right: "0.5rem",
            top: "50%",
            transform: "translateY(-50%)",
            padding: "0.4rem 1rem", 
            backgroundColor: "#2563eb", 
            color: "white", 
            border: "none", 
            borderRadius: "9999px", 
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "0.875rem"
          }}>
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
