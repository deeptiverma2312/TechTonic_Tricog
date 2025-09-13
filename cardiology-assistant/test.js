const TelegramService = require('./telegram');
require('dotenv').config();

async function testTelegramMessage() {
    console.log('🧪 Testing Telegram message...');
    
    const telegram = new TelegramService();
    
    // Sample patient data
    const patientData = {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1234567890"
    };

    // Sample responses (matching your symptom structure)
    const responses = [
        {
            symptom: "Chest Pain / Discomfort",
            question: "When did the pain start and what were you doing at that time?",
            answer: "The pain started 2 hours ago while I was watching TV"
        },
        {
            symptom: "Chest Pain / Discomfort",
            question: "Can you describe the pain (pressure, squeezing, sharp, burning)?",
            answer: "It feels like pressure and squeezing in the center of my chest"
        },
        {
            symptom: "Shortness of Breath (Dyspnea)",
            question: "Is the breathlessness at rest or with exertion?",
            answer: "It happens even when I'm sitting still"
        }
    ];

    try {
        await telegram.sendPatientReport(patientData, responses);
        console.log('✅ Test message sent successfully!');
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run the test
testTelegramMessage();