# Hướng dẫn triển khai lên Render

## Vấn đề đã khắc phục
- **Vấn đề**: Quét mã QR hoạt động trên local nhưng không hoạt động trên Render
- **Nguyên nhân**: Dependencies hệ thống thiếu và cấu hình không phù hợp với môi trường cloud
- **Giải pháp**: Tối ưu hóa code và dependencies cho Render

## Files đã cập nhật

### 1. requirements.txt
```
Flask==3.1.1
flask-cors==6.0.0
Flask-Mail==0.10.0
gunicorn==23.0.0
Pillow==11.2.1
pyzbar==0.1.9
qrcode==8.2
requests==2.32.3
opencv-python-headless==4.8.1.78
numpy==1.24.3
captcha==0.7.1
Werkzeug==3.1.3
```

### 2. render.yaml
```yaml
services:
  - type: web
    name: qrcode-inventory
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: gunicorn app:app
    envVars:
      - key: PRODUCTION
        value: true
      - key: PYTHON_VERSION
        value: 3.11.11
```

### 3. apt-packages.txt
```
libzbar0
libzbar-dev
python3-opencv
libgl1-mesa-glx
libglib2.0-0
```

## Cải tiến trong app.py

1. **Ưu tiên OpenCV QRCodeDetector**: Ổn định hơn trên cloud
2. **Fallback mechanism**: Sử dụng pyzbar nếu OpenCV thất bại
3. **Better error handling**: Xử lý lỗi chi tiết hơn
4. **Production mode**: Tự động detect môi trường production

## Hướng dẫn triển khai

### Bước 1: Tạo Web Service trên Render
1. Đăng nhập vào [Render.com](https://render.com)
2. Chọn "New" → "Web Service"
3. Kết nối GitHub repository
4. Chọn branch `master`

### Bước 2: Cấu hình Build & Deploy
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn app:app`
- **Environment**: `Python 3`

### Bước 3: Environment Variables
Thêm các biến môi trường:
- `PRODUCTION=true`
- `PYTHON_VERSION=3.11.11`

### Bước 4: Deploy
1. Nhấn "Create Web Service"
2. Chờ build hoàn thành (5-10 phút)
3. Kiểm tra logs nếu có lỗi

## Kiểm tra sau khi deploy

1. **Truy cập URL**: Kiểm tra trang chủ load được
2. **Test scan**: Thử quét mã QR/barcode
3. **Check logs**: Xem logs để debug nếu cần

## Troubleshooting

### Nếu vẫn không quét được:
1. Kiểm tra browser console (F12)
2. Đảm bảo HTTPS được sử dụng (camera cần HTTPS)
3. Thử với ảnh chất lượng cao
4. Kiểm tra Render logs

### Lỗi thường gặp:
- **Camera không hoạt động**: Cần HTTPS
- **Dependencies failed**: Kiểm tra requirements.txt
- **Timeout**: Tăng timeout trong Render settings

## Lưu ý quan trọng

1. **HTTPS**: Render tự động cung cấp HTTPS
2. **File storage**: Sử dụng disk mount cho QR codes
3. **Database**: SQLite sẽ reset mỗi lần deploy, cân nhắc PostgreSQL
4. **Performance**: Render free tier có giới hạn, cân nhắc paid plan

## Test local trước khi deploy
```bash
# Test dependencies
python test_dependencies.py

# Test production mode
set PRODUCTION=true && python app.py
