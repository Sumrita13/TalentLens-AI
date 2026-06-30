# TalentLens AI Candidate Discovery & Ranking Platform

An AI-powered full-stack platform to identify and rank the top candidates from a massive talent pool based on semantic understanding of a Job Description.

## Features
- **Neural Ranking Engine**: High-dimensional semantic matching using Sentence-Transformers (MiniLM) running locally to ensure privacy and speed.
- **Explainable AI (XAI)**: Dynamic, real-time justifications explicitly stating *why* a candidate was recommended and highlighting missing skills or potential risks.
- **Advanced UI Dashboard**: A premium, state-of-the-art "Synth-Noir" dashboard built with React and Framer Motion.
- **One-Click Export**: Easily export the ranked results (including AI justifications, risk levels, and sub-scores) to a standard Excel (`.xlsx`) file.
- **Multi-Factor Scoring**: Evaluates Technical Skills, Behavioral Signals (engagement, open-to-work flags), Experience, and Education, penalized by Risk Factors (skill inflation, job-hopping).

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, TypeScript, Framer Motion, Lucide-React.
- **Backend**: Node.js, Express, TypeScript, Mongoose, XLSX.
- **ML Service**: Python, FastAPI, Uvicorn, Sentence-Transformers, Pandas.
- **Database**: MongoDB (Local or Atlas).

---

## Setup & Execution Instructions

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- MongoDB (Running locally on `localhost:27017` or update the connection strings)

### 1. Backend Setup
The Node.js backend handles data orchestration and connects to MongoDB.
```bash
cd backend
npm install
# Start the backend server (runs on port 5000)
npm run dev
```

### 2. ML Service Setup
The Python service runs the embedding model and candidate scoring logic.
```bash
cd ml-service
# Recommended: Create a virtual environment
python -m venv venv
# Windows: venv\Scripts\activate | Mac/Linux: source venv/bin/activate

pip install -r requirements.txt
# (Optional) install openpyxl if you want to run the python export script directly
pip install openpyxl 

# Start the ML FastAPI server (runs on port 8000)
python app/main.py
```

### 3. Frontend Setup
The Vite React application serves the UI dashboard.
```bash
cd frontend
npm install
# Start the dev server (usually runs on port 5173)
npm run dev
```

---

## Initializing the Database

**⚠️ Important Dataset Note:** Because the `candidates.jsonl` dataset is large (400MB+), it is not hosted in this GitHub repository. 
1. **Download the Dataset:** https://drive.google.com/file/d/1-55B0lRLzudQ5wr3ttfX0zSKmH2lwCDG/view?usp=sharing
2. **Place the file:** Once downloaded, place `candidates.jsonl` inside the `data/` folder at the root of the project.

Once the dataset is in place and all three services are running:
1. Open your browser to the Frontend URL (e.g., `http://localhost:5173`).
2. Go to the **Intelligence** (Dashboard) tab.
3. Click the **Init DB** button in the header. 
4. The system will read the massive dataset from `data/candidates.jsonl` and populate your MongoDB. *Note: Depending on your hardware, inserting thousands of records may take a moment.*

## Usage
- Go to the **Configuration** tab to create a new Job Description.
- Go to the **Rankings** tab, select the job, and click **Trigger Ranking**.
- Click **Export XLSX** to download the ranked results with all AI reasoning included.

## API Reference
- `POST /api/jobs`: Register a new Job Description.
- `GET /api/jobs`: List all jobs.
- `POST /api/ranking/execute`: Trigger the neural engine for a specific job.
- `GET /api/ranking/results/:jobId`: Fetch persisted rankings from MongoDB.
- `GET /api/ranking/export/:jobId`: Download an Excel (`.xlsx`) file of the rankings.
- `GET /api/data/analytics`: Get pool-wide analytics and skill distribution.

## License
MIT License
