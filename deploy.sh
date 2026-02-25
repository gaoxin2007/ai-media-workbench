#!/bin/bash

# Configuration
PROJECT_ROOT=$(pwd)
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"
VENV_DIR="$BACKEND_DIR/venv"

echo "=== AI Media Workbench Deployment Script ==="

# 1. System Dependencies (Run as root/sudo if needed)
echo "[1/4] Checking system dependencies..."
if ! command -v python3 &> /dev/null; then
    echo "Python3 not found. Please install python3."
    exit 1
fi
if ! command -v node &> /dev/null; then
    echo "Node.js not found. Please install node."
    exit 1
fi
if ! command -v nginx &> /dev/null; then
    echo "Nginx not found. Please install nginx."
    # sudo apt update && sudo apt install -y nginx
fi

# 2. Backend Setup
echo "[2/4] Setting up Backend..."
cd $BACKEND_DIR

if [ ! -d "$VENV_DIR" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate
echo "Installing Python dependencies..."
pip install -r requirements.txt
pip install gunicorn

# Start/Restart Backend (Simple Gunicorn)
# In production, use systemd or supervisor
echo "Starting Backend (Gunicorn)..."
pkill -f "gunicorn_conf.py" || true
nohup gunicorn -c gunicorn_conf.py main:app > backend.log 2>&1 &

echo "Backend started on port 8000."

# 3. Frontend Setup
echo "[3/4] Building Frontend..."
cd $FRONTEND_DIR

echo "Installing Node dependencies..."
npm install

echo "Building React App..."
npm run build

echo "Frontend built to $FRONTEND_DIR/dist"

# 4. Nginx Reminder
echo "[4/4] Nginx Configuration"
echo "Please configure Nginx to serve the frontend and proxy the backend."
echo "Use the provided 'nginx.conf.template' as a reference."
echo "Copy it to /etc/nginx/sites-available/ai-media and link to sites-enabled."
echo ""
echo "Deployment Complete!"
echo "Backend Log: $BACKEND_DIR/backend.log"
