if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const morgan = require("morgan");

const patientRoutes = require("./routes/patients");
const doctorRoutes = require("./routes/doctors");
const gptRoutes = require("./routes/gpt");
// const paymentRoutes = require("./routes/payment");
const meetRoutes = require("./routes/meet");
const sendReportRoutes = require("./routes/sendreport");
const sendMeetingRoutes = require("./routes/sendmeeting"); // ✅ New route

mongoose
  .connect(process.env.MONGO_URI, {
    serverApi: { version: "1", strict: true, deprecationErrors: true },
  })
  .then(() => console.log("✅ Mongo Is Running"))
  .catch((err) => console.error("❌ Mongo Error:", err));

const app = express();
// const corsOptions = {
//   origin: "http://localhost:5173", // your frontend
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// };
// app.use(cors(corsOptions));
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(morgan("dev"));

app.use((req, res, next) => {
  res.set("X-Content-Type-Options", "nosniff");
  next();
});
app.set("views", path.join(__dirname, "views"));

// 👇 Routes
app.get("/", async (req, res) => {
  res.send("home");
});

app.use("/api/gpt", gptRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
// app.use("/api/payments", paymentRoutes);
app.use("/api/meet", meetRoutes);
app.use("/api/send-report", sendReportRoutes);
app.use("/api/schedule-meeting", sendMeetingRoutes); // ✅ Added backend route

app.all("*", (req, res) => {
  res.status(404).send("Page Not Found Yo");
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`🚀 Server Started on http://localhost:${port}`);
});
