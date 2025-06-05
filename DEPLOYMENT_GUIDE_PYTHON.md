# Hướng dẫn triển khai lên Render (Python Environment)

## Vấn đề đã khắc phục
- **Vấn đề**: Quét mã QR hoạt động trên local nhưng không hoạt động trên Render
- **Nguyên nhân**: Dependencies hệ thống thiếu (libzbar) và cấu hình không phù hợp
- **Giải pháp**: Tối ưu hóa code để ưu tiên OpenCV và graceful fallback

## Thay đổi chính

### 1. render.yaml - Cấu hình Python environment
```yaml
services:
  - type: web
    name: qrcode-inventory
    env: python
    buildCommand: |
      pip install --upgrade pip
      pip install wheel setuptools
      pip install -r requirements.txt
    startCommand: gunicorn app:app
    envVars:
      - key: PRODUCTION
        value: true
      - key: PYTHON_VERSION
        value: 3.11.11
```

### 2. requirements.txt - Loại bỏ pyzbar để tránh lỗi
```
Flask==3.1.1
flask-cors==6.0.0
Flask-Mail==0.10.0
gunicorn==23.0.0
Pillow==11.2.1
qrcode==8.2
requests==2.32.3
Werkzeug==3.1.3
captcha==0.7.1
opencv-python-headless==4.8.1.78
numpy==1.24.3
```

### 3. app.py - Cải tiến xử lý QR
- **Ưu tiên OpenCV**: Sử dụng cv2.QRCodeDetector làm phương pháp chính
- **Multiple processing**: Thử nhiều cách xử lý ảnh (grayscale, enhanced, threshold)
- **Graceful fallback**: Xử lý trường hợp pyzbar không có
- **Better logging**: Log chi tiết để debug

## Hướng dẫn triển khai

### Bước 1: Chuẩn bị Repository
1. Đảm bảo tất cả files đã được commit và push:
   ```bash
   git add .
   git commit -m "Fix QR scanning for Render deployment"
   git push origin master
   ```

### Bước 2: Tạo Web Service trên Render
1. Đăng nhập vào [Render.com](https://render.com)
2. Chọn "New" → "Web Service"
3. Kết nối GitHub repository
4. Chọn branch `master`
5. **Environment**: Python 3
6. **Build Command**: Sẽ tự động sử dụng từ render.yaml
7. **Start Command**: `gunicorn app:app`

### Bước 3: Cấu hình
- **Name**: qrcode-inventory
- **Region**: Chọn gần nhất
- **Instance Type**: Free hoặc Starter
- **Environment Variables**: Đã có trong render.yaml

### Bước 4: Deploy và Monitor
1. Nhấn "Create Web Service"
2. Theo dõi build logs
3. Kiểm tra deployment logs
4. Test chức năng quét QR

## Kiểm tra sau deploy

### 1. Logs cần xem
```
✅ OpenCV imported successfully
✅ QR code detected using opencv
⚠️ pyzbar not available - skipping barcode detection (OK)
```

### 2. Test chức năng
1. Truy cập URL Render
2. Vào trang quét QR
3. Thử quét mã QR/barcode
4. Kiểm tra browser console (F12)

### 3. API Endpoints test
- `/api/scan` - Quét barcode từ frontend
- `/api/process_barcode_image` - Upload ảnh để quét
- `/api/update-inventory` - Cập nhật kho

## Troubleshooting

### Lỗi thường gặp:

1. **OpenCV import failed**:
   - Kiểm tra logs build
   - Verify opencv-python-headless trong requirements.txt

2. **Camera không hoạt động**:
   - Đảm bảo HTTPS (Render tự động có)
   - Check browser permissions
   - Xem browser console

3. **QR không đọc được**:
   - Thử với ảnh chất lượng cao
   - Kiểm tra logs để xem method nào được sử dụng
   - Test với QR code đơn giản

4. **Build failed**:
   - Kiểm tra requirements.txt syntax
   - Verify render.yaml format
   - Check disk space limits

## Lưu ý quan trọng

### Performance:
- OpenCV QRCodeDetector hoạt động tốt trên Render
- Không cần pyzbar nếu chỉ quét QR codes
- Response time có thể chậm hơn local

### Limitations:
- Chỉ hỗ trợ QR codes (không phải tất cả barcode types)
- Cần ảnh chất lượng tốt
- Free tier có giới hạn CPU/memory

### Monitoring:
- Theo dõi logs thường xuyên
- Check memory usage
- Monitor response times

## Backup plan

Nếu vẫn không hoạt động:
1. Thử Docker approach (cần Docker Desktop)
2. Sử dụng external QR API service
3. Chuyển sang Heroku hoặc cloud provider khác
4. Implement client-side QR scanning only

## Test local

```bash
# Test dependencies
python test_dependencies.py

# Test production mode
set PRODUCTION=true
python app.py

# Test specific endpoint
curl -X POST http://localhost:5000/api/scan -H "Content-Type: application/json" -d '{"code":"test123"}'
