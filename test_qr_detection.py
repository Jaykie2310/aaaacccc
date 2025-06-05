import cv2
import numpy as np
from PIL import Image
import os
import logging
from app import decode_with_multiple_methods

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_test_qr():
    """Create a test QR code image"""
    import qrcode
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data('Test QR Code 123')
    qr.make(fit=True)
    qr_image = qr.make_image(fill_color="black", back_color="white")
    qr_image.save('test_qr.png')
    return 'test_qr.png'

def test_qr_detection():
    """Test QR code detection with different scenarios"""
    
    # Create test QR code
    test_file = create_test_qr()
    logger.info(f"Created test QR code: {test_file}")
    
    # Test scenarios
    scenarios = []
    
    # 1. Original QR code
    scenarios.append(('original', Image.open(test_file)))
    
    # 2. Rotated QR code
    img = Image.open(test_file)
    scenarios.append(('rotated', img.rotate(45)))
    
    # 3. Resized QR code (small)
    img = Image.open(test_file)
    scenarios.append(('small', img.resize((100, 100))))
    
    # 4. Resized QR code (large)
    scenarios.append(('large', img.resize((1200, 1200))))
    
    # 5. Low contrast
    img = Image.open(test_file).convert('L')
    img = Image.fromarray((np.array(img) * 0.5).astype(np.uint8))
    scenarios.append(('low_contrast', img))
    
    # Test each scenario
    success_count = 0
    for scenario_name, test_image in scenarios:
        logger.info(f"\nTesting scenario: {scenario_name}")
        results = decode_with_multiple_methods(test_image)
        
        if results:
            success_count += 1
            logger.info(f"✅ Success! Detected using method: {results[0]['method']}")
            logger.info(f"Data: {results[0]['data']}")
        else:
            logger.error(f"❌ Failed to detect QR code in {scenario_name} scenario")
    
    # Clean up
    if os.path.exists(test_file):
        os.remove(test_file)
    
    # Report results
    logger.info(f"\nTest Summary:")
    logger.info(f"Total scenarios: {len(scenarios)}")
    logger.info(f"Successful detections: {success_count}")
    logger.info(f"Success rate: {(success_count/len(scenarios))*100:.1f}%")
    
    return success_count == len(scenarios)

if __name__ == '__main__':
    test_qr_detection()
