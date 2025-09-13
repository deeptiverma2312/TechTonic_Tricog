const express = require("express");
const router = express.Router();
const patients = require("../controllers/patients");
const catchAsync = require("../utils/catchAsync");
const Multer = require("multer");

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // No larger than 50mb, change as you need
  },
});

// REMOVED: Authentication routes (not needed for hackathon)
// router.route("/login").post(catchAsync(patients.login));
// router.route("/register").post(catchAsync(patients.register));

// Simplified routes - no authentication required
router
  .route("/health_history")
  .get(patients.healthHistory)
  .post(multer.array("files"), patients.healthHistoryForm);

router
  .route("/prescription")
  .get(patients.prescription)
  .post(multer.array("files"), patients.prescriptionForm);

router
  .route("/tests")
  .get(patients.test)
  .post(multer.array("files"), patients.testForm);

router.route("/visits").get(patients.visits);

// REMOVED: Doctor request functionality (not needed for hackathon)
// router.route("/request_doctor").post(patients.requestDoctor);

// NEW: Route for collecting patient data from chat assistant
router.route("/collect-patient-data").post(catchAsync(patients.collectPatientData));
router.route("/simple-register").post(catchAsync(patients.simpleRegister));
router.route("/chat").post(catchAsync(patients.chat));


module.exports = router;