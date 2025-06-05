#!/usr/bin/env python3
"""
Test script to verify that all barcode scanning dependencies are working correctly
"""

def test_pyzbar():
    """Test pyzbar import and basic functionality"""
    try:
        from pyzbar.pyzbar import decode
        print("✅ pyzbar imported successfully")
        return True
    except ImportError as e:
        print(f"❌ pyzbar import failed: {e}")
        return False

def test_opencv():
    """Test OpenCV import and QR detector"""
    try:
        import cv2
        detector = cv2.QRCodeDetector()
        print("✅ OpenCV imported successfully")
        return True
    except ImportError as e:
        print(f"❌ OpenCV import failed: {e}")
        return False

def test_pillow():
    """Test Pillow import"""
    try:
        from PIL import Image
        print("✅ Pillow imported successfully")
        return True
    except ImportError as e:
        print(f"❌ Pillow import failed: {e}")
        return False

def test_numpy():
    """Test NumPy import"""
    try:
        import numpy as np
        print("✅ NumPy imported successfully")
        return True
    except ImportError as e:
        print(f"❌ NumPy import failed: {e}")
        return False

def main():
    print("Testing barcode scanning dependencies...")
    print("=" * 50)
    
    tests = [
        test_pillow,
        test_numpy,
        test_opencv,
        test_pyzbar
    ]
    
    results = []
    for test in tests:
        results.append(test())
    
    print("=" * 50)
    if all(results):
        print("🎉 All dependencies are working correctly!")
        return 0
    else:
        print("⚠️  Some dependencies failed. Check the errors above.")
        return 1

if __name__ == "__main__":
    exit(main())
