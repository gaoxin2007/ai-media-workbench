# AI Self-Media Workbench (MVP)

A minimal viable product for an AI-powered content creation assistant. This tool helps creators with IP positioning, benchmark account analysis, video script rewriting, and digital avatar video generation.

## Features

1.  **IP Positioning Center**: Generate comprehensive IP strategies using **Qwen (DashScope) LLM**.
    -   Persona, Audience Profiles, Content Pillars, Monetization Paths.
    -   Compliance checks & AI confidence notes.
    -   History versioning.
2.  **Benchmark Accounts**: Search and analyze competitor accounts on Douyin (Mocked).
3.  **Script Factory**: Extract transcripts from video links and rewrite them into 3 viral styles (Hook, Professional, Emotional).
4.  **Avatar Studio**: Generate videos from scripts using digital avatars (Mocked).

## Tech Stack

-   **Frontend**: React + TypeScript + TailwindCSS (Vite)
-   **Backend**: FastAPI (Python 3.11)
-   **Database**: SQLite (SQLAlchemy ORM)
-   **HTTP Client**: Axios (Frontend), HTTPX (Backend)
-   **AI Model**: Qwen (via DashScope OpenAI-compatible API)

## Project Structure

```
ai-media-workbench/
├── backend/                # FastAPI Application
│   ├── app/
│   │   ├── routers/        # API Endpoints
│   │   ├── models.py       # Database Models
│   │   ├── schemas.py      # Pydantic Schemas
│   │   ├── services.py     # AI Services (Qwen Integrated)
│   │   └── database.py     # DB Connection
│   ├── main.py             # Entry Point
│   └── requirements.txt
└── frontend/               # React Application
    ├── src/
    │   ├── api/            # API Client
    │   ├── components/     # UI Components
    │   ├── pages/          # Feature Pages
    │   └── types.ts        # TS Interfaces
    └── package.json
```

## Getting Started

### Prerequisites
-   Node.js & npm
-   Python 3.9+
-   **DashScope API Key** (for IP Positioning)

### Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  Create and activate a virtual environment (optional but recommended):
    ```bash
    python -m venv venv
    source venv/bin/activate  # Windows: venv\Scripts\activate
    ```

3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    pip install httpx  # Required for AI Service
    ```

4.  **Configure Environment Variables**:
    Create a `.env` file (or set in terminal) with your DashScope API Key:
    ```bash
    export DASHSCOPE_API_KEY="sk-your-api-key"
    export DASHSCOPE_BASE_URL="https://dashscope.aliyuncs.com/compatible-mode/v1"
    export QWEN_MODEL="qwen-plus"
    ```

5.  Run the server:
    ```bash
    uvicorn main:app --reload
    ```
    The API will be available at `http://localhost:8000`. API Docs at `http://localhost:8000/docs`.

### Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## Deployment on Alibaba Cloud ECS

### 1. Prerequisites
- Alibaba Cloud ECS instance (Ubuntu 22.04 or CentOS 7.9+ recommended).
- Security Group rules: Allow ports 80 (HTTP), 443 (HTTPS), and 22 (SSH).
- Domain name pointed to your ECS IP (optional but recommended).

### 2. Initial Server Setup
Update system and install dependencies:
```bash
# Ubuntu
sudo apt update
sudo apt install -y python3-pip python3-venv nodejs npm nginx git

# CentOS
sudo yum install -y python3 python3-pip nodejs npm nginx git
```

### 3. Clone & Configure
Clone your repository to `/var/www/ai-media-workbench`:
```bash
cd /var/www
git clone <your-repo-url> ai-media-workbench
cd ai-media-workbench
```

### 4. Backend Deployment (Gunicorn)
1.  Setup Virtual Environment:
    ```bash
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    pip install gunicorn uvicorn
    ```

2.  Configure `.env`:
    Copy `.env.example` to `.env` and fill in your API keys.

3.  Run Gunicorn (Daemon Mode):
    ```bash
    gunicorn -c gunicorn_conf.py main:app --daemon
    ```

### 5. Frontend Deployment (Nginx)
1.  Build React App:
    ```bash
    cd ../frontend
    npm install
    npm run build
    ```

2.  Configure Nginx:
    -   Copy `nginx.conf.template` content to `/etc/nginx/sites-available/default` (Ubuntu) or `/etc/nginx/conf.d/default.conf` (CentOS).
    -   Update `root` path to point to `/var/www/ai-media-workbench/frontend/dist`.
    -   Restart Nginx: `sudo systemctl restart nginx`.

### 6. Verify
Access your ECS public IP or domain in the browser.

## Notes

-   **Real AI**: The IP Positioning module now uses real Qwen API calls. Ensure you have a valid API Key.
-   **Mock Data**: Other modules (Benchmark, Script, Avatar) still use mock services.
-   **Database**: Uses SQLite. If you encounter database schema errors after update, please delete `backend/sql_app.db` and restart the backend to recreate tables.
