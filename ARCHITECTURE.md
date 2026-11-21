# DengueWatch AI – System Architecture

## 1. Project Overview

DengueWatch AI is a ward-level dengue prediction and risk monitoring platform. It uses historical dengue cases, weather conditions, and ward vulnerability indicators to estimate dengue cases 2, 3, and 4 weeks ahead.

## 2. Technology Stack

| Component | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Data Visualization | Chart.js |
| Backend | Node.js, Express.js |
| AI / Machine Learning | Python, Scikit-learn |
| AI API Framework | FastAPI |
| Database | Supabase |
| Model Storage | Joblib |
| Deployment | Vercel (Frontend) |

## 3. System Architecture

The application follows a layered architecture:

**Frontend Layer**
- Provides the user interface and dashboard.
- Displays dengue predictions, ward comparisons, weather analytics, and historical data.
- Communicates with the Express backend using HTTP requests.

**Backend Layer**
- Built with Node.js and Express.js.
- Handles API requests from the frontend.
- Communicates with the FastAPI prediction service using Axios.
- Connects with Supabase for database operations.

**AI / Machine Learning Layer**
- Built with Python, FastAPI, and Scikit-learn.
- Uses three separate Random Forest models.
- Generates dengue case predictions for 2, 3, and 4 weeks ahead.
- Assigns risk classifications using the configured risk thresholds.

**Database Layer**
- Uses Supabase for storing and retrieving application data.
- Supports ward information, historical dengue records, and risk prediction data.

## 4. Prediction Workflow

1. The user selects a city and ward from the frontend.
2. The frontend sends a prediction request to the Express backend.
3. Express forwards the request to the FastAPI `/predict` endpoint using Axios.
4. FastAPI receives the required 21 input features.
5. The three trained Random Forest models generate predictions for 2, 3, and 4 weeks ahead.
6. The AI service returns predicted case counts and risk classifications.
7. Express forwards the response to the frontend.
8. The frontend displays the prediction results using dashboard components and charts.

## 5. API Communication

**Express Backend**
- Local URL: `http://127.0.0.1:5000`
- Prediction endpoint: `POST /api/predict`

**FastAPI AI Service**
- Local URL: `http://127.0.0.1:8000`
- Prediction endpoint: `POST /predict`
- API documentation: `/docs`

## 6. Machine Learning Models

Three Random Forest models are trained independently:

- `dengue_model_2w.joblib`
- `dengue_model_3w.joblib`
- `dengue_model_4w.joblib`

The models use historical dengue cases, weather variables, and ward vulnerability indicators to estimate future dengue cases.

## 7. Risk Assessment

The system supports two related risk outputs:

- **ML Risk Level:** Based on the model's predicted cases and configured risk classification thresholds.
- **Application Risk Score:** Can combine predicted dengue incidence with ward vulnerability indicators.

These outputs should remain separate unless a unified risk calculation is formally agreed upon.

## 8. Deployment Architecture

The frontend is intended to be deployed using Vercel.

The Node.js backend and Python FastAPI service require hosting environments that support their respective runtimes. Their production URLs must be configured before deployment.

Supabase provides the hosted database infrastructure.

## 9. Project Structure

```text
DengueWatch-AI/
│
├── index.html
├── risk-prediction.html
├── weather-analytics.html
├── dengue-history.html
├── ward-comparison.html
├── help.html
├── style.css
├── script.js
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── src/
│       ├── controllers/
│       └── routes/
│
├── ai-model/
│   ├── dataset/
│   ├── models/
│   ├── src/
│   └── requirements.txt
│
├── README.md
└── ARCHITECTURE.md
```