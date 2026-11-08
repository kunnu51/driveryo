# DRIVERYO Mobile Applications — Build & Deployment Guide

This guide explains how to obtain, build, and test the **Android APKs** and **iOS builds** for both **DRIVERYO Customer** and **DRIVERYO Driver** applications.

---

## 1. Application Details

| Metric | Customer Mobile App | Driver Mobile App |
| :--- | :--- | :--- |
| **Directory** | `apps/customer-mobile` | `apps/driver-mobile` |
| **Package / Bundle ID** | `com.driveryo.customer` | `com.driveryo.driver` |
| **Primary Platform** | Android & iOS (Flutter 3.22+) | Android & iOS (Flutter 3.22+) |
| **Target SDK** | Android 14 (API 34) / iOS 13.0+ | Android 14 (API 34) / iOS 13.0+ |
| **Min SDK** | Android 5.0 (API 21) / iOS 13.0 | Android 5.0 (API 21) / iOS 13.0 |
| **Special Permissions** | Location (Pickup, Tracking), SMS OTP, Notifications | Background GPS, Foreground Service, Camera (KYC), Odometer |

---

## 2. Fast Option: Cloud CI/CD (GitHub Actions)
> **Recommended**: Builds both Android `.apk` and iOS artifacts in the cloud without needing local SDK setup or an Apple Mac.

1. Push your repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: complete driveryo mobile ecosystem"
   git remote add origin https://github.com/<your-org>/driveryo.git
   git push -u origin main
   ```
2. Navigate to your GitHub repository -> **Actions** tab.
3. Click on the workflow: **"Build DRIVERYO Mobile Apps (Android APK & iOS)"**.
4. Click **Run workflow** -> Select **both** -> Click **Run workflow**.
5. Once complete (approx 4-6 minutes), download the artifacts:
   - `customer-mobile-release-apk`: `app-release.apk` (Install directly on any Android phone).
   - `driver-mobile-release-apk`: `app-release.apk` (Install directly on driver devices).
   - `customer-mobile-google-play-bundle`: `app-release.aab` (Google Play Console ready).
   - `driver-mobile-google-play-bundle`: `app-release.aab` (Google Play Console ready).
   - `customer-mobile-ios-payload`: Unsigned iOS payload archive ready for macOS Xcode or TestFlight.
   - `driver-mobile-ios-payload`: Unsigned iOS payload archive for drivers.

---

## 3. Local Build: Android APK on Windows

### Prerequisites
- **Flutter SDK**: 3.22.x or later installed and added to `PATH`.
- **Java JDK**: JDK 17 (Temurin or OpenJDK).
- **Android Studio**: Android SDK Build-Tools 34, Android SDK Platform 34, Command-line Tools.

### Build Steps

#### Option A: Using the PowerShell Build Utility
Open PowerShell in the project root:
```powershell
# Build both Customer & Driver Release APKs:
.\scripts\build-mobile-apps.ps1 -Target all -Mode release

# Build only Customer APK:
.\scripts\build-mobile-apps.ps1 -Target customer -Mode release

# Build only Driver APK:
.\scripts\build-mobile-apps.ps1 -Target driver -Mode release
```

#### Option B: Using Flutter CLI Directly

**For Customer Mobile App**:
```bash
cd apps/customer-mobile
flutter pub get
flutter build apk --release
```
Output APK location:
`apps/customer-mobile/build/app/outputs/flutter-apk/app-release.apk`

**For Driver Mobile App**:
```bash
cd apps/driver-mobile
flutter pub get
flutter build apk --release
```
Output APK location:
`apps/driver-mobile/build/app/outputs/flutter-apk/app-release.apk`

---

## 4. Apple iOS Build (.ipa) & Constraints

### Why iOS Requires macOS / Xcode
Apple strictly enforces that iOS applications must be compiled, linked, and code-signed using Apple's proprietary toolchain (`clang`, `ld64`, `codesign`, and Apple iOS SDKs) which are legally and technically restricted to **macOS** with **Xcode**.

Because this workspace is running on Windows, native `.ipa` generation cannot execute directly on this local machine.

### How to Build the iOS App on macOS:

1. Clone or copy the project to a Mac:
   ```bash
   cd apps/customer-mobile
   flutter pub get
   cd ios
   pod install
   cd ..
   flutter build ipa --no-codesign
   ```
2. The compiled `.app` or `.ipa` bundle will be in:
   `apps/customer-mobile/build/ios/archive/Runner.xcarchive`
3. Open `Runner.xcworkspace` in Xcode -> Select your Apple Developer Team -> Click **Product > Archive** -> Upload to **TestFlight** or export for Ad-Hoc distribution.

---

## 5. Instant Interactive Simulator (No Install Needed)

You do **not** need to wait for a mobile build to experience and test both the Customer and Driver applications in real time! We have created full-fidelity interactive smartphone web portals linked directly to the running backend.

1. Ensure the Driveryo standalone server is running:
   ```powershell
   python apps/backend/standalone_server.py
   ```
2. Open in your browser:
   - **Customer App Simulator**: [http://localhost:4000/customer-app](http://localhost:4000/customer-app)
     - Test mobile OTP login, car selection (Manual/Automatic hatchback, sedan, SUV), fare calculation, booking creation, driver assignment, and live GPS map tracking in Hyderabad.
   - **Driver App Simulator**: [http://localhost:4000/driver-app](http://localhost:4000/driver-app)
     - Test Online/Offline duty toggle, receiving incoming customer car requests, accepting trips, trip OTP verification, trip navigation, and real-time earnings breakdown.
   - **Admin Operations Dashboard**: [http://localhost:4000/admin](http://localhost:4000/admin)
     - Test live driver radar, dispatch, KYC approval, commissions, and fare management.

---

## 6. Sideloading the APK on Android Devices

1. Connect your Android device via USB or download the APK from GitHub Actions directly to your phone.
2. If installing via USB, use ADB:
   ```bash
   adb install apps/customer-mobile/build/app/outputs/flutter-apk/app-release.apk
   adb install apps/driver-mobile/build/app/outputs/flutter-apk/app-release.apk
   ```
3. If downloading directly onto the phone, enable *"Install unknown apps"* in Android Settings for your browser or file manager, tap the `.apk` file, and tap **Install**.
