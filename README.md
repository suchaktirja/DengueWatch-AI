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
- 
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
PORT=5000
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
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
- [Add API name and its purpose]
- [Add API name and its purpose]

### AI Model / Endpoint
- [Add model name, endpoint, and purpose if integrated into the application.]

**Note:** Figma and ChatGPT were used as development tools. Their use does not mean that an AI model is integrated into the deployed application.

---

## 6. Dataset & Data Sources

### Dataset
- Dataset Name: [Add Dataset Name]
- Data Format: [Add Format]
- Source: [Add Dataset Source]
- Description: [Add Dataset Description]

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

- **Live Demo:** [Add Deployed Website URL]
- **Demo Video:** [Add Video Link]

---

## 9. Attributions & References

- Dataset: [Add Dataset Source]
- Open-source libraries: [Add Library Names and Licenses]
- External assets and resources: [Add Sources]
- Other references: [Add References]

---

## 10. License

[Add License Information]
