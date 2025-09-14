import express from "express";
import cors from "cors";
import { OpenAI } from "openai";

const app = express();
app.use(express.json());
app.use(cors());

const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HF_TOKEN, // Hugging Face token
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ reply: "Message required" });

    const chatCompletion = await client.chat.completions.create({
      model: "openai/gpt-oss-120b:cerebras", // Hugging Face OSS 120B model
      messages: [
        {
          role: "system",
          content: `
You are a friendly AI tutor.
- Always give short, concise answers.
- Respond in plain text only.
- Do NOT use tables, Markdown formatting, or images.
- Show equations in plain text only, e.g., x^2 + y^2 = z^2.
- Avoid long textbook dumps.
- Keep it student-friendly and clear.
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
