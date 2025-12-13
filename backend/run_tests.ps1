# Sweet Shop - Test Runner Script

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Sweet Shop Management System - Test Runner" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to backend
Set-Location -Path "c:\Users\Naveen\OneDrive\Desktop\Assignment\Sweet Shop\backend"

# Activate virtual environment
if (Test-Path "venv\Scripts\Activate.ps1") {
    Write-Host "Activating virtual environment..." -ForegroundColor Yellow
    .\venv\Scripts\Activate.ps1
} else {
    Write-Host "❌ Virtual environment not found! Run setup.ps1 first." -ForegroundColor Red
    exit 1
}

# Run tests with coverage
Write-Host "`nRunning backend tests with coverage..." -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan

pytest --cov=app --cov-report=html --cov-report=term-missing --cov-fail-under=80 -v

$testExitCode = $LASTEXITCODE

Write-Host "`n============================================================" -ForegroundColor Cyan

if ($testExitCode -eq 0) {
    Write-Host "✅ All tests passed! Coverage >= 80%" -ForegroundColor Green
    Write-Host "`nTest coverage report generated at:" -ForegroundColor Yellow
    Write-Host "  backend\htmlcov\index.html" -ForegroundColor White
    Write-Host "`nOpen in browser:" -ForegroundColor Yellow
    Write-Host "  start backend\htmlcov\index.html" -ForegroundColor White
} else {
    Write-Host "❌ Some tests failed or coverage below 80%" -ForegroundColor Red
    Write-Host "Review the output above for details." -ForegroundColor Yellow
}

Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "  Test Summary" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Total Test Suites: 3 (auth, sweets, inventory)" -ForegroundColor White
Write-Host "Expected Test Count: 40+ tests" -ForegroundColor White
Write-Host "Coverage Target: 80%+" -ForegroundColor White
Write-Host ""

$openReport = Read-Host "Do you want to open the HTML coverage report? (y/n)"

if ($openReport -eq 'y' -or $openReport -eq 'Y') {
    Start-Process "htmlcov\index.html"
}

Write-Host "`nPress any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
