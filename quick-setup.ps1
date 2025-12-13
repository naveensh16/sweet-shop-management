# Sweet Shop - Quick Setup Script
Write-Host "Setting up Sweet Shop..." -ForegroundColor Cyan

$projectRoot = "c:\Users\Naveen\OneDrive\Desktop\Assignment\Sweet Shop"

# Backend Setup
Write-Host "Setting up backend..." -ForegroundColor Yellow
Set-Location "$projectRoot\backend"

if (-not (Test-Path "venv")) {
    python -m venv venv
}

.\venv\Scripts\Activate.ps1
pip install --quiet --upgrade pip
pip install --quiet -r requirements.txt

if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "Created .env file - update DATABASE_URL if needed" -ForegroundColor Yellow
}

# Frontend Setup
Write-Host "Setting up frontend..." -ForegroundColor Yellow
Set-Location "$projectRoot\frontend"

if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
}

npm install --silent

Write-Host "Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To start the application:"
Write-Host "1. Backend: cd backend; .\start.ps1"
Write-Host "2. Frontend: cd frontend; npm start"
