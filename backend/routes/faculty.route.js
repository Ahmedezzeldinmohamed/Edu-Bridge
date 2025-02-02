const express = require("express");
const multer = require("multer");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// إعداد Multer لرفع الملفات
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "./media";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Route لرفع الملفات
router.post("/upload-material", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded." });
    }

    console.log("File received:", req.file);

    const filePath = req.file.path;
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // استخراج النص من الملف
    const fileContent = await extractTextFromFile(filePath);
    console.log("Extracted text:", fileContent);

    // توليد الأسئلة والأجوبة
    const prompt = `قم بإنشاء أسئلة وأجوبة بناءً على النص التالي:\n\n${fileContent}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const questionsAnswers = response.text();
    console.log("AI response:", questionsAnswers);

    res.json({ success: true, questionsAnswers });
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({ success: false, message: "Error processing file" });
  }
});

// دالة لاستخراج النص من الملف
const extractTextFromFile = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error("Error extracting text from file:", error);
    throw new Error("Failed to extract text from file.");
  }
};

module.exports = router;