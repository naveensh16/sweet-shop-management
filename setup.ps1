# Sweet Shop - Master Setup Script
# This script sets up both backend and frontend automatically

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  🍬 Sweet Shop Management System - Master Setup" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "This script will set up the complete application." -ForegroundColor Yellow
Write-Host "Estimated time: 3-5 minutes" -ForegroundColor Yellow
Write-Host ""

$projectRoot = "c:\Users\Naveen\OneDrive\Desktop\Assignment\Sweet Shop"

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow

# Check Python
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python not found! Please install Python 3.11+" -ForegroundColor Red
    exit 1
}

# Check Node.js
try {
    $nodeVersion = node --version 2>&1
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found! Please install Node.js 18+" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Step 1: Backend Setup" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

Set-Location "$projectRoot\backend"

# Create virtual environment
if (-not (Test-Path "venv")) {
    Write-Host "Creating Python virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
.\venv\Scripts\Activate.ps1

# Install dependencies
Write-Host "Installing Python dependencies..." -ForegroundColor Yellow
pip install --quiet --upgrade pip
pip install --quiet -r requirements.txt

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install Python dependencies!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Backend dependencies installed!" -ForegroundColor Green

# Create .env file
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "⚠️  Please update DATABASE_URL in .env before continuing!" -ForegroundColor Yellow
    Write-Host "Press any key to continue after updating .env..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Step 2: Database Setup" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

$setupDb = Read-Host "Do you want to initialize the database now? (y/n)"

if ($setupDb -eq 'y' -or $setupDb -eq 'Y') {
    Write-Host "Creating database tables..." -ForegroundColor Yellow
    python -c "from app.database import Base, engine; Base.metadata.create_all(bind=engine); print('✅ Database tables created!')"
    
    if ($LASTEXITCODE -eq 0) {
        $createAdmin = Read-Host "Create admin user? (y/n)"
        if ($createAdmin -eq 'y' -or $createAdmin -eq 'Y') {
            python create_admin.py
        }
        
        $seedDb = Read-Host "Seed sample data? (y/n)"
        if ($seedDb -eq 'y' -or $seedDb -eq 'Y') {
            python seed_db.py
        }
    }
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Step 3: Frontend Setup" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

Set-Location "$projectRoot\frontend"

# Create .env file
if (-not (Test-Path ".env")) {
    Write-Host "Creating frontend .env file..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
}

# Install npm dependencies
Write-Host "Installing npm dependencies (this may take a moment)..." -ForegroundColor Yellow
npm install --silent

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install npm dependencies!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Frontend dependencies installed!" -ForegroundColor Green

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Step 4: Running Tests" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

$runTests = Read-Host "Do you want to run backend tests now? (y/n)"

if ($runTests -eq 'y' -or $runTests -eq 'Y') {
    Set-Location "$projectRoot\backend"
    .\venv\Scripts\Activate.ps1
    Write-Host "Running tests..." -ForegroundColor Yellow
    pytest --cov=app --cov-report=term-missing -v
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  ✅ Setup Complete!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your Sweet Shop Management System is ready!" -ForegroundColor Green
Write-Host ""
Write-Host "To start the application:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Backend (Terminal 1):" -ForegroundColor White
Write-Host "   cd '$projectRoot\backend'" -ForegroundColor Gray
Write-Host "   .\start.ps1" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Frontend (Terminal 2):" -ForegroundColor White
Write-Host "   cd '$projectRoot\frontend'" -ForegroundColor Gray
Write-Host "   npm start" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Access the application:" -ForegroundColor White
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor Gray
Write-Host "   Backend API: http://localhost:8000" -ForegroundColor Gray
Write-Host "   API Docs: http://localhost:8000/docs" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Login credentials:" -ForegroundColor White
Write-Host "   Admin: admin@sweetshop.com / Admin123!" -ForegroundColor Gray
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Yellow
Write-Host "   - README.md: Complete project documentation" -ForegroundColor Gray
Write-Host "   - QUICKSTART.md: 5-minute setup guide" -ForegroundColor Gray
Write-Host "   - GIT_COMMIT_GUIDE.md: Git workflow with AI attribution" -ForegroundColor Gray
Write-Host "   - IMPLEMENTATION_COMPLETE.md: Project summary" -ForegroundColor Gray
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
