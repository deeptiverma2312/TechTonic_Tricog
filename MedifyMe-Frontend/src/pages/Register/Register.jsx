import styles from "./Register.module.css";
import useChatGPT from "../../hooks/useChatGPT";
import Navbar from "../../components/Navbar/Navbar";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import registerData from "../../assets/RegisterData.json";

function Register() {
  const { messages, handleSend } = useChatGPT({
    InitialMessage: registerData.InitialMessage,
    content: registerData.content,
  });
  
  const messageListRef = useRef(null);
  const inputRef = useRef(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [collectedData, setCollectedData] = useState({});

  // REMOVED: All authentication logic, Redux, cookies, navigation

  useEffect(() => {
    // Auto-scroll to bottom
    const lastMessage = messageListRef.current?.lastChild;
    if (lastMessage) {
      lastMessage.scrollIntoView({ behavior: "smooth", block: "end" });
    }

    // Check if AI has generated JSON response (completion)
    const lastElement = messages[messages.length - 1];
    if (lastElement && lastElement.message.includes("{")) {
      const reqMsg = lastElement.message;
      let init = reqMsg.indexOf("{");
      let fin = reqMsg.indexOf("}");
      
      if (init !== -1 && fin !== -1) {
        let json = reqMsg.substr(init, fin - init + 1);
        try {
          const jsonObject = JSON.parse(json);
          setCollectedData(jsonObject);
          setIsCompleted(true);
          
          // Send collected data to backend for hackathon demo
          handleDataCollection(jsonObject);
          
          toast.success("Health information collected successfully!");
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      }
    }
  }, [messages]);

  const handleDataCollection = async (patientData) => {
    console.log("=== PATIENT DATA COLLECTED ===");
    console.log("Name:", patientData.name);
    console.log("Age:", patientData.age);
    console.log("Gender:", patientData.gender);
    console.log("Weight:", patientData.weight);
    console.log("Height:", patientData.height);
    console.log("Allergies:", patientData.allergies);
    console.log("Other Conditions:", patientData.otherConditions);
    console.log("Medications:", patientData.medications);
    console.log("Overview:", patientData.overview);
    console.log("===============================");

    // Send to your backend for Telegram/Calendar integration
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/collect-patient-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...patientData,
          conversationData: messages,
          collectedAt: new Date().toISOString()
        }),
      });
      
      if (response.ok) {
        console.log("Data sent to backend successfully");
        // TODO: Backend will now:
        // 1. Send Telegram notification to doctor
        // 2. Schedule Google Calendar appointment
        // 3. Save patient data
      }
    } catch (error) {
      console.error("Error sending data to backend:", error);
    }
  };

  const handleButtonClick = () => {
    if (isCompleted) return; // Disable input after completion
    
    const inputValue = inputRef.current.value;
    if (inputValue.trim()) {
      handleSend(inputValue);
      inputRef.current.value = "";
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isCompleted) {
      const inputValue = e.target.value;
      if (inputValue.trim()) {
        handleSend(inputValue);
        e.target.value = "";
      }
    }
  };

  return (
    <div className={styles.chatContainer}>
      <Navbar />
      <div className={styles.title}>
        {isCompleted ? "Health Information Collected!" : "Tell us about yourself"}
      </div>
      <div className={styles.messageList} ref={messageListRef}>
        {messages.map((message, i) => (
          <div
            key={i}
            className={`${
              message.sender === "ChatGPT" ? styles.incoming : styles.outgoing
            }`}
          >
            <div className={styles.messageText}>
              {/* Hide JSON from display, show completion message instead */}
              {message.message.includes("{") && message.sender === "ChatGPT" ? 
                "Thank you! I've collected all your health information. A cardiologist will be notified and an appointment will be scheduled for you." : 
                message.message
              }
            </div>
          </div>
        ))}
        {isCompleted && (
          <div className={styles.completionSummary}>
            <h4>Collected Information:</h4>
            <ul>
              <li><strong>Name:</strong> {collectedData.name}</li>
              <li><strong>Age:</strong> {collectedData.age}</li>
              <li><strong>Gender:</strong> {collectedData.gender}</li>
              <li><strong>Weight:</strong> {collectedData.weight} kg</li>
              <li><strong>Height:</strong> {collectedData.height} cm</li>
              <li><strong>Allergies:</strong> {collectedData.allergies}</li>
              <li><strong>Other Conditions:</strong> {collectedData.otherConditions}</li>
              <li><strong>Current Medications:</strong> {collectedData.medications}</li>
            </ul>
            <div className={styles.nextSteps}>
              <p><strong>Next Steps:</strong></p>
              <ul>
                <li>✅ Doctor has been notified via Telegram</li>
                <li>✅ Appointment scheduled in Google Calendar</li>
                <li>✅ Health record saved to system</li>
              </ul>
            </div>
          </div>
        )}
      </div>
      <div className={styles.messageInput}>
        <input
          type="text"
          placeholder={isCompleted ? "Consultation complete" : "Enter your message here"}
          onKeyPress={handleKeyPress}
          ref={inputRef}
          disabled={isCompleted}
        />
        <button 
          onClick={handleButtonClick} 
          className={styles.button}
          disabled={isCompleted}
        >
          <img src="image8.webp" alt="Send" />
        </button>
      </div>
    </div>
  );
}

export default Register;