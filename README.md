# 🌾 KrishiMitra - AI-Powered Agricultural Advisory System

![KrishiMitra Banner](https://img.shields.io/badge/KrishiMitra-AI_Agriculture-green)
![Python](https://img.shields.io/badge/Python-3.14-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.139-green)
![React](https://img.shields.io/badge/React-19-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-cyan)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)

## 🌍 Problem Statement

Nepal is among the **top 10 most climate-vulnerable countries** globally, with **80% of natural disasters** triggered by extreme rainfall and temperature swings. Farmers often "gamble" every season, planting too early or too late. With **agriculture employing two-thirds of Nepal's population**, there is an urgent need for accessible, localized agricultural advisory systems.

## 🎯 Solution

**KrishiMitra** is an AI-powered agricultural advisory system that sends personalized, village-level weather forecasts and farming advice to farmers via SMS, WhatsApp, or voice calls. It uses AI to analyze weather data and provides actionable tips: when to sow, irrigate, fertilize, or harvest.

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🌤️ **Weather Prediction** | AI models analyze 30+ years of local weather data |
| 📍 **Village-level Forecasts** | 3-day, 7-day, and seasonal outlooks |
| 🌐 **Multilingual Support** | Nepali + English (more languages coming) |
| 📱 **Multiple Delivery Channels** | SMS, WhatsApp, Voice (works on basic phones) |
| 📊 **Analytics Dashboard** | Visual insights on farmers, crops, and trends |
| 👨‍🌾 **Farmer Management** | Register and manage farmers with crop details |
| 💡 **AI Advisory** | Generate crop-specific farming advice based on weather |

## 🛠️ Tech Stack

### Frontend
- **React 19** with Vite
- **Tailwind CSS** for styling
- **Chart.js** for analytics visualizations
- **i18next** for multilingual support

### Backend
- **Python 3.14** with **FastAPI**
- **PostgreSQL** for database
- **SQLAlchemy** ORM
- **JWT** for authentication (coming soon)

### AI/ML
- **LSTM** for weather prediction
- **XGBoost** for crop yield prediction
- **Hugging Face Transformers** for NLP

### APIs & Integration
- **OpenWeatherMap API** for weather data
- **wttr.in** (free alternative)


## 📊 System Architecture
┌─────────────────────────────────────────────────────────────┐
│ KrishiMitra System │
├─────────────────────────────────────────────────────────────┤
│ │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│ │ React │ │ FastAPI │ │ PostgreSQL │ │
│ │ Frontend │◄──►│ Backend │◄──►│ Database │ │
│ │ (Vite) │ │ (Python) │ │ │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ │
│ │ │ │ │
│ ▼ ▼ ▼ │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│ │ Chart.js │ │ Weather │ │ Twilio │ │
│ │ Analytics │ │ APIs │ │ SMS │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ │
│ │
└─────────────────────────────────────────────────────────────┘
## 📁 Project Structure
krishimitra/
├── backend/
│ ├── app/
│ │ ├── main.py # FastAPI application
│ │ ├── database.py # PostgreSQL connection
│ │ ├── models.py # SQLAlchemy models
│ │ ├── services/
│ │ │ ├── weather_service.py
│ │ │ ├── advisory_service.py
│ │ │ └── sms_service.py
│ │ └── utils/
│ ├── requirements.txt
│ └── .env
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ │ ├── Dashboard.jsx
│ │ │ ├── Analytics.jsx
│ │ │ └── LanguageSwitcher.jsx
│ │ ├── i18n/
│ │ │ └── index.js
│ │ ├── App.jsx
│ │ └── main.jsx
│ ├── package.json
│ └── tailwind.config.js
├── ml_models/
│ └── weather_prediction_xgboost.py
├── database/
│ └── schema.sql
├── docker-compose.yml
├── .env
└── README.md


🌐 API Endpoints
Method	Endpoint	Description
GET	/	API information
GET	/health	Health check
POST	/api/weather/free	Get weather (free, no key)
POST	/api/weather/current	Get weather (OpenWeather)
POST	/api/advisory/generate	Generate farming advice
POST	/api/farmers/register	Register a farmer
GET	/api/farmers/list	List all farmers

🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request
