import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '@env';

class VoiceAssistantService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    this.conversationHistory = [];
  }


  buildPrompt(userQuery, userProfile = null) {
    let systemContext = `You are a helpful financial assistant integrated into a mobile app.
Your role is to:
- Answer questions clearly and concisely
- Provide financial advice and guidance
- Help users understand their expenses and budgets
- Be conversational and friendly
- Keep responses brief (2-3 sentences max for voice)
- Always respond in a natural, spoken manner

`;

    if (userProfile) {
      systemContext += `User Profile:
- Name: ${userProfile.name || 'User'}
- Total Expenses: ₹${userProfile.totalExpenses || 0}
- Budget: ₹${userProfile.budget || 0}
- Recent Categories: ${userProfile.recentCategories?.join(', ') || 'None'}

`;
    }


    let conversationContext = '';
    if (this.conversationHistory.length > 0) {
      conversationContext = '\nRecent Conversation:\n';
      this.conversationHistory.slice(-6).forEach(msg => {
        conversationContext += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.text}\n`;
      });
    }

    return `${systemContext}${conversationContext}\nUser: ${userQuery}\nAssistant:`;
  }


  async getResponse(userQuery, userProfile = null) {
    try {
      const prompt = this.buildPrompt(userQuery, userProfile);

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();


      this.conversationHistory.push(
        { role: 'user', text: userQuery },
        { role: 'assistant', text: text }
      );


      if (this.conversationHistory.length > 20) {
        this.conversationHistory = this.conversationHistory.slice(-20);
      }

      return text;
    } catch (error) {
      console.error('Gemini API Error:', error);


      return this.getFallbackResponse(userQuery);
    }
  }


  getFallbackResponse(query) {
    const lowerQuery = query.toLowerCase();


    if (lowerQuery.match(/\b(hello|hi|hey|good morning|good evening)\b/)) {
      return "Hello! How can I help you with your finances today?";
    }


    if (lowerQuery.match(/\b(expense|spent|spending|cost)\b/)) {
      return "I can help you track your expenses. Would you like to add a new expense or review your spending?";
    }


    if (lowerQuery.match(/\b(budget|save|saving)\b/)) {
      return "Managing your budget is important. I can help you set spending limits and track your savings goals.";
    }


    if (lowerQuery.match(/\b(help|what can you do|features)\b/)) {
      return "I can help you track expenses, manage budgets, analyze spending patterns, and answer financial questions. Just ask me anything!";
    }


    return "I'm here to help with your financial questions. Could you please rephrase that?";
  }


  clearHistory() {
    this.conversationHistory = [];
  }


  getHistory() {
    return this.conversationHistory;
  }
}

export default new VoiceAssistantService();
