import express from "express";
import cors from "cors";
import { OpenAI } from "openai";

const app = express();
app.use(express.json());
app.use(cors());

// Hugging Face via OpenAI-compatible client
const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HF_TOKEN, // Render injects this from "Environment Variables"
});

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ reply: "Message required" });
    }

    const chatCompletion = await client.chat.completions.create({
      model: "openai/gpt-oss-120b:cerebras", // OSS model on Hugging Face
      messages: [{ role: "user", content: message }],
    });

    const reply = chatCompletion.choices[0]?.message?.content || "No reply";
    res.json({ reply });
  } catch (err) {
    console.error("Chat error:", err.message);
    res.status(500).json({ reply: "⚠️ AI service not available right now." });
  }
});

// Render assigns PORT automatically
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`✅ Server running on port ${port}`));
