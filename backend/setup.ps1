# Sweet Shop Management System - Backend Setup Script

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Sweet Shop Management System - Backend Setup" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Check Python version
Write-Host "Checking Python version..." -ForegroundColor Yellow
python --version
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Python not found! Please install Python 3.11 or higher." -ForegroundColor Red
    exit 1
}

# Create virtual environment
Write-Host "`nCreating virtual environment..." -ForegroundColor Yellow
if (Test-Path "venv") {
    Write-Host "Virtual environment already exists, skipping..." -ForegroundColor Gray
} else {
    python -m venv venv
    Write-Host "✅ Virtual environment created!" -ForegroundColor Green
}

# Activate virtual environment
Write-Host "`nActivating virtual environment..." -ForegroundColor Yellow
.\venv\Scripts\Activate.ps1

# Install dependencies
Write-Host "`nInstalling dependencies..." -ForegroundColor Yellow
pip install --upgrade pip
pip install -r requirements.txt

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green

# Create .env file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "`nCreating .env file..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✅ .env file created! Please update with your database credentials." -ForegroundColor Green
    Write-Host "⚠️  Remember to set your DATABASE_URL and SECRET_KEY!" -ForegroundColor Yellow
} else {
    Write-Host "`n.env file already exists." -ForegroundColor Gray
}

# Database setup prompt
Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "  Database Setup Required" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "`nBefore proceeding, ensure you have:" -ForegroundColor Yellow
Write-Host "1. PostgreSQL installed and running" -ForegroundColor White
Write-Host "2. Created a database named 'sweetshop_db'" -ForegroundColor White
Write-Host "3. Updated the DATABASE_URL in .env file" -ForegroundColor White
Write-Host ""

$createDb = Read-Host "Do you want to create database tables now? (y/n)"

if ($createDb -eq 'y' -or $createDb -eq 'Y') {
    Write-Host "`nCreating database tables..." -ForegroundColor Yellow
    python -c "from app.database import Base, engine; Base.metadata.create_all(bind=engine); print('✅ Database tables created!')"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database initialized successfully!" -ForegroundColor Green
        
        $createAdmin = Read-Host "`nDo you want to create an admin user? (y/n)"
        if ($createAdmin -eq 'y' -or $createAdmin -eq 'Y') {
            python create_admin.py
        }
        
        $seedDb = Read-Host "`nDo you want to seed the database with sample sweets? (y/n)"
        if ($seedDb -eq 'y' -or $seedDb -eq 'Y') {
            python seed_db.py
        }
    } else {
        Write-Host "❌ Database initialization failed! Check your DATABASE_URL." -ForegroundColor Red
    }
}

# Run tests
Write-Host "`n============================================================" -ForegroundColor Cyan
$runTests = Read-Host "Do you want to run tests now? (y/n)"

if ($runTests -eq 'y' -or $runTests -eq 'Y') {
    Write-Host "`nRunning tests..." -ForegroundColor Yellow
    pytest --cov=app --cov-report=html --cov-report=term
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ All tests passed!" -ForegroundColor Green
        Write-Host "Test coverage report: htmlcov/index.html" -ForegroundColor Cyan
    } else {
        Write-Host "`n❌ Some tests failed!" -ForegroundColor Red
    }
}

# Final instructions
Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "  Setup Complete!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "`nTo start the server, run:" -ForegroundColor Yellow
Write-Host "  uvicorn app.main:app --reload --host 0.0.0.0 --port 8000" -ForegroundColor White
Write-Host "`nAPI Documentation will be available at:" -ForegroundColor Yellow
Write-Host "  http://localhost:8000/docs" -ForegroundColor White
Write-Host "`nPress any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
