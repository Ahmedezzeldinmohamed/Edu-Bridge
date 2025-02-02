const { GoogleGenerativeAI } = require("@google/generative-ai");

// إنشاء مثيل من Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // استخدم المفتاح من ملف .env

exports.getAssistantResponse = async (req, res) => {
  const { message } = req.body;

  try {
    // تحديد النموذج (مثل "gemini-pro")
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // إعداد الـ prompt
    const prompt = `You are a helpful assistant for students in a college. ${message}`;

    // إرسال الرسالة والحصول على الرد
    const result = await model.generateContent(prompt);

    const response = await result.response;
    const assistantMessage = response.text();

    res.json({ success: true, message: assistantMessage });
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({ success: false, message: "Error processing request" });
  }
};