# FinApp - Digital Munshi 🚀

Digital Munshi is a powerful, AI-driven financial literacy and management application built with **React Native**. It aims to simplify financial concepts and provide interactive tools for users to manage their finances, learn about government schemes, and simulate real-world financial transactions.

## ✨ Features

- **🤖 AI Voice Assistant**: Integrated with **ElevenLabs Agent** for a natural, voice-driven interaction experience.
- **💰 Financial Simulations**:
    - **UPI Payment Simulation**: Practice digital payments in a safe environment.
    - **Net Banking Simulation**: Learn how to navigate online banking portals.
    - **Investment Simulation**: Explore different investment options and their potential returns.
- **📜 Govt Schemes**: Real-time information on various government schemes to help users access relevant financial aid.
- **🏦 Loan Eligibility**: A built-in calculator to check loan eligibility based on user profile.
- **🌐 Multilingual Support**: Accessible in both **English** and **Tamil** to cater to a wider audience.
- **🔒 Secure Onboarding**: Multi-step onboarding process with **AES-256 encryption** for sensitive user data.
- **📊 Interactive Dashboard**: A sleek, modern dashboard (Digital Munshi) to track expenses and financial goals.

## 🛠️ Tech Stack

- **Frontend**: React Native, React Navigation, Lucide React Native, HugeIcons.
- **Backend**: Express.js, Node.js.
- **Database**: MongoDB.
- **AI/ML**: ElevenLabs Conversational AI, Google Generative AI (Gemini).
- **Services**: AWS Translate (for dynamic translations), AES-256 encryption.

## 🚀 Getting Started

### Prerequisites

- Node.js (>= 22.11.0)
- React Native CLI
- Android Studio / Xcode

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Install dependencies:
   ```bash
   cd FinApp
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the `FinApp` directory and add your API keys (ElevenLabs, AWS, Google AI).

4. Run the application:
   ```bash
   # For Android
   npm run android

   # For iOS
   npm run ios
   ```

## 📂 Project Structure

- `FinApp/`: Main React Native application.
    - `backend/`: Node.js server and API routes.
    - `screens/`: UI screens for various features.
    - `services/`: API integration and utility services.
- `.git/`: Git repository configuration.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
