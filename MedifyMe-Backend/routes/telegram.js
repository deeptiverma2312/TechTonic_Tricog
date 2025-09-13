const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

class TelegramService {
    constructor() {
        this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {polling: false});
        this.doctorChatId = process.env.DOCTOR_CHAT_ID;
    }

    async sendPatientReport(patientData, responses) {
        const report = this.formatPatientReport(patientData, responses);
        
        try {
            const result = await this.bot.sendMessage(this.doctorChatId, report, {
                parse_mode: 'HTML',
                disable_web_page_preview: true
            });
            
            console.log('✅ Telegram message sent successfully!');
            return result;
        } catch (error) {
            console.error('❌ Failed to send Telegram message:', error.message);
            throw error;
        }
    }

    formatPatientReport(patientData, responses) {
        const currentTime = new Date().toLocaleString();
        
        let report = `🏥 <b>NEW PATIENT CONSULTATION REQUEST</b>\n\n`;
        
        report += `👤 <b>Patient Information:</b>\n`;
        report += `• Name: ${patientData.name}\n`;
        report += `• Email: ${patientData.email}\n`;
        if (patientData.phone) report += `• Phone: ${patientData.phone}\n`;
        report += `• Request Time: ${currentTime}\n\n`;

        report += `💔 <b>Reported Symptoms & Responses:</b>\n`;

        // Group responses by symptom for better readability
        const symptomGroups = this.groupResponsesBySymptom(responses);
        
        Object.keys(symptomGroups).forEach((symptom, index) => {
            report += `\n${index + 1}. <b>${symptom.toUpperCase()}</b>\n`;
            
            symptomGroups[symptom].forEach((response, qIndex) => {
                report += `   <i>Q${qIndex + 1}:</i> ${response.question}\n`;
                report += `   <i>A${qIndex + 1}:</i> ${response.answer}\n`;
            });
        });

        report += `\n⏰ <b>Status:</b> Calendar invite will be sent to patient\n`;
        report += `📧 <b>Next Steps:</b> Please review and confirm appointment\n`;
        
        return report;
    }

    groupResponsesBySymptom(responses) {
        return responses.reduce((groups, response) => {
            const symptom = response.symptom || 'General Questions';
            if (!groups[symptom]) {
                groups[symptom] = [];
            }
            groups[symptom].push(response);
            return groups;
        }, {});
    }

    // Method to get chat ID (useful for setup)
    async getUpdates() {
        try {
            const updates = await this.bot.getUpdates();
            console.log('Recent updates:', updates);
            return updates;
            
        } catch (error) {
            console.error('Error getting updates:', error);
        }
    }
}

module.exports = TelegramService;