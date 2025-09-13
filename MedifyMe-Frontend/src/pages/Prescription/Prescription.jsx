import Navbar from "../../components/Navbar/Navbar";
import styles from "./Prescription.module.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import DocumentPreview from "../../components/DocumentPreview/DocumentPreview";

function Prescription() {
  // HARDCODED mock data for hackathon
  const MOCK_PRESCRIPTIONS = [
    {
      date: "2024-01-15",
      medications: "Lisinopril 10mg, Metformin 500mg",
      prescriptionComments: "Take as prescribed for blood pressure and diabetes management",
      files: [
        {
          url: "https://via.placeholder.com/300x400/e1f5fe/01579b?text=Prescription+1",
          ocr: "<p><strong>Prescription Analysis:</strong></p><ul><li><strong>Lisinopril 10mg:</strong> Take once daily in the morning. Monitor blood pressure regularly.</li><li><strong>Metformin 500mg:</strong> Take twice daily with meals to reduce stomach upset.</li></ul><h3>General Information:</h3><p>These medications are commonly prescribed together for patients with both hypertension and type 2 diabetes.</p><ul><li>Monitor blood glucose levels daily</li><li>Check blood pressure weekly</li><li>Stay hydrated and maintain regular exercise</li></ul>"
        }
      ]
    },
    {
      date: "2024-02-10",
      medications: "Aspirin 81mg, Atorvastatin 20mg",
      prescriptionComments: "Low-dose aspirin for cardiovascular protection, statin for cholesterol",
      files: [
        {
          url: "https://via.placeholder.com/300x400/f3e5f5/6a1b9a?text=Prescription+2",
          ocr: "<p><strong>Prescription Analysis:</strong></p><ul><li><strong>Aspirin 81mg:</strong> Take once daily with food. Low-dose for heart protection.</li><li><strong>Atorvastatin 20mg:</strong> Take once daily in the evening. Monitor liver function.</li></ul><h3>General Information:</h3><p>This combination is effective for cardiovascular risk reduction in patients with elevated cholesterol.</p><ul><li>Follow low-cholesterol diet</li><li>Regular exercise recommended</li><li>Avoid grapefruit juice with statin</li></ul>"
        }
      ]
    }
  ];

  const [selectedPrescription, setSelectedPrescription] = useState(MOCK_PRESCRIPTIONS[0]);

  // REMOVED: All authentication logic, Redux selectors, API calls

  return (
    <>
      <Navbar />
      <div className={styles.PreH}>
        <div className={styles.t1}>Prescription History</div>
        <div className={styles.docs}>
          {MOCK_PRESCRIPTIONS.map((prescription, index) => (
            <div
              className={
                selectedPrescription !== prescription
                  ? styles.doc1
                  : styles.selected
              }
              key={index}
              onClick={() => setSelectedPrescription(prescription)}
            >
              <div className={styles.date}>{prescription.date}</div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.button}>
        <Link to="/prescription_form">
          <div className={styles.b}>Add New Prescription</div>
        </Link>
      </div>
      <div className={styles.currMed}>
        <div className={styles.t1}>Current Medications</div>
        <div className={styles.cm}>
          <div className={styles.title}>
            <div className={styles.namet}>Name</div>
            <div className={styles.dosaget}>Dosage</div>
          </div>
          <div className={styles.con}>
            <ol>
              <li>
                <p>Lisinopril:</p>
                <p className={styles.d}>10mg once daily</p>
              </li>
              <li>
                <p>Metformin:</p> 
                <p className={styles.d}>500mg twice daily</p>
              </li>
              <li>
                <p>Aspirin:</p> 
                <p className={styles.d}>81mg once daily</p>
              </li>
              <li>
                <p>Atorvastatin:</p>
                <p className={styles.d}>20mg once daily</p>
              </li>
            </ol>
          </div>
        </div>
        <div className={styles.inst}>
          <div className={styles.b}>AI-Generated Instructions</div>
        </div>
        <div className={styles.dinfo}>
          <ol>
            {selectedPrescription &&
              selectedPrescription.files.map((eachFile, index) => (
                <li
                  key={index}
                  dangerouslySetInnerHTML={{ __html: eachFile.ocr }}
                ></li>
              ))}
          </ol>
        </div>
      </div>

      <div className={styles.currentPres}>
        <div className={styles.ct}>
          <div className={styles.ct1}>Current Prescription</div>
          <div className={styles.ct2}>{selectedPrescription?.date || "Recent"}</div>
        </div>
        <div className={styles.cont}>
          <div className={styles.leftcont}>
            {selectedPrescription &&
              selectedPrescription.files.map((eachFile, index) => (
                <div
                  key={index}
                  dangerouslySetInnerHTML={{ __html: eachFile.ocr }}
                ></div>
              ))}
          </div>
          <div className={styles.photo}>
            <div className={styles.uploadedImg}>
              <div className={styles.documentst}>Prescription Documents</div>
              <div className={styles.centerimgs}>
                <div className={styles.imgGrid}>
                  {selectedPrescription &&
                    selectedPrescription.files.map((eachFile, index) => (
                      <div key={index}>
                        <DocumentPreview fileUrl={eachFile.url} />
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.hackathonNote}>
          <p><strong>Demo Note:</strong> This shows how your AI assistant can analyze prescription images using OCR and provide medication guidance, dosage information, and health recommendations.</p>
        </div>
      </div>
    </>
  );
}

export default Prescription;