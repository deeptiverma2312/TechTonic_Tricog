// routes/sendReport.js
const express = require("express");
const router = express.Router();
const TelegramService = require("./telegram");

// Initialize Telegram service
const telegramService = new TelegramService();

// POST /api/send-report
router.post("/", async (req, res) => {
  try {
    const { patientData, responses } = req.body;

    // ✅ Validate data
    if (!patientData || !patientData.name || !patientData.email) {
      return res.status(400).json({
        error: "Missing required patient data (name, email)",
      });
    }

    if (!responses || !Array.isArray(responses)) {
      return res.status(400).json({
        error: "Missing or invalid responses data",
      });
    }

    // ✅ Format and send message
    const result = await telegramService.sendPatientReport(patientData, responses);

    res.json({
      success: true,
      message: "Report sent to doctor successfully!",
      telegramResult: result,
    });
  } catch (error) {
    console.error("❌ Error sending report:", error.message);
    res.status(500).json({
      error: "Failed to send report",
      details: error.message,
    });
  }
});

module.exports = router; // ✅ Export router

