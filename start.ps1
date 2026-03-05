$Host.UI.RawUI.ForegroundColor = "White"

function Write-Color($Text, $Color="White") {
    $prev = $Host.UI.RawUI.ForegroundColor
    $Host.UI.RawUI.ForegroundColor = $Color
    Write-Host $Text
    $Host.UI.RawUI.ForegroundColor = $prev
}

$PROJECT_DIR = "$env:USERPROFILE\Documents\mariwasa"
$FRONTEND_DIR = "$PROJECT_DIR\frontend"
$BACKEND_DIR  = "$PROJECT_DIR\backend"

$FRONTEND_PORT = 5173
$BACKEND_PORT  = 8000
$PGADMIN_PORT  = 5050

$FRONTEND_URL = "http://localhost:5173"
$SWAGGER_URL  = "http://127.0.0.1:8000/docs"
$PGADMIN_URL  = "http://127.0.0.1:5050"

$GITHUB_URL = "https://github.com/LeFLEUR-ui/STI-Thesis-Resume-Analysis-System.git"

$global:FRONTEND_PID = $null
$global:BACKEND_PID = $null

function Cleanup {
    Write-Color "`nExiting Dev CLI, stopping servers..." Red
    if ($global:FRONTEND_PID) { Stop-Process -Id $global:FRONTEND_PID -Force }
    if ($global:BACKEND_PID) { Stop-Process -Id $global:BACKEND_PID -Force }
    exit
}

Register-EngineEvent PowerShell.Exiting -Action { Cleanup }

function Free-Port([int]$Port) {
    $pids = netstat -ano | Select-String ":$Port\s" | ForEach-Object { ($_ -split "\s+")[-1] }
    foreach ($pid in $pids) {
        if ($pid) {
            Write-Color "Port $Port in use. Killing process $pid..." Red
            Stop-Process -Id $pid -Force
            Write-Color "Port $Port freed." Green
        }
    }
}

function Install-Backend-Dependencies {
    Write-Color "Installing backend dependencies..." Cyan
    if (!(Test-Path "$BACKEND_DIR\venv\Scripts\Activate.ps1")) {
        Write-Color "Creating virtual environment..." Yellow
        python -m venv "$BACKEND_DIR\venv"
    }
    & "$BACKEND_DIR\venv\Scripts\Activate.ps1"
    if (Test-Path "$BACKEND_DIR\requirements.txt") {
        pip install -r "$BACKEND_DIR\requirements.txt"
    }
    & "$BACKEND_DIR\venv\Scripts\Deactivate.ps1"
    Write-Color "Backend dependencies installed." Green
}

function Install-Frontend-Dependencies {
    Write-Color "Installing frontend dependencies..." Cyan
    if (!(Test-Path "$FRONTEND_DIR\node_modules")) {
        npm install --prefix "$FRONTEND_DIR"
    }
    Write-Color "Frontend dependencies installed." Green
}

function Setup-Project-And-Dependencies {
    Write-Color "Setting up project structure..." Cyan
    New-Item -ItemType Directory -Force -Path $FRONTEND_DIR,$BACKEND_DIR | Out-Null
    if (!(Test-Path "$FRONTEND_DIR\package.json")) {
        Write-Color "Downloading frontend package.json from GitHub..." Yellow
        Invoke-WebRequest "$GITHUB_URL/raw/main/frontend/package.json" -OutFile "$FRONTEND_DIR\package.json"
    }
    npm install --prefix "$FRONTEND_DIR"
    if (!(Test-Path "$BACKEND_DIR\requirements.txt")) {
        Write-Color "Downloading backend requirements.txt from GitHub..." Yellow
        Invoke-WebRequest "$GITHUB_URL/raw/main/backend/requirements.txt" -OutFile "$BACKEND_DIR\requirements.txt"
    }
    if (!(Test-Path "$BACKEND_DIR\venv\Scripts\Activate.ps1")) {
        python -m venv "$BACKEND_DIR\venv"
    }
    & "$BACKEND_DIR\venv\Scripts\Activate.ps1"
    pip install -r "$BACKEND_DIR\requirements.txt"
    & "$BACKEND_DIR\venv\Scripts\Deactivate.ps1"
    Write-Color "Project setup completed successfully!" Green
}

function Start-Backend {
    Write-Color "Starting Backend Server..." Cyan
    Free-Port $BACKEND_PORT
    $global:BACKEND_PID = Start-Process powershell -ArgumentList "-NoExit", "-Command `"cd '$BACKEND_DIR'; & venv\Scripts\Activate.ps1; uvicorn main:app --reload`"" -PassThru
    Start-Sleep -Seconds 3
    Start-Process $SWAGGER_URL
    $pgPid = netstat -ano | Select-String ":$PGADMIN_PORT\s" | ForEach-Object { ($_ -split "\s+")[-1] }
    if ($pgPid) {
        Write-Color "pgAdmin already running." Green
    } else {
        Write-Color "Opening pgAdmin..." Cyan
        Start-Process $PGADMIN_URL
    }
}

function Start-Frontend {
    Write-Color "Starting Frontend Server..." Cyan
    Free-Port $FRONTEND_PORT
    $global:FRONTEND_PID = Start-Process powershell -ArgumentList "-NoExit", "-Command `"cd '$FRONTEND_DIR'; npm run dev`"" -PassThru
    Start-Sleep -Seconds 3
    Start-Process $FRONTEND_URL
}

function Start-All { Start-Backend; Start-Frontend }
function Stop-Backend { if ($global:BACKEND_PID) { Stop-Process -Id $global:BACKEND_PID -Force }; Write-Color "Backend stopped." Green }
function Stop-Frontend { if ($global:FRONTEND_PID) { Stop-Process -Id $global:FRONTEND_PID -Force }; Write-Color "Frontend stopped." Green }
function Stop-All { Stop-Backend; Stop-Frontend }

function Git-Pull { cd $PROJECT_DIR; git pull; Write-Color "Repository updated!" Green }
function Open-GitHub { Start-Process $GITHUB_URL }

while ($true) {
    Write-Host ""
    Write-Color "================================" Cyan
    Write-Color "      MARIWASA DEV CLI          " Cyan
    Write-Color "================================" Cyan
    Write-Color "1) Start Frontend" Green
    Write-Color "2) Start Backend (opens pgAdmin if not running)" Green
    Write-Color "3) Start Both Servers" Green
    Write-Host ""
    Write-Color "4) Stop Frontend" Red
    Write-Color "5) Stop Backend" Red
    Write-Color "6) Stop All Servers" Red
    Write-Host ""
    Write-Color "7) Pull Latest Changes from GitHub" Blue
    Write-Color "8) Open GitHub Repository in Browser" Blue
    Write-Host ""
    Write-Color "9) Exit" Yellow
    Write-Color "10) Setup Project & Install Dependencies (Frontend & Backend)" Yellow
    Write-Color "11) Install Frontend Dependencies Only" Yellow
    Write-Host ""

    $choice = Read-Host "Select option"

    switch ($choice) {
        "1" { Start-Frontend }
        "2" { Start-Backend }
        "3" { Start-All }
        "4" { Stop-Frontend }
        "5" { Stop-Backend }
        "6" { Stop-All }
        "7" { Git-Pull }
        "8" { Open-GitHub }
        "9" { Cleanup }
        "10" { Setup-Project-And-Dependencies }
        "11" { Install-Frontend-Dependencies }
        default { Write-Color "Invalid option." Red }
    }
}
