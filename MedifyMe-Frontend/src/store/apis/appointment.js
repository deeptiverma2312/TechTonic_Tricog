import axios from "axios";

// Use proxy during development (no need to hardcode localhost)
const SERVER_URL = import.meta.env.VITE_SERVER_URL || "";

export const sendPatientReport = async (patientData, responses) => {
  try {
    const res = await axios.post(`${SERVER_URL}/api/send-report`, {
      patientData,
      responses,
    });
    return res.data;
  } catch (err) {
    console.error("Failed to send report:", err.response || err);
    throw err;
  }
};
