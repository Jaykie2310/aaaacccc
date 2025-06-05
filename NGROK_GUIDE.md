# Hướng dẫn sử dụng ngrok để public web app

## Bước 1: Cài đặt ngrok

1. Truy cập https://ngrok.com/download
2. Tải về phiên bản cho Windows
3. Giải nén file tải về
4. Di chuyển file ngrok.exe vào thư mục dự án (D:/appqrcode-master)

## Bước 2: Đăng ký tài khoản ngrok

1. Truy cập https://dashboard.ngrok.com/signup
2. Đăng ký tài khoản miễn phí
3. Sau khi đăng ký, copy authtoken từ dashboard
4. Chạy lệnh sau để cấu hình ngrok:
```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

## Bước 3: Chạy ngrok

1. Đảm bảo Flask app đang chạy ở port 5000
2. Mở terminal mới và chạy lệnh:
```bash
ngrok http 5000
```

## Bước 4: Sử dụng

1. Sau khi chạy ngrok, bạn sẽ thấy URL public (dạng https://xxxx-xx-xx-xx-xx.ngrok.io)
2. URL này có thể truy cập từ bất kỳ đâu trên internet
3. Tất cả request sẽ được forward đến Flask app local của bạn

## Lưu ý quan trọng

1. **URL thay đổi mỗi lần chạy**: 
   - Với tài khoản miễn phí, URL sẽ thay đổi mỗi khi bạn khởi động lại ngrok
   - Nếu cần URL cố định, bạn có thể nâng cấp lên tài khoản Pro

2. **Giới hạn tài khoản miễn phí**:
   - 1 tunnel cùng lúc
   - 40 connections/minute
   - Không có custom domain
   - Session hết hạn sau 2 giờ

3. **Security**:
   - Mọi người có thể truy cập web app của bạn thông qua URL ngrok
   - Đảm bảo có authentication cho các route quan trọng
   - Không expose sensitive data

4. **Monitoring**:
   - Ngrok dashboard hiển thị realtime traffic
   - Xem được tất cả requests/responses
   - Debug dễ dàng với web interface

## Khắc phục sự cố

1. **Nếu không kết nối được**:
   - Kiểm tra Flask app có đang chạy không
   - Verify port number (mặc định 5000)
   - Kiểm tra firewall

2. **Nếu URL không hoạt động**:
   - Đảm bảo đã setup authtoken
   - Thử restart ngrok
   - Kiểm tra console log

3. **Nếu web app chậm**:
   - Có thể do network latency
   - Thử chọn region gần hơn khi start ngrok
   - Optimize Flask app

## Sử dụng trong development

1. **Testing**:
   - Test mobile app với local server
   - Demo cho khách hàng/team
   - Test webhook integrations

2. **Collaboration**:
   - Share work-in-progress với team
   - Get feedback nhanh chóng
   - Không cần deploy lên production

3. **Debug**:
   - Inspect HTTP traffic
   - Test từ nhiều devices
   - Verify webhooks

## Alternative Options

Nếu ngrok không phù hợp, bạn có thể thử:

1. **localhost.run**:
```bash
ssh -R 80:localhost:5000 localhost.run
```

2. **localtunnel**:
```bash
npm install -g localtunnel
lt --port 5000
```

3. **Cloudflare Tunnel**:
- Miễn phí
- Không giới hạn bandwidth
- Cần tài khoản Cloudflare

## Kết luận

Ngrok là giải pháp tốt để:
- Test và demo nhanh
- Không cần setup server
- Dễ sử dụng và quản lý
- Có thể dùng miễn phí
