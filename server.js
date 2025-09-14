import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';

const app = express();
app.use(express.json());
app.use(cors());

const client = new OpenAI({
  baseURL: 'https://router.huggingface.co/v1',
  apiKey: process.env.HF_TOKEN, // Ensure this environment variable is set
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ reply: 'Message required' });

    const chatCompletion = await client.chat.completions.create({
      model: 'openai/gpt-oss-120b:cerebras',
      messages: [
        {
          role: 'system',
          content: `
