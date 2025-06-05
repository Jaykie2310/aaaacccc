@echo off
echo ====================================
echo SETUP NGROK - Hướng dẫn từng bước
echo ====================================
echo.

echo Bước 1: Tải ngrok
echo 1. Truy cập: https://ngrok.com/download
echo 2. Tải file ngrok.exe cho Windows
echo 3. Copy file ngrok.exe vào thư mục này (D:\appqrcode-master)
echo.

echo Bước 2: Đăng ký tài khoản
echo 1. Truy cập: https://dashboard.ngrok.com/signup
echo 2. Đăng ký tài khoản miễn phí
echo 3. Sau khi đăng ký, vào dashboard để lấy authtoken
echo.

echo Bước 3: Cấu hình authtoken
echo Nhập authtoken của bạn (copy từ ngrok dashboard):
set /p authtoken="Authtoken: "

if "%authtoken%"=="" (
    echo Bạn chưa nhập authtoken!
    pause
    exit /b
)

echo.
echo Đang cấu hình ngrok với authtoken...
ngrok config add-authtoken %authtoken%

if %errorlevel%==0 (
    echo ✅ Cấu hình thành công!
    echo.
    echo Bây giờ bạn có thể chạy: start_server.bat
    echo Hoặc chạy thủ công: ngrok http 5000
) else (
    echo ❌ Có lỗi xảy ra. Kiểm tra:
    echo - File ngrok.exe có trong thư mục này không?
    echo - Authtoken có đúng không?
)

echo.
pause
