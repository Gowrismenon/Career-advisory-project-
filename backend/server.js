// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  console.log("Received:", message);
  try {
    //console.log(process.env.OPENAI_API_KEY);
    const response = await fetch(
      "https://psacodesprint2025.azure-api.net/openai/deployments/gpt-4.1-nano/chat/completions?api-version=2025-01-01-preview",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key":"52dbccc9fe35400da314e3770f756e2d",
        },
        body: JSON.stringify({
          model:"gpt-4.1-nano",
          messages: [{ role: "user", content: message }],
          max_tokens: 200,
          temperature: 1,
        }),
      }
    );

    const data = await response.json();
    console.log(data);
    const reply = data.choices?.[0]?.message?.content || "No response";
    res.json({ reply });
  } catch (err) {
    console.error("OpenAI request failed:", err);
    res.status(500).json({ reply: "Error occurred" });
  }
});
app.get("/api/chat", (req, res) => {
  res.send("GET route exists — use POST for chat");
});

app.listen(5001, () => console.log("Server running on http://localhost:5001"));
