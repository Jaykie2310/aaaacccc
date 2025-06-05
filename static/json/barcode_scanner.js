document.addEventListener("DOMContentLoaded", function() {
    const videoContainer = document.getElementById("video-container");
    const scanResultDisplay = document.getElementById("scan-result");
    const startScanButton = document.getElementById("start-scan");
    const stopScanButton = document.getElementById("stop-scan");

    // Kiểm tra HTTPS
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
        scanResultDisplay.innerHTML = '<div style="color: red;">⚠️ Camera cần HTTPS để hoạt động. Vui lòng truy cập qua HTTPS.</div>';
        startScanButton.disabled = true;
        return;
    }

    // Kiểm tra hỗ trợ getUserMedia
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        scanResultDisplay.innerHTML = '<div style="color: red;">⚠️ Trình duyệt không hỗ trợ camera.</div>';
        startScanButton.disabled = true;
        return;
    }

    // Cấu hình QuaggaJS với xử lý lỗi tốt hơn
    const quaggaConfig = {
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: videoContainer,
            constraints: {
                width: { min: 640, ideal: 1280, max: 1920 },
                height: { min: 480, ideal: 720, max: 1080 },
                facingMode: "environment", // Camera sau
                aspectRatio: { ideal: 1.777778 } // 16:9
            },
        },
        decoder: {
            readers: [
                "ean_reader", 
                "ean_8_reader", 
                "code_128_reader",
                "code_39_reader",
                "code_93_reader",
                "codabar_reader"
            ]
        },
        locate: true,
        locator: {
            halfSample: true,
            patchSize: "medium", // x-small, small, medium, large, x-large
            debug: {
                showCanvas: false,
                showPatches: false,
                showFoundPatches: false,
                showSkeleton: false,
                showLabels: false,
                showPatchLabels: false,
                showRemainingPatchLabels: false,
                boxFromPatches: {
                    showTransformed: false,
                    showTransformedBox: false,
                    showBB: false
                }
            }
        },
        numOfWorkers: 2,
        frequency: 10,
        debug: {
            drawBoundingBox: true,
            showFrequency: true,
            drawScanline: true,
            showPattern: true
        }
    };

    // Hàm kiểm tra và yêu cầu quyền camera
    async function requestCameraPermission() {
        try {
            scanResultDisplay.innerHTML = '<div style="color: blue;">📷 Đang yêu cầu quyền truy cập camera...</div>';
            
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: "environment",
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                } 
            });
            
            // Dừng stream test
            stream.getTracks().forEach(track => track.stop());
            
            scanResultDisplay.innerHTML = '<div style="color: green;">✅ Quyền camera đã được cấp. Nhấn "Bắt đầu quét" để tiếp tục.</div>';
            return true;
        } catch (error) {
            console.error('Camera permission error:', error);
            let errorMessage = '';
            
            switch(error.name) {
                case 'NotAllowedError':
                    errorMessage = '❌ Quyền camera bị từ chối. Vui lòng:<br>1. Nhấn vào biểu tượng 🔒 trên thanh địa chỉ<br>2. Cho phép quyền Camera<br>3. Refresh trang và thử lại';
                    break;
                case 'NotFoundError':
                    errorMessage = '❌ Không tìm thấy camera. Vui lòng kiểm tra thiết bị có camera không.';
                    break;
                case 'NotSupportedError':
                    errorMessage = '❌ Trình duyệt không hỗ trợ camera.';
                    break;
                case 'NotReadableError':
                    errorMessage = '❌ Camera đang được sử dụng bởi ứng dụng khác.';
                    break;
                default:
                    errorMessage = `❌ Lỗi camera: ${error.message}`;
            }
            
            scanResultDisplay.innerHTML = `<div style="color: red;">${errorMessage}</div>`;
            return false;
        }
    }

    startScanButton.addEventListener("click", async function() {
        startScanButton.disabled = true;
        
        // Kiểm tra quyền camera trước
        const hasPermission = await requestCameraPermission();
        if (!hasPermission) {
            startScanButton.disabled = false;
            return;
        }
        
        scanResultDisplay.innerHTML = '<div style="color: blue;">📷 Đang khởi động camera...</div>';
        
        Quagga.init(quaggaConfig, function(err) {
            if (err) {
                console.error('Quagga init error:', err);
                let errorMessage = '';
                
                if (err.name === 'NotAllowedError') {
                    errorMessage = '❌ Quyền camera bị từ chối. Vui lòng cho phép quyền camera và thử lại.';
                } else if (err.name === 'NotFoundError') {
                    errorMessage = '❌ Không tìm thấy camera.';
                } else {
                    errorMessage = `❌ Không thể khởi động camera: ${err.message || err}`;
                }
                
                scanResultDisplay.innerHTML = `<div style="color: red;">${errorMessage}</div>`;
                startScanButton.disabled = false;
                return;
            }
            
            try {
                Quagga.start();
                scanResultDisplay.innerHTML = '<div style="color: green;">✅ Camera đã sẵn sàng. Hướng camera vào mã vạch để quét.</div>';
                stopScanButton.disabled = false;
            } catch (startErr) {
                console.error('Quagga start error:', startErr);
                scanResultDisplay.innerHTML = `<div style="color: red;">❌ Lỗi khi bắt đầu quét: ${startErr.message}</div>`;
                startScanButton.disabled = false;
            }
        });
    });

    stopScanButton.addEventListener("click", function() {
        try {
            Quagga.stop();
            scanResultDisplay.innerHTML = '<div style="color: orange;">⏹️ Đã dừng quét.</div>';
            startScanButton.disabled = false;
            stopScanButton.disabled = true;
        } catch (err) {
            console.error('Stop error:', err);
        }
    });

    Quagga.onDetected(function(result) {
        if(result.codeResult && result.codeResult.code){
            let code = result.codeResult.code;
            scanResultDisplay.innerHTML = `<div style="color: green; font-weight: bold;">🎉 Mã vạch được phát hiện: ${code}</div>`;
            
            // Dừng quét sau khi phát hiện
            setTimeout(() => {
                Quagga.stop();
                startScanButton.disabled = false;
                stopScanButton.disabled = true;
            }, 1000);

            // Tùy chọn: Gọi hàm để lấy thông tin sản phẩm từ Open Food Facts dựa trên mã vạch
            // Ví dụ: callProductInfoAPI(code);
        }
    });

    // Xử lý lỗi trong quá trình quét
    Quagga.onProcessed(function(result) {
        var drawingCtx = Quagga.canvas.ctx.overlay,
            drawingCanvas = Quagga.canvas.dom.overlay;

        if (result) {
            if (result.boxes) {
                drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                result.boxes.filter(function (box) {
                    return box !== result.box;
                }).forEach(function (box) {
                    Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "green", lineWidth: 2});
                });
            }

            if (result.box) {
                Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: "#00F", lineWidth: 2});
            }

            if (result.codeResult && result.codeResult.code) {
                Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'red', lineWidth: 3});
            }
        }
    });

    // Xử lý submit upload file
    const uploadForm = document.getElementById("barcode-upload-form");
    const uploadResultDisplay = document.getElementById("upload-result");

    uploadForm.addEventListener("submit", function(e) {
        e.preventDefault();
        let formData = new FormData(uploadForm);
        fetch("/api/process_barcode_image", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if(data.success){
                uploadResultDisplay.innerHTML = `<pre>${JSON.stringify(data.product, null, 2)}</pre>`;
            } else {
                uploadResultDisplay.innerText = data.message;
            }
        })
        .catch(err => {
            uploadResultDisplay.innerText = "Lỗi khi tải ảnh lên.";
        });
    });
});