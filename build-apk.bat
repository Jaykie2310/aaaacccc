@echo off
echo ================================
echo    BUILD APK CHO GOOGLE PLAY
echo ================================

echo.
echo [1/5] Dong bo web assets...
call npx cap sync android
if errorlevel 1 (
    echo Loi: Khong the dong bo assets
    pause
    exit /b 1
)

echo.
echo [2/5] Kiem tra Android project...
if not exist "android" (
    echo Loi: Thu muc android khong ton tai
    echo Chay lenh: npx cap add android
    pause
    exit /b 1
)

echo.
echo [3/5] Chuyen den thu muc android...
cd android

echo.
echo [4/5] Build APK release...
echo Dang build APK, vui long cho...
call gradlew assembleRelease
if errorlevel 1 (
    echo Loi: Build APK that bai
    echo Kiem tra Android Studio va cac dependencies
    pause
    exit /b 1
)

echo.
echo [5/5] Build Bundle release...
echo Dang build Bundle cho Play Store...
call gradlew bundleRelease
if errorlevel 1 (
    echo Canh bao: Build Bundle that bai
    echo APK van co the su dung duoc
)

echo.
echo ================================
echo        BUILD HOAN THANH!
echo ================================
echo.
echo File APK: android\app\build\outputs\apk\release\app-release.apk
echo File Bundle: android\app\build\outputs\bundle\release\app-release.aab
echo.
echo Huong dan tiep theo:
echo 1. Test APK tren thiet bi Android
echo 2. Upload Bundle (.aab) len Google Play Console
echo 3. Xem file HUONG_DAN_BUILD_APK.md de biet chi tiet
echo.
pause
