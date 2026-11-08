# ==============================================================================
# DRIVERYO Mobile Applications Build Script (Windows PowerShell)
# Builds Customer App & Driver App for Android & iOS
# ==============================================================================

param (
    [ValidateSet("all", "customer", "driver", "bundle", "web")]
    [string]$Target = "all",

    [ValidateSet("release", "debug")]
    [string]$Mode = "release"
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   DRIVERYO MOBILE APPS BUILD UTILITY                    " -ForegroundColor Cyan
Write-Host "   Target: $Target | Mode: $Mode                         " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$WorkspaceRoot = Split-Path -Parent $PSScriptRoot
$CustomerDir = Join-Path $WorkspaceRoot "apps\customer-mobile"
$DriverDir = Join-Path $WorkspaceRoot "apps\driver-mobile"

# 1. Check if Flutter is in PATH
$flutterCmd = Get-Command "flutter" -ErrorAction SilentlyContinue

if (-not $flutterCmd) {
    Write-Host "`n[!] Flutter SDK is not detected in your current PATH." -ForegroundColor Yellow
    Write-Host "    However, the full Flutter codebase and native wrappers (Android & iOS) are ready." -ForegroundColor Gray
    Write-Host "`nTo compile the APKs locally on your Windows machine:" -ForegroundColor White
    Write-Host "  1. Download Flutter SDK: https://storage.googleapis.com/flutter_infra_release/releases/stable/windows/flutter_windows_3.22.2-stable.zip" -ForegroundColor White
    Write-Host "  2. Extract to C:\flutter and add 'C:\flutter\bin' to your System PATH." -ForegroundColor White
    Write-Host "  3. Open Android Studio -> Settings -> SDK Tools -> Check 'Android SDK Command-line Tools'." -ForegroundColor White
    Write-Host "  4. Re-run this script: .\scripts\build-mobile-apps.ps1" -ForegroundColor White
    Write-Host "`nAlternatively, use GitHub Actions CI/CD to build without local installation:" -ForegroundColor Green
    Write-Host "  - Push this repository to GitHub." -ForegroundColor Green
    Write-Host "  - Go to Actions -> 'Build DRIVERYO Mobile Apps (Android APK & iOS)' -> Run workflow." -ForegroundColor Green
    Write-Host "  - Both APKs (Customer & Driver) and iOS artifacts will download in ~5 minutes." -ForegroundColor Green
    Write-Host "`nInstant Simulation without building:" -ForegroundColor Cyan
    Write-Host "  - Start the Driveryo Server: python apps/backend/standalone_server.py" -ForegroundColor Cyan
    Write-Host "  - Open Customer App Simulator: http://localhost:4000/customer-app" -ForegroundColor Cyan
    Write-Host "  - Open Driver App Simulator:   http://localhost:4000/driver-app" -ForegroundColor Cyan
    Exit 0
}

Write-Host "[+] Flutter found at: $($flutterCmd.Source)" -ForegroundColor Green

# 2. Build Customer App
if ($Target -eq "all" -or $Target -eq "customer") {
    Write-Host "`n----------------------------------------------------------" -ForegroundColor Magenta
    Write-Host "[*] Building Driveryo Customer Mobile App (Android $Mode)..." -ForegroundColor Magenta
    Write-Host "----------------------------------------------------------" -ForegroundColor Magenta
    Set-Location $CustomerDir
    flutter pub get
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to get packages for customer-mobile"
        Exit 1
    }

    if ($Target -eq "bundle") {
        flutter build appbundle --$Mode
    } else {
        flutter build apk --$Mode
    }

    $apkPath = Join-Path $CustomerDir "build\app\outputs\flutter-apk\app-$Mode.apk"
    if (Test-Path $apkPath) {
        Write-Host "[SUCCESS] Customer APK built: $apkPath" -ForegroundColor Green
    }
}

# 3. Build Driver App
if ($Target -eq "all" -or $Target -eq "driver") {
    Write-Host "`n----------------------------------------------------------" -ForegroundColor Magenta
    Write-Host "[*] Building Driveryo Driver Mobile App (Android $Mode)..." -ForegroundColor Magenta
    Write-Host "----------------------------------------------------------" -ForegroundColor Magenta
    Set-Location $DriverDir
    flutter pub get
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to get packages for driver-mobile"
        Exit 1
    }

    if ($Target -eq "bundle") {
        flutter build appbundle --$Mode
    } else {
        flutter build apk --$Mode
    }

    $apkPath = Join-Path $DriverDir "build\app\outputs\flutter-apk\app-$Mode.apk"
    if (Test-Path $apkPath) {
        Write-Host "[SUCCESS] Driver APK built: $apkPath" -ForegroundColor Green
    }
}

# 4. Note on iOS
Write-Host "`n==========================================================" -ForegroundColor Yellow
Write-Host "NOTE REGARDING APPLE iOS (.IPA) BUILDS:" -ForegroundColor Yellow
Write-Host "Apple requires Xcode and macOS to sign and compile native iOS apps." -ForegroundColor Gray
Write-Host "To build for iOS:" -ForegroundColor Gray
Write-Host "1. Push to GitHub and download the artifact compiled by our .github/workflows/build-mobile.yml on a macOS runner." -ForegroundColor Gray
Write-Host "2. Or on an Apple Mac: cd apps/customer-mobile && flutter build ipa --no-codesign" -ForegroundColor Gray
Write-Host "==========================================================" -ForegroundColor Yellow

Set-Location $WorkspaceRoot
