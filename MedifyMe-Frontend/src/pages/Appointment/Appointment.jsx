import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./Appointment.module.css";
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

function Appointment() {
  const [loading, setLoading] = useState(false);

  const handleConfirmAppointment = async () => {
    setLoading(true);
    try {
      const patientData = {
        name: "John Doe", // Replace with logged-in patient’s data
        email: "john@example.com",
        phone: "9876543210",
      };

      const responses = [
        { symptom: "Heart", question: "Do you feel chest pain?", answer: "Yes" },
        { symptom: "Heart", question: "Any palpitations?", answer: "No" },
      ];

      // 1️⃣ Send report to Telegram
      await axios.post("/api/send-report", { patientData, responses });

      // 2️⃣ Schedule Google Calendar meeting
  const meetingRes = await axios.post("http://localhost:8080/api/schedule-meeting", {
  patientName: patientData.name,
  patientEmail: patientData.email,
  patientPhone: patientData.phone,
});


      toast.success(`Appointment confirmed! Meeting link: ${meetingRes.data.meetingLink}`);
    } catch (err) {
      console.error("❌ Failed to confirm:", err);
      toast.error("Failed to confirm appointment. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.grid_container}>
        {/* LEFT SIDE */}
        <div className={styles.left_wrapper}>
          <div className={styles.t1}>History</div>
          <div className={styles.docs}>
            <div className={styles.doc1}>
              <img src="doc.webp" alt="doctor" />
              <div>
                <div className={styles.t2}>Cardiologist</div>
                <div className={styles.t3}>Dr. Roman Reigns</div>
              </div>
              <div className={styles.date}>&#128197; 20 Jan 2023</div>
            </div>
          </div>

          <div className={styles.t1}>Doctors Suggestions</div>
          <div className={styles.docsu}>
            <div className={styles.doc1}>
              <img src="doc.webp" alt="doctor" />
              <div>
                <div className={styles.t2}>Cardiologist</div>
                <div className={styles.t3}>Dr. Roman Reigns</div>
              </div>
              <div className={styles.date}>&#128197; 20 Jan 2023</div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className={styles.right_wrapper}>
          <div className={styles.doctors_identity}>
            <div className={styles.grid_container2}>
              <img className={styles.img} src="image7.webp" alt="doctor" />
              <div className={styles.doctors_identity_content}>
                <p className={styles.doctors_identity_content1}>John Wilson</p>
                <p className={styles.doctors_identity_content2}>Cardiologist</p>
                <p className={styles.doctors_identity_content3}>
                  Time : 4:00pm - 5:00pm
                </p>
              </div>
            </div>
          </div>

          {/* Appointment confirm button */}
          <div
            className={styles.pay}
            onClick={!loading ? handleConfirmAppointment : undefined}
            style={{
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Scheduling..." : "Confirm Appointment"}
          </div>
        </div>
      </div>
    </>
  );
}

export default Appointment;
