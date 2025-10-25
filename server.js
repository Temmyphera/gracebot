const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize OpenAI client with the environment variable
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "no-api-key-found",
});

// Default route to confirm server is running
app.get("/", (req, res) => {
  res.send("✨ GraceBot is live and listening!");
});

// Chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "Missing API key on server." });
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are GraceBot, a warm and caring student counselling assistant. Speak gently, with empathy and encouragement.",
        },
        { role: "user", content: userMessage },
      ],
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error("❌ Error talking to OpenAI:", error);
    res.status(500).json({ error: "AI request failed." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ GraceBot running on port ${PORT}`));
