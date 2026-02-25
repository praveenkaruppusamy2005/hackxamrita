# FinApp

FinApp is a powerful, AI-driven financial literacy and management application built with React Native. It simplifies financial concepts and provides interactive tools for users to manage their finances, learn about government schemes, and simulate real-world financial transactions.

---

## Features

### AI Voice Assistant

Integrated with ElevenLabs Agent for a natural, voice-driven interaction experience.

### Financial Simulations

* UPI Payment Simulation – Practice digital payments in a safe environment.
* Net Banking Simulation – Learn how to navigate online banking portals.
* Investment Simulation – Explore different investment options and their potential returns.

### Government Schemes

Real-time information on various government schemes to help users access relevant financial aid.

### Loan Eligibility

A built-in calculator to check loan eligibility based on user profile details.

### Multilingual Support

Accessible in both English and Tamil to cater to a wider audience.

### Secure Onboarding

Multi-step onboarding process with AES-256 encryption for sensitive user data.

### Interactive Dashboard

A modern dashboard to track expenses and financial goals.

---

## Tech Stack

### Frontend

* React Native
* React Navigation
* Lucide React Native
* HugeIcons

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### AI / ML

* ElevenLabs Conversational AI
* Google Generative AI (Gemini)

### Services

* AWS Translate (for dynamic translations)
* AES-256 encryption

---

## Getting Started

### Prerequisites

* Node.js (>= 22.11.0)
* React Native CLI
* Android Studio or Xcode

### Installation

Clone the repository:

```bash
git clone <repository-url>
```

Install dependencies:

```bash
cd FinApp
npm install
```

Set up environment variables:

Create a `.env` file in the `FinApp` directory and add your API keys (ElevenLabs, AWS, Google AI).

Run the application:

```bash
# For Android
npm run android

# For iOS
npm run ios
```

---

## Project Structure

```
FinApp/
│
├── backend/      # Node.js server and API routes
├── screens/      # UI screens for various features
├── services/     # API integration and utility services
└── .git/         # Git repository configuration
```
