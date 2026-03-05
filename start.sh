#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

PROJECT_DIR="$HOME/Documents/mariwasa"
FRONTEND_DIR="$PROJECT_DIR/frontend"
BACKEND_DIR="$PROJECT_DIR/backend"

FRONTEND_PORT=5173
BACKEND_PORT=8000
PGADMIN_PORT=5050

FRONTEND_URL="http://localhost:5173"
SWAGGER_URL="http://127.0.0.1:8000/docs"
PGADMIN_URL="http://127.0.0.1:5050"

GITHUB_URL="https://github.com/LeFLEUR-ui/STI-Thesis-Resume-Analysis-System.git"

FRONTEND_PID=""
BACKEND_PID=""

cleanup() {
    echo -e "${RED}\nExiting Dev CLI, stopping servers...${NC}"
    [ ! -z "$FRONTEND_PID" ] && kill -9 $FRONTEND_PID 2>/dev/null
    [ ! -z "$BACKEND_PID" ] && kill -9 $BACKEND_PID 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM EXIT

free_port() {
    PORT=$1
    PID=$(lsof -t -i:$PORT)
    if [ ! -z "$PID" ]; then
        echo -e "${RED}Port $PORT in use. Killing process $PID...${NC}"
        kill -9 $PID
        echo -e "${GREEN}Port $PORT freed.${NC}"
    fi
}

install_backend_dependencies() {
    echo -e "${CYAN}Installing backend dependencies...${NC}"
    cd "$BACKEND_DIR" || exit
    if [ ! -f "venv/bin/activate" ]; then
        echo -e "${YELLOW}Creating virtual environment...${NC}"
        python3 -m venv venv
    fi
    source venv/bin/activate
    if [ -f "requirements.txt" ]; then
        pip install -r requirements.txt
    fi
    deactivate
    echo -e "${GREEN}Backend dependencies installed.${NC}"
}

install_frontend_dependencies() {
    echo -e "${CYAN}Installing frontend dependencies...${NC}"
    cd "$FRONTEND_DIR" || exit
    if [ ! -d "node_modules" ]; then
        npm install
    fi
    echo -e "${GREEN}Frontend dependencies installed.${NC}"
}

setup_project_and_dependencies() {
    echo -e "${CYAN}Setting up project structure and installing dependencies...${NC}"
    mkdir -p "$FRONTEND_DIR" "$BACKEND_DIR"
    if [ ! -f "$FRONTEND_DIR/package.json" ]; then
        echo -e "${YELLOW}Downloading frontend package.json from GitHub...${NC}"
        curl -sL "$GITHUB_URL/raw/main/frontend/package.json" -o "$FRONTEND_DIR/package.json"
    fi
    cd "$FRONTEND_DIR" || exit
    npm install
    if [ ! -f "$BACKEND_DIR/requirements.txt" ]; then
        echo -e "${YELLOW}Downloading backend requirements.txt from GitHub...${NC}"
        curl -sL "$GITHUB_URL/raw/main/backend/requirements.txt" -o "$BACKEND_DIR/requirements.txt"
    fi
    cd "$BACKEND_DIR" || exit
    if [ ! -f "venv/bin/activate" ]; then
        python3 -m venv venv
    fi
    source venv/bin/activate
    pip install -r requirements.txt
    deactivate
    echo -e "${GREEN}Project setup completed successfully!${NC}"
}

start_backend() {
    echo -e "${CYAN}Starting Backend Server...${NC}"
    free_port $BACKEND_PORT
    gnome-terminal --title="Mariwasa Backend" -- bash -c "
cd $BACKEND_DIR
source venv/bin/activate
uvicorn main:app --reload
exec bash
" &
    BACKEND_PID=$!
    sleep 3
    xdg-open "$SWAGGER_URL" >/dev/null 2>&1
    if lsof -i:$PGADMIN_PORT >/dev/null 2>&1; then
        echo -e "${GREEN}pgAdmin already running.${NC}"
    else
        echo -e "${CYAN}Opening pgAdmin...${NC}"
        xdg-open "$PGADMIN_URL" >/dev/null 2>&1
    fi
}

start_frontend() {
    echo -e "${CYAN}Starting Frontend Server...${NC}"
    free_port $FRONTEND_PORT
    gnome-terminal --title="Mariwasa Frontend" -- bash -c "
cd $FRONTEND_DIR
npm run dev
exec bash
" &
    FRONTEND_PID=$!
    sleep 3
    xdg-open "$FRONTEND_URL" >/dev/null 2>&1
}

start_all() {
    start_backend
    start_frontend
}

stop_backend() {
    echo -e "${YELLOW}Stopping Backend...${NC}"
    [ ! -z "$BACKEND_PID" ] && kill -9 $BACKEND_PID 2>/dev/null
    echo -e "${GREEN}Backend stopped.${NC}"
}

stop_frontend() {
    echo -e "${YELLOW}Stopping Frontend...${NC}"
    [ ! -z "$FRONTEND_PID" ] && kill -9 $FRONTEND_PID 2>/dev/null
    echo -e "${GREEN}Frontend stopped.${NC}"
}

stop_all() {
    stop_backend
    stop_frontend
}

git_pull() {
    echo -e "${CYAN}Pulling latest changes from GitHub...${NC}"
    cd "$PROJECT_DIR" || exit
    git pull
    echo -e "${GREEN}Repository updated!${NC}"
}

open_github() {
    echo -e "${CYAN}Opening GitHub repository in browser...${NC}"
    xdg-open "$GITHUB_URL" >/dev/null 2>&1
}

while true
do
    echo ""
    echo -e "${CYAN}================================${NC}"
    echo -e "${CYAN}      MARIWASA DEV CLI          ${NC}"
    echo -e "${CYAN}================================${NC}"
    echo -e "${GREEN}1)${NC} Start Frontend"
    echo -e "${GREEN}2)${NC} Start Backend (opens pgAdmin if not running)"
    echo -e "${GREEN}3)${NC} Start Both Servers"
    echo ""
    echo -e "${RED}4)${NC} Stop Frontend"
    echo -e "${RED}5)${NC} Stop Backend"
    echo -e "${RED}6)${NC} Stop All Servers"
    echo ""
    echo -e "${BLUE}7)${NC} Pull Latest Changes from GitHub"
    echo -e "${BLUE}8)${NC} Open GitHub Repository in Browser"
    echo ""
    echo -e "${YELLOW}9)${NC} Exit"
    echo -e "${YELLOW}10)${NC} Setup Project & Install Dependencies (Frontend & Backend)"
    echo -e "${YELLOW}11)${NC} Install Frontend Dependencies Only"
    echo ""
    read -p "Select option: " choice
    case $choice in
        1) start_frontend ;;
        2) start_backend ;;
        3) start_all ;;
        4) stop_frontend ;;
        5) stop_backend ;;
        6) stop_all ;;
        7) git_pull ;;
        8) open_github ;;
        9) cleanup ;;
        10) setup_project_and_dependencies ;;
        11) install_frontend_dependencies ;;
        *) echo -e "${RED}Invalid option.${NC}" ;;
    esac
done
