import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config({
  path: ".env",
});

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // allow your frontend during development
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const userInput = req.body.input;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.OPENAI_API_KEY}`,
      {
        contents: [{ parts: [{ text: userInput }] }],
      }
    );
    const botReply =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I don't understand.";
    res.json({ reply: botReply });
  } catch (error) {
    console.error("API error:", error.response?.data || error.message);
    res.status(500).json({ reply: "Oops! Something went wrong." });
  }
});

export default app;
