import express from "express";
import cors from "cors";
import { OpenAI } from "openai";

const app = express();
app.use(express.json());
app.use(cors());

const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HF_TOKEN, // Render secret
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ reply: "Message required" });

    const chatCompletion = await client.chat.completions.create({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      messages: [
        {
          role: "system",
          content: `
You are a friendly AI tutor. 
- Explain step by step, short and clear.
- Use LaTeX for math ($...$ inline, $$...$$ block).
- Use Markdown tables when needed.
- Avoid long textbook dumps.
- Keep it student-friendly.
          `,
        },
        { role: "user", content: message },
      ],
    });

    const reply = chatCompletion.choices[0]?.message?.content || "No reply";
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "⚠️ AI service not available right now." });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server running on port ${port}`));
