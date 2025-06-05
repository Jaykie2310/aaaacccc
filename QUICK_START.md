# Hướng dẫn nhanh để public web app

## Cách 1: Sử dụng localhost.run (Đơn giản nhất)

1. Double-click file `start_server_localhost_run.bat`
2. Đợi vài giây, bạn sẽ thấy URL public trong cửa sổ localhost.run
3. Copy URL đó và dùng để truy cập từ bất kỳ thiết bị nào

Ưu điểm:
- Không cần cài đặt gì thêm
- Không cần đăng ký tài khoản
- Có sẵn HTTPS

## Cách 2: Sử dụng ngrok (Chuyên nghiệp hơn)

### Lần đầu setup:

1. Double-click file `setup_ngrok.bat` và làm theo hướng dẫn:
   - Tải ngrok.exe
   - Đăng ký tài khoản
   - Nhập authtoken

### Sử dụng hàng ngày:

1. Double-click file `start_server.bat`
2. Đợi vài giây, bạn sẽ thấy URL public trong cửa sổ ngrok
3. Copy URL đó và dùng để truy cập từ bất kỳ thiết bị nào

Ưu điểm:
- Dashboard quản lý chuyên nghiệp
- Xem được traffic realtime
- Có thể setup custom domain (bản trả phí)

## Lưu ý quan trọng

1. **URL thay đổi mỗi lần chạy lại**
   - Mỗi lần bạn chạy start_server.bat, URL sẽ khác
   - Cần share URL mới cho người dùng

2. **Để dừng server:**
   - Đóng tất cả cửa sổ CMD
   - Hoặc nhấn phím bất kỳ trong cửa sổ start_server

3. **Nếu gặp lỗi:**
   - Kiểm tra Flask app có đang chạy không
   - Thử chạy lại start_server.bat
   - Xem logs trong cửa sổ CMD

## Các file quan trọng

- `start_server_localhost_run.bat` - Chạy với localhost.run
- `start_server.bat` - Chạy với ngrok
- `setup_ngrok.bat` - Setup ngrok lần đầu
- `NGROK_GUIDE.md` - Hướng dẫn chi tiết về ngrok

## Khắc phục sự cố

1. **Nếu không thấy URL public:**
   - Đợi thêm vài giây
   - Kiểm tra cửa sổ CMD có lỗi không
   - Thử chạy lại file start_server

2. **Nếu không truy cập được URL:**
   - Đảm bảo Flask app đang chạy (http://localhost:5000)
   - Kiểm tra kết nối internet
   - Copy đúng URL (bao gồm cả https://)

3. **Nếu camera không hoạt động:**
   - Đảm bảo dùng HTTPS
   - Cho phép quyền camera trong browser
   - Thử refresh trang

## Liên hệ hỗ trợ

Nếu cần giúp đỡ:
1. Chụp ảnh lỗi trong cửa sổ CMD
2. Mô tả bạn đang làm gì
3. Gửi thông tin để được hỗ trợ
