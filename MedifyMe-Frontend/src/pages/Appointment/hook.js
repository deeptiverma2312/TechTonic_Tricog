import React, { useState } from "react";
import { sendPatientReport } from "../utils/api"; // the function above

function ReportForm() {
  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [responses, setResponses] = useState([
    { symptom: "Heart", question: "Do you feel chest pain?", answer: "" },
  ]);
  const [status, setStatus] = useState("");

  const handleSubmit = async () => {
    const patientData = { name: patientName, email: patientEmail };
    try {
      const result = await sendPatientReport(patientData, responses);
      setStatus(result.message);
    } catch (error) {
      setStatus("Failed to send report. Try again.");
    }
  };

  return (
    <div>
      <h2>Send Patient Report</h2>
      <input
        type="text"
        placeholder="Name"
        value={patientName}
        onChange={(e) => setPatientName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={patientEmail}
        onChange={(e) => setPatientEmail(e.target.value)}
      />
      {/* Render response inputs dynamically */}
      {responses.map((r, idx) => (
        <div key={idx}>
          <label>{r.question}</label>
          <input
            type="text"
            value={r.answer}
            onChange={(e) => {
              const newResponses = [...responses];
              newResponses[idx].answer = e.target.value;
              setResponses(newResponses);
            }}
          />
        </div>
      ))}

      <button onClick={handleSubmit}>Send Report</button>

      {status && <p>{status}</p>}
    </div>
  );
}

export default ReportForm;
