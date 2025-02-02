const connectToMongo = require("./Database/db");
const express = require("express");
const app = express();
const path = require("path");
connectToMongo();

const port = process.env.PORT || 5000;  // التأكد من قيمة الـ PORT
const cors = require("cors");
const assistantRoute = require("./routes/assistant.route");
const aiMaterialRoute = require("./routes/Other Api/aiMaterial.route");

const corsOptions = {
  origin: process.env.FRONTEND_API_LINK || '*',  // إضافة خيار الفتحة لو مفيش رابط
};

app.use(cors(corsOptions));

app.use(express.json());  // لتحويل بيانات الـ request إلى JSON

app.get("/", (req, res) => {
  res.send("Hello 👋 I am Working Fine 🚀");
});

app.use('/media', express.static(path.join(__dirname, 'media')));

app.use("/api", assistantRoute);
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
app.use("/api/ai-material", aiMaterialRoute);

app.listen(port, () => {
  console.log(`Server Listening On http://localhost:${port}`);
});
