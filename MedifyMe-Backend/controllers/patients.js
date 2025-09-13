const axios = require("axios");
const Patient = require("../models/patient");
const Doctor = require("../models/doctor");
const Visit = require("../models/visit");
const Request = require("../models/request");
const Prescription = require("../models/prescription");
const Test = require("../models/test");

const path = require("path");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Use environment variable
});

const FormData = require("form-data");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Hardcoded patient for hackathon (no auth needed)
const HARDCODED_PATIENT = {
  _id: "hackathon_patient_001",
  name: "John Doe",
  email: "john.doe@example.com",
  age: 35,
  gender: "male",
  height: 175,
  weight: 70,
  photo: "https://via.placeholder.com/150",
  allergies: "None",
  otherConditions: "None",
  medications: "None",
  overview: "Healthy individual seeking cardiology consultation",
  visits: [],
  prescriptions: [],
  tests: [],
  doctors: [],
  requests: []
};

const uploadFile = (file, OCR) => {
  return new Promise((resolve, reject) => {
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const resourceType = fileExtension === ".pdf" ? "raw" : "image";

    cloudinary.uploader
      .upload_stream(
        { resource_type: resourceType, folder: "MedifyMe" },
        async (error, result) => {
          if (error) {
            console.error(`Cloudinary upload failed: ${error.message}`, error);
            return reject(new Error("Cloudinary upload failed"));
          }
          const fileUrl = result.secure_url;

          if (OCR && resourceType === "image") {
            const ocrApiKey = process.env.OCR_API_KEY;
            const formData = new FormData();
            formData.append("url", fileUrl);
            formData.append("OCREngine", 5);
            formData.append("filetype", "PNG");

            const config = {
              headers: {
                apikey: ocrApiKey,
                "Content-Type": "image/png",
              },
            };
            try {
              const response = await axios.post(
                "https://api.ocr.space/parse/image",
                formData,
                config
              );
              const ocrText = response.data.ParsedResults[0].ParsedText;
              const content = `Please analyze the plain text obtained via OCR from an image of a prescription. The text is: ${ocrText} Provide the dosage, precautions, and pointers for each medicine listed. Additionally, include a section on Medicine General Information that highlights the potential condition the combination of medicines may indicate. Finally, offer 2-3 general health suggestions and facts related to the conditions that these medicines may cure. Send the output in HTML format, only using the tags <p>, <h3> <ul> and <li>. Do not use any inverted commas or /n`;
              const { data } = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                temperature: 0.5,
                messages: [{ role: "user", content }],
              });
              const gptResults = data.choices[0].message.content;
              const result = {
                url: fileUrl,
                ocr: gptResults,
              };
              resolve(result);
            } catch (err) {
              console.error(`OCR request failed: ${err.message}`, err);
              reject(new Error("OCR request failed"));
            }
          } else {
            resolve(fileUrl);
          }
        }
      )
      .end(file.buffer);
  });
};

// REMOVED: login function (not needed for hackathon)

// REMOVED: register function (using hardcoded patient)

// Simplified health history - returns hardcoded patient data
module.exports.healthHistory = async (req, res) => {
  try {
    res.status(200).json(HARDCODED_PATIENT);
  } catch (err) {
    console.log(err);
    res.status(400).json("Something Went Wrong!");
  }
};

// Simplified health history form - no patient ID required
module.exports.healthHistoryForm = async (req, res) => {
  try {
    const fileUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fileUrl = await uploadFile(file, false);
        fileUrls.push(fileUrl);
      }
    }

    const visit = new Visit({
      date: req.body.date || new Date().toISOString(),
      doctorComments: req.body.doctorComments || "",
      patientComments: req.body.patientComments || "",
      doctorName: req.body.doctorName || "Dr. Smith",
      patient: HARDCODED_PATIENT._id,
      fileUrl: fileUrls,
    });

    // For hackathon, just return the visit data without saving to DB
    console.log("Visit data collected:", visit);
    res.status(200).json(visit);
  } catch (err) {
    console.log(err);
    res.status(400).json("Something Went Wrong!");
  }
};

// Simplified prescription - returns hardcoded data
module.exports.prescription = async (req, res) => {
  try {
    res.status(200).json(HARDCODED_PATIENT);
  } catch (err) {
    console.log(err);
    res.status(400).json("Something Went Wrong!");
  }
};

// Simplified prescription form
module.exports.prescriptionForm = async (req, res) => {
  try {
    const fileResults = [];
    
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fileData = await uploadFile(file, true);
        fileResults.push({ url: fileData.url, ocr: fileData.ocr || null });
      }
    }

    const prescription = {
      date: req.body.date || new Date().toISOString(),
      medications: req.body.medications || "",
      prescriptionComments: req.body.prescriptionComments || "",
      patient: HARDCODED_PATIENT._id,
      files: fileResults,
    };

    console.log("Prescription data collected:", prescription);
    res.status(200).json(prescription);
  } catch (err) {
    console.error("Error in prescriptionForm:", err);
    res.status(400).json("Something Went Wrong!");
  }
};

// Simplified test - returns hardcoded data
module.exports.test = async (req, res) => {
  try {
    res.status(200).json(HARDCODED_PATIENT);
  } catch (err) {
    console.log(err);
    res.status(400).json("Something Went Wrong!");
  }
};

// Simplified test form
module.exports.testForm = async (req, res) => {
  try {
    const fileResults = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const ocrResult = await uploadFile(file, true);
        fileResults.push(ocrResult);
      }
    }

    const test = {
      date: req.body.date || new Date().toISOString(),
      testName: req.body.testName || "",
      testComments: req.body.testComments || "",
      patient: HARDCODED_PATIENT._id,
      files: fileResults,
    };

    console.log("Test data collected:", test);
    res.status(200).json(test);
  } catch (err) {
    console.log(err);
    res.status(400).json("Something Went Wrong!");
  }
};

// Simplified visits
module.exports.visits = async (req, res) => {
  try {
    const mockVisit = {
      _id: "visit_001",
      date: new Date().toISOString(),
      doctorName: "Dr. Smith",
      patientComments: "Feeling chest pain",
      doctorComments: "Needs further evaluation",
      patient: HARDCODED_PATIENT._id,
      fileUrl: []
    };
    res.status(200).json(mockVisit);
  } catch (err) {
    console.log(err);
    res.status(400).json("Something Went Wrong!");
  }
};

// REMOVED: requestDoctor function (not needed for hackathon)

// NEW: Function to collect patient data from chat for hackathon
module.exports.collectPatientData = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      age, 
      symptoms, 
      responses,
      conversationData 
    } = req.body;

    const patientData = {
      ...HARDCODED_PATIENT,
      name: name || HARDCODED_PATIENT.name,
      email: email || HARDCODED_PATIENT.email,
      age: age || HARDCODED_PATIENT.age,
      symptoms: symptoms || [],
      responses: responses || [],
      conversationData: conversationData || [],
      collectedAt: new Date().toISOString()
    };

    // Log for hackathon demo
    console.log("=== PATIENT DATA COLLECTED ===");
    console.log("Name:", patientData.name);
    console.log("Email:", patientData.email);
    console.log("Symptoms:", patientData.symptoms);
    console.log("Responses:", patientData.responses);
    console.log("===============================");

    // TODO: Here you would:
    // 1. Send Telegram notification to doctor
    // 2. Schedule Google Calendar appointment
    // 3. Save to database if needed

    res.status(200).json({
      message: "Patient data collected successfully",
      data: patientData,
      status: 200
    });
  } catch (err) {
    console.error("Error collecting patient data:", err);
    res.status(400).json("Error collecting patient data");
  }
};

// Add this function to your controllers/patients.js

module.exports.simpleRegister = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Basic validation
    if (!name || !email) {
      return res.status(400).json({ 
        message: "Name and email are required", 
        status: 400 
      });
    }

    // Check if patient already exists
    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      return res.status(200).json({
        message: "Patient already exists",
        patient: existingPatient,
        status: 200
      });
    }

    // Create new patient with basic info
    const patient = new Patient({
      name: name,
      email: email,
      age: null,
      gender: null,
      height: null,
      weight: null,
      allergies: "Not specified",
      otherConditions: "Not specified", 
      medications: "Not specified",
      overview: "New patient - information to be collected",
      photo: "https://via.placeholder.com/150", // Default avatar
      visits: [],
      prescriptions: [],
      tests: [],
      doctors: [],
      requests: []
    });

    await patient.save();

    console.log("=== NEW PATIENT REGISTERED ===");
    console.log("Name:", patient.name);
    console.log("Email:", patient.email);
    console.log("ID:", patient._id);
    console.log("===============================");

    res.status(201).json({
      message: "Patient registered successfully",
      patient: {
        id: patient._id,
        name: patient.name,
        email: patient.email
      },
      status: 201
    });

  } catch (error) {
    console.error("Error registering patient:", error);
    res.status(500).json({ 
      message: "Error registering patient", 
      status: 500 
    });
  }
};

// Add this function to your controllers/patients.js

module.exports.chat = async (req, res) => {
  try {
    const { userId, message, conversationHistory } = req.body;

    if (!userId || !message) {
      return res.status(400).json({
        error: "User ID and message are required",
        status: 400
      });
    }

    // Get patient from database
    let patient;
    try {
      patient = await Patient.findById(userId);
      if (!patient) {
        return res.status(404).json({
          error: "Patient not found",
          status: 404
        });
      }
    } catch (err) {
      console.log("Patient lookup failed, using hardcoded data for demo");
      patient = { name: "Demo Patient", email: "demo@example.com" };
    }

    // System prompt for medical assistant
    const systemPrompt = `You are HeartifyMe's AI medical assistant specializing in cardiology consultations. 

IMPORTANT RULES:
- You are speaking with ${patient.name}
- Ask ONE question at a time and wait for response
- Do NOT provide medical diagnoses or treatment advice
- Do NOT use your own medical knowledge to make conclusions
- ONLY collect information according to these symptom rules:

SYMPTOM DATABASE RULES:
For "chest pain": Ask about onset time, constant vs intermittent, activity relation, pain scale 1-10, radiation to arm/neck/jaw
For "shortness of breath": Ask about duration, rest vs activity occurrence, other symptoms like cough/wheeze, heart/lung history, medications  
For "fatigue": Ask about duration, rest effectiveness, light activity tolerance, sleep changes, other symptoms
For "dizziness": Ask about triggers, spinning sensation, position changes, fainting episodes, medications
For "palpitations": Ask about frequency, triggers, duration, associated symptoms, caffeine intake
For "swelling": Ask about location, time of day, severity, associated symptoms, medication history

PROCESS:
1. First, identify what symptoms the patient mentions
2. For each symptom, ask the follow-up questions listed above
3. Ask questions in a logical order
4. Be empathetic and professional
5. When you have collected information for all mentioned symptoms, thank the patient and say "I have collected all the necessary information. A cardiologist will be notified and will contact you soon to schedule an appointment."

Keep responses concise and conversational.`;

    // Prepare messages for OpenAI
    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.3,
      max_tokens: 200
    });

    const aiResponse = completion.choices[0].message.content;

    // Check if conversation is complete
    const isComplete = aiResponse.toLowerCase().includes("cardiologist will be notified") && 
                       aiResponse.toLowerCase().includes("contact you soon");

    // Log conversation for hackathon demo
    console.log("=== CHAT INTERACTION ===");
    console.log("Patient:", patient.name);
    console.log("User Input:", message);
    console.log("AI Response:", aiResponse);
    console.log("Is Complete:", isComplete);
    console.log("========================");

    // If conversation is complete, trigger notifications
    if (isComplete) {
      // Extract symptoms and responses from conversation
      const symptoms = extractSymptomsFromConversation(conversationHistory);
      const patientResponses = conversationHistory
        .filter(msg => msg.role === "user")
        .map(msg => msg.content);

      // TODO: Send Telegram notification to doctor
      // TODO: Schedule Google Calendar appointment
      
      console.log("=== CONSULTATION COMPLETE ===");
      console.log("Patient:", patient.name);
      console.log("Email:", patient.email);
      console.log("Symptoms identified:", symptoms);
      console.log("Patient responses:", patientResponses);
      console.log("==============================");
    }

    res.status(200).json({
      response: aiResponse,
      isComplete: isComplete,
      timestamp: new Date().toISOString(),
      status: 200
    });

  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({
      error: "Failed to process chat message",
      details: error.message,
      status: 500
    });
  }
};

// Helper function to extract symptoms from conversation
function extractSymptomsFromConversation(conversationHistory) {
  const symptoms = [];
  const symptomKeywords = [
    "chest pain", "shortness of breath", "fatigue", "dizziness", 
    "palpitations", "swelling", "irregular heartbeat", "rapid heartbeat"
  ];
  
  const allText = conversationHistory
    .filter(msg => msg.role === "user")
    .map(msg => msg.content.toLowerCase())
    .join(" ");
  
  symptomKeywords.forEach(symptom => {
    if (allText.includes(symptom)) {
      symptoms.push(symptom);
    }
  });
  
  return symptoms;
}