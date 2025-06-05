# Hướng dẫn triển khai lên Render (Docker)

## Vấn đề đã khắc phục
- **Vấn đề**: Quét mã QR hoạt động trên local nhưng không hoạt động trên Render
- **Nguyên nhân**: Dependencies hệ thống thiếu (libzbar) và cấu hình không phù hợp với môi trường cloud
- **Giải pháp**: Sử dụng Docker để đảm bảo tất cả dependencies được cài đặt đúng

## Files đã cập nhật

### 1. Dockerfile
```dockerfile
FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libzbar0 \
    libzbar-dev \
    python3-opencv \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

ENV PRODUCTION=true
ENV PORT=10000
EXPOSE 10000

CMD gunicorn app:app --bind 0.0.0.0:$PORT
```

### 2. render.yaml
```yaml
services:
  - type: web
    name: qrcode-inventory
    env: docker
    dockerfilePath: ./Dockerfile
    envVars:
      - key: PRODUCTION
        value: true
    disk:
      name: data
      mountPath: /app/data
      sizeGB: 1
```

### 3. .dockerignore
```
__pycache__
*.pyc
*.pyo
*.pyd
.Python
env/
venv/
.git
.env
```

## Hướng dẫn triển khai

### Bước 1: Test Local với Docker
```bash
# Build Docker image
docker build -t qrcode-app .

# Run container
docker run -p 10000:10000 qrcode-app

# Test dependencies trong container
docker exec -it <container_id> python test_dependencies.py
```

### Bước 2: Tạo Web Service trên Render
1. Đăng nhập vào [Render.com](https://render.com)
2. Chọn "New" → "Web Service"
3. Kết nối GitHub repository
4. Chọn branch `master`
5. Chọn "Docker" làm Environment

### Bước 3: Cấu hình Service
1. **Name**: qrcode-inventory
2. **Environment**: Docker
3. **Region**: Chọn region gần nhất
4. **Instance Type**: Free (hoặc paid nếu cần)
5. **Disk**: 1GB

### Bước 4: Deploy
1. Nhấn "Create Web Service"
2. Chờ Docker build hoàn thành (10-15 phút cho lần đầu)
3. Kiểm tra logs để đảm bảo không có lỗi

## Xử lý sự cố

### 1. Dependencies không load
```bash
# Vào container để kiểm tra
docker exec -it <container_id> bash

# Test pyzbar
python -c "from pyzbar.pyzbar import decode"

# Test OpenCV
python -c "import cv2; print(cv2.__version__)"
```

### 2. Camera không hoạt động
- Đảm bảo đang dùng HTTPS
- Kiểm tra browser console (F12)
- Xác nhận camera permissions

### 3. Docker build fails
- Kiểm tra Dockerfile syntax
- Verify system dependencies
- Check disk space

## Lưu ý quan trọng

1. **Data Persistence**:
   - SQLite DB: `/app/data/sales.db`
   - QR codes: `/app/data/qrcodes`
   - Logs: `/app/data/logs`

2. **Security**:
   - Không commit sensitive data
   - Sử dụng environment variables
   - Regular security updates

3. **Performance**:
   - Monitor memory usage
   - Check container logs
   - Consider paid plan if needed

4. **Maintenance**:
   - Regular backups
   - Monitor disk usage
   - Update dependencies

## Kiểm tra sau khi deploy

1. **API Endpoints**:
   - /api/scan
   - /api/process_barcode_image
   - /api/update-inventory

2. **Frontend Features**:
   - Camera initialization
   - QR scanning
   - Error handling

3. **System Health**:
   - Memory usage
   - Response times
   - Error rates
