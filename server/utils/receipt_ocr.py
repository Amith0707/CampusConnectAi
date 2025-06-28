# utils/receipt_ocr.py
import sys
import json
from pdf2image import convert_from_path
import pytesseract
import re

def extract_text_from_pdf(pdf_path):
    try:
        images = convert_from_path(pdf_path, first_page=1, last_page=1)
        if not images:
            return None
        return pytesseract.image_to_string(images[0])
    except Exception:
        return None

def extract_usn(text):
    """
    Tries to extract USN from lines that contain either:
    - USN
    - Registration Number
    - Registration Number / USN
    """
    lines = text.split('\n')
    for line in lines:
        if re.search(r'(USN|Registration Number)', line, re.IGNORECASE):
            match = re.search(r'\b[1-9][A-Z]{2}\d{2}[A-Z]{2}\d{3}\b', line, re.IGNORECASE)
            if match:
                return match.group(0).upper()
    return None

def extract_amount(text):
    # Looks for "Total Fee Rs. <amount>" or variants
    match = re.search(r'Total Fee\s*Rs\.?\s*([0-9]+)', text, re.IGNORECASE)
    return int(match.group(1)) if match else 0

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(json.dumps({"error": "No PDF path provided"}))
        sys.exit(1)

    pdf_path = sys.argv[1]
    text = extract_text_from_pdf(pdf_path)

    if not text:
        print(json.dumps({"error": "Failed to extract text from PDF"}))
        sys.exit(1)

    usn = extract_usn(text)
    amount = extract_amount(text)

    print(json.dumps({
        "usn": usn or "Not found",
        "amountFound": amount
    }))
