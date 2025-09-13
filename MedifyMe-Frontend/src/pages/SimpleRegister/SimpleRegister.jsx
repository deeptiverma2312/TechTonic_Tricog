import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./SimpleRegister.module.css";

function SimpleRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      toast.error("Please fill in both name and email");
      return;
    }

    if (!email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/patients/simple-register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();

      if (data.status === 201) {
        toast.success("Registration successful! Welcome to HeartifyMe");
        // Store basic patient info in localStorage for this session
        localStorage.setItem('currentPatient', JSON.stringify({
          id: data.patient.id,
          name: data.patient.name,
          email: data.patient.email
        }));
        navigate("/health_history"); // Go to chat assistant
      } else if (data.status === 200) {
        toast.info("Welcome back! Redirecting to your health assistant...");
        localStorage.setItem('currentPatient', JSON.stringify({
          id: data.patient._id,
          name: data.patient.name,
          email: data.patient.email
        }));
        navigate("/health_history");
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <h1 className={styles.title}>Welcome to HeartifyMe</h1>
          <p className={styles.subtitle}>
            Your AI-powered medical assistant for cardiology consultations
          </p>
          
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="name" className={styles.label}>
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className={styles.input}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className={styles.input}
                required
              />
            </div>

            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Start Health Assessment"}
            </button>
          </form>

          <div className={styles.features}>
            <h3>What you'll get:</h3>
            <ul>
              <li>AI-powered symptom assessment</li>
              <li>Personalized health insights</li>
              <li>Direct connection with cardiologists</li>
              <li>Secure health record management</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default SimpleRegister;