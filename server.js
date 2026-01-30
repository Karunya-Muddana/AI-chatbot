import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';
import 'dotenv/config'; // Loads variables from .env if running locally

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// OpenAI Client Configuration
const client = new OpenAI({
  baseURL: 'https://router.huggingface.co/v1',
  apiKey: process.env.HF_TOKEN, 
});

// Health Check Route
app.get('/', (req, res) => {
  res.send('AI Chatbot Server is running 🚀');
});

// Chat API Route
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const chatCompletion = await client.chat.completions.create({
      model: 'openai/gpt-oss-120b:cerebras',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful and concise AI assistant.'
        },
        {
          role: 'user',
          content: message,
        },
      ],
      max_tokens: 500,
    });

    const reply = chatCompletion.choices[0].message.content;
    res.json({ reply });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch response from AI',
      details: error.message 
    });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is purring on port ${PORT}`);
});
