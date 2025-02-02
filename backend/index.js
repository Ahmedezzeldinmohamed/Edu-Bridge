const connectToMongo = require("./Database/db");
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

connectToMongo();

const port = process.env.PORT || 5000;  // التأكد من قيمة الـ PORT

// إعدادات CORS
const corsOptions = {
  origin: (origin, callback) => {
    // تأكد إذا كانت القيمة الخاصة بـ FRONTEND_API_LINK موجودة أو لا
    const allowedOrigins = [process.env.FRONTEND_API_LINK || 'http://localhost:3000'];
    
    // إذا كان الـ origin في قائمة الـ allowedOrigins، سيتم السماح بالوصول
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not Allowed By CORS"));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,  // لو بتحتاج إرسال الكوكيز أو الهيدر مع الطلبات
  preflightContinue: false,
};

app.use(cors(corsOptions));  // تفعيل الـ CORS باستخدام الإعدادات

app.use(express.json());  // لتحويل بيانات الـ request إلى JSON

// التعامل مع طلبات OPTIONS بشكل خاص
app.options("*", cors(corsOptions));  // السماح بطلبات OPTIONS

app.get("/", (req, res) => {
  res.send("Hello 👋 I am Working Fine 🚀");
});

app.use('/media', express.static(path.join(__dirname, 'media')));

app.use("/api", require("./routes/assistant.route"));
// Credential Apis
app.use("/api/student/auth", require("./routes/Student Api/credential.route"));
app.use("/api/faculty/auth", require("./routes/Faculty Api/credential.route"));
app.use("/api/admin/auth", require("./routes/Admin Api/credential.route"));
// Details Apis
app.use("/api/student/details", require("./routes/Student Api/details.route"));
app.use("/api/faculty/details", require("./routes/Faculty Api/details.route"));
app.use("/api/admin/details", require("./routes/Admin Api/details.route"));
// Other Apis
app.use("/api/timetable", require("./routes/Other Api/timetable.route"));
app.use("/api/material", require("./routes/Other Api/material.route"));
app.use("/api/notice", require("./routes/Other Api/notice.route"));
app.use("/api/subject", require("./routes/Other Api/subject.route"));
app.use("/api/marks", require("./routes/Other Api/marks.route"));
app.use("/api/branch", require("./routes/Other Api/branch.route"));
app.use("/api/ai-material", require("./routes/Other Api/aiMaterial.route"));

app.listen(port, () => {
  console.log(`Server Listening On http://localhost:${port}`);
});
