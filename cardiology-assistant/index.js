const express = require('express');
const TelegramService = require('./telegram');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Initialize Telegram service
const telegramService = new TelegramService();

// API endpoint to send telegram message
app.post('/api/send-report', async (req, res) => {
    try {
        const { patientData, responses } = req.body;
        
        // Validate required data
        if (!patientData || !patientData.name || !patientData.email) {
            return res.status(400).json({ 
                error: 'Missing required patient data (name, email)' 
            });
        }

        if (!responses || !Array.isArray(responses)) {
            return res.status(400).json({ 
                error: 'Missing or invalid responses data' 
            });
        }

        // Send telegram message
        const result = await telegramService.sendPatientReport(patientData, responses);
        
        res.json({ 
            success: true, 
            message: 'Report sent to doctor successfully',
            telegramResult: result
        });

    } catch (error) {
        console.error('Error sending report:', error);
        res.status(500).json({ 
            error: 'Failed to send report', 
            details: error.message 
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Telegram service initialized`);
});