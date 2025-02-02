const connectToMongo = require("./Database/db");
const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();

// Connect to MongoDB
connectToMongo();

const port = process.env.PORT || 5000;

// Set up CORS options
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [process.env.FRONTEND_API_LINK || 'http://localhost:3000'];
    
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not Allowed By CORS"));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,  // Allows cookies to be sent
  preflightContinue: false,
};

// Apply CORS middleware
app.use(cors(corsOptions)); 

// Middleware for JSON parsing
app.use(express.json());

// Handle preflight OPTIONS request
app.options("*", cors(corsOptions)); 

// Routes
app.get("/", (req, res) => {
  res.send("Hello 👋 I am Working Fine 🚀");
});

// Static file serving
app.use('/media', express.static(path.join(__dirname, 'media')));

// API Routes
const assistantRoute = require("./routes/assistant.route");
const studentCredentialRoute = require("./routes/Student Api/credential.route");
const facultyCredentialRoute = require("./routes/Faculty Api/credential.route");
const adminCredentialRoute = require("./routes/Admin Api/credential.route");

const studentDetailsRoute = require("./routes/Student Api/details.route");
const facultyDetailsRoute = require("./routes/Faculty Api/details.route");
const adminDetailsRoute = require("./routes/Admin Api/details.route");

const timetableRoute = require("./routes/Other Api/timetable.route");
const materialRoute = require("./routes/Other Api/material.route");
const noticeRoute = require("./routes/Other Api/notice.route");
const subjectRoute = require("./routes/Other Api/subject.route");
const marksRoute = require("./routes/Other Api/marks.route");
const branchRoute = require("./routes/Other Api/branch.route");
const aiMaterialRoute = require("./routes/Other Api/aiMaterial.route");

app.use("/api", assistantRoute);
app.use("/api/student/auth", studentCredentialRoute);
app.use("/api/faculty/auth", facultyCredentialRoute);
app.use("/api/admin/auth", adminCredentialRoute);

app.use("/api/student/details", studentDetailsRoute);
app.use("/api/faculty/details", facultyDetailsRoute);
app.use("/api/admin/details", adminDetailsRoute);

app.use("/api/timetable", timetableRoute);
app.use("/api/material", materialRoute);
app.use("/api/notice", noticeRoute);
app.use("/api/subject", subjectRoute);
app.use("/api/marks", marksRoute);
app.use("/api/branch", branchRoute);
app.use("/api/ai-material", aiMaterialRoute);

// Start the server
app.listen(port, () => {
  console.log(`Server Listening On http://localhost:${port}`);
});
