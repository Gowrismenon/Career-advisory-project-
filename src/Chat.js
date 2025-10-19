import { useState } from "react";

function Chat() {
  const [userInput, setUserInput] = useState("");
  const [reply, setReply] = useState("");
  
  const handleSend = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });
      
      const data = await response.json();
      setReply(data.reply); // 👈 show AI response
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Ask AI about Upskilling</h2>
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Type a question..."
        style={{ width: "300px", padding: "8px" }}
      />
      <button onClick={handleSend} style={{ marginLeft: "10px" }}>
        Send
      </button>

      {<div style={{ marginTop: "20px" }}>
          <b>AI:</b> {reply.split('\n').map((line, idx) => (
    <p key={idx}>{line}</p>
  ))}
        </div>
      }
    </div>
  );
}

export default Chat;
