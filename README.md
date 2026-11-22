# DengueWatch AI 🦟

### AI-Powered Urban Dengue Outbreak Prediction & Early Warning System

## 1. Project Description

**DengueWatch AI** is an AI-powered platform designed to predict ward-level dengue outbreak risks using historical dengue cases, weather conditions, and environmental factors.

The system analyzes weather patterns such as rainfall, temperature, and relative humidity, along with ward-specific vulnerability indicators, to identify potential dengue risks 2–4 weeks in advance.

The platform aims to support early awareness, data-driven decision-making, and more effective dengue prevention strategies.

### Key Features
- Ward-level dengue risk prediction.
- Weather data analysis and visualization.
- Historical dengue case analysis.
- Ward-wise risk comparison.
- Interactive dashboard.
- Early warning for potential dengue outbreaks.

---

## 2. Team Information

| Name | Student ID | Role & Responsibilities |
|---|---|---|
| Suchak Das | 253003112 | **Team Leader, Project Coordination, Frontend Development** (UI/UX Design, HTML, CSS, JavaScript) |
| Aditi Biswas | 253002612 | **Backend Development** (Database Design, Data Management) |
| Diyari Chowdhury | 253005212 | **Backend Development** (API Integration, Workflow Automation) |

---

## 3. Technology Stack

### Frontend
- HTML
- CSS
- JavaScript
- Figma (UI/UX Design)

### Backend
- Programming Language: JavaScript
- Runtime Environment: Node.js
- Framework: Express.js
- API Integration: REST API development using Express.js; Supabase JavaScript Client for backend connectivity(integration in progress). 
- Workflow Automation: Node.js-based backend processing, automated data retrieval, rainfall lag calculations and dengue risk prediction (under development).

### Database
- Database Platform: Supabase
- Database Design & Management: Supabase 

### Deployment
- Hosting Platform: Vercel
- Deployment Configuration: Node.js backend configuration, environment variables and API endpoint setup.

### Additional Libraries & Tools
- Google Antigravity – AI-assisted coding, repository inspection, code generation and debugging.
- Git & GitHub – Version control, code collaboration and project management.
- npm – Installing and managing backend dependencies.
- PowerShell – Running backend commands and testing APIs.
- Express.js – Building backend API endpoints.
- Supabase JavaScript Client – Connecting the backend to the database (integration pending).
- dotenv – Managing environment variables.
- CORS – Enabling frontend-backend communication.
---

## 4. Installation & Setup Instructions

### Prerequisites
Make sure the following software and tools are installed:
- Node.js: Latest LTS version
- npm: Included with Node.js
- Visual Studio Code: For development
- Live Server Extension: For running the frontend locally
- Git: For repository management

### Clone the Repository

```bash
git clone https://github.com/suchaktirja/DengueWatch-AI.git
cd DengueWatch-AI
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

```env
PORT= 5000
SUPABASE_URL= https://qoxdqpexgbcsnainxahc.supabase.co
SUPABASE_ANON_KEY= sb_publishable_nF-GCBfGkwODvS-3Yddy-Q_XZ5OpYPK
```

### Run the Project

```bash
npm start
```

### Local Access

```text
Frontend: http://127.0.0.1:5500

Backend API: http://localhost:5000
```

## 5. AI Tools & External APIs Disclosure

The following AI tools were used during the development process:

| Tool | Purpose |
|---|---|
| Figma | UI/UX design and interface planning. |
| ChatGPT (OpenAI) | Code assistance and development support. |
| Google Antigravity | AI-assisted development, code generation, debugging, and project workflow support. |

### External APIs
- Supabase API – Used to store, retrieve, and manage ward information, dengue case records, weather observations, risk predictions, and alerts.
- Python FastAPI Prediction Service – Used to connect the trained Random Forest ML models and generate dengue risk predictions for 2, 3, and 4 weeks ahead.

### AI Model / Endpoint
- Model Name: Random Forest Regressor (Scikit-learn)
- AI Service: Python FastAPI
- Endpoint: POST /predict
- Local API URL: http://127.0.0.1:8000/predict
- Purpose: Predicts dengue cases for each ward 2, 3, and 4 weeks ahead using historical dengue cases, weather conditions, and ward vulnerability indicators.
- Prediction Outputs:
  1. Predicted dengue cases for 2 weeks ahead.
  2. Predicted dengue cases for 3 weeks ahead.
  3. Predicted dengue cases for 4 weeks ahead.
  4. Risk classification: Low, Medium, or High.
- Backend Integration: Node.js and Express connect to the FastAPI AI service through an Axios POST request at /api/predict.

---

## 6. Dataset & Data Sources

### Dataset
- Dataset Name: DengueWatch AI – Hackathon Preliminary Dengue Dataset
- Data Format: Excel(.xlsx) and Processed CSV(.csv)
- Source: Hackathon preliminary dataset(hackathon_preli_dataset.xlsx). The original upstream data publisher is not specified.
- Description: The dataset contains 31,320 weekly records covering 60 wards across 5 cities, from January 2016 to December 2025. It includes dengue case counts, population density, waterlogging risk, sanitation scores, average/maximum/minimum temperatures, rainfall, and relative humidity. The data is processed and used to train Random Forest models for predicting dengue cases 2, 3, and 4 weeks ahead.

### Main Data Attributes
- Ward ID
- Date
- Population Density
- Water Logging Risk Index
- Sanitation Score
- Average Temperature
- Maximum Temperature
- Minimum Temperature
- Rainfall
- Relative Humidity
- Historical Dengue Cases

---

## 7. Project Architecture

A detailed explanation of the system architecture, data flow, model selection, validation strategy, efficiency considerations, and error-handling mechanisms is provided in:

**[ARCHITECTURE.md](./ARCHITECTURE.md)**

---

## 8. Demo & Deployment

- **Live Demo:** https://denguewatchai.vercel.app
- **Demo Video:** https://drive.google.com/file/d/185D7C8qEH-BoW8Ks63WgkAfn_9qOgoXz/view?usp=drive_link

---

## 9. Attributions & References

- Dataset: Hackathon Preliminary Dengue Dataset (hackathon_preli_dataset.xlsx), provided for the hackathon. The original upstream data source has not been specified. Processed dataset: processed_dengue_data.csv.
- Open-source libraries:
  1. Python – Python Software Foundation License
  2. Scikit-learn – BSD 3-Clause License
  3. Pandas – BSD 3-Clause License
  4. NumPy – BSD 3-Clause License
  5. FastAPI – MIT License
  6. Uvicorn – BSD 3-Clause License
  7. Joblib – BSD 3-Clause License
  8. Node.js – MIT License
  9. Express.js – MIT License
  10. Axios – MIT License
  11. Supabase JavaScript Client – MIT License

Chart.js – MIT License
- External assets and resources: Google Fonts (Plus Jakarta Sans, Inter, and JetBrains Mono), if used in the application. No third-party images or illustrations are currently attributed.
- Other references:
  1. Scikit-learn documentation for machine learning model development.
  2. FastAPI documentation for AI API development.
  3. Supabase documentation for database integration.
  4. Chart.js documentation for data visualization.
  5. Official Python and Node.js documentation.
---

## 10. License

This project is licensed under the MIT License. You are free to use, modify, and distribute this software in accordance with the MIT License terms.
