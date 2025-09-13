import Navbar from "../../components/Navbar/Navbar";
import styles from "./HealthHistory.module.css";
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function HealthHistory() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const messageListRef = useRef(null);
  
  const [currentPatient, setCurrentPatient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Get patient data from localStorage
    const patientData = localStorage.getItem('currentPatient');
    if (patientData) {
      const patient = JSON.parse(patientData);
      setCurrentPatient(patient);
      
      // Add initial welcome message
      setMessages([{
        role: "assistant",
        content: `Hello ${patient.name}! I'm your AI medical assistant for cardiology consultations. I see you're registered with email ${patient.email}. I'll help collect your health information to assist with your care. What symptoms or health concerns brought you here today?`,
        timestamp: new Date().toISOString()
      }]);
    } else {
      // If no patient data, redirect to registration
      toast.error("Please register first");
      navigate("/register");
      return;
    }
  }, [navigate]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessageToBackend = async (userMessage) => {
    setIsLoading(true);
    
    try {
      // Add user message to chat immediately
      const userMsg = {
        role: "user", 
        content: userMessage,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, userMsg]);
      
      // Prepare conversation history for backend
      const conversationHistory = [...messages, userMsg];
      
      // Call backend API with user ID and conversation
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/patients/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentPatient.id,
          message: userMessage,
          conversationHistory: conversationHistory
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from server');
      }

      const data = await response.json();
      
      // Add AI response to chat
      const aiMsg = {
        role: "assistant",
        content: data.response,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, aiMsg]);
      
      // Check if conversation is complete
      if (data.isComplete) {
        setIsCompleted(true);
        toast.success("Consultation complete! Doctor has been notified.");
      }
      
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
      
      // Add error message to chat
      const errorMsg = {
        role: "assistant",
        content: "I'm sorry, I'm having trouble connecting right now. Please try again.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    const userInput = inputRef.current.value.trim();
    if (!userInput || isLoading || isCompleted) return;
    
    // Clear input immediately
    inputRef.current.value = "";
    
    // Send to backend
    await sendMessageToBackend(userInput);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Don't render until we have patient data
  if (!currentPatient) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div>Loading patient data...</div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className={styles.patientInfo}>
        <div className={styles.patientCard}>
          <h2>Patient Information</h2>
          <div className={styles.patientDetails}>
            <div className={styles.infoRow}>
              <span className={styles.label}>Name:</span>
              <span className={styles.value}>{currentPatient.name}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Email:</span>
              <span className={styles.value}>{currentPatient.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className={styles.chatContainer}>
        <div className={styles.chatHeader}>
          <h3>AI Medical Assistant - Cardiology Consultation</h3>
          <div className={styles.status}>
            {isCompleted ? "✅ Completed" : "🔄 In Progress"}
          </div>
        </div>
        
        <div className={styles.messageList} ref={messageListRef}>
          {messages.map((message, i) => (
            <div
              key={i}
              className={`${styles.message} ${
                message.role === "assistant" ? styles.incoming : styles.outgoing
              }`}
            >
              <div className={styles.messageContent}>
                <div className={styles.messageText}>{message.content}</div>
                <div className={styles.messageTime}>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className={`${styles.message} ${styles.incoming}`}>
              <div className={styles.messageContent}>
                <div className={styles.typing}>AI is typing...</div>
              </div>
            </div>
          )}
        </div>
        
        <div className={styles.messageInput}>
          <input
            type="text"
            placeholder={isCompleted ? "Consultation completed" : "Type your message here..."}
            onKeyPress={handleKeyPress}
            ref={inputRef}
            disabled={isLoading || isCompleted}
            className={styles.textInput}
          />
          <button 
            onClick={handleSendMessage} 
            className={styles.sendButton}
            disabled={isLoading || isCompleted}
          >
            {isLoading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </>
  );
}

export default HealthHistory;