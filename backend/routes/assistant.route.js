const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/message", async (req, res) => {
  const { message } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(message);
    const response = await result.response;
    const assistantMessage = response.text();

    res.json({ success: true, message: assistantMessage });
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({ success: false, message: "Error processing request" });
  }
});

module.exports = router;