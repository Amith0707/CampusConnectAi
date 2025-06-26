from pdf2image import convert_from_path
import pytesseract

def extract_text_from_pdf(pdf_path):
    try:
        # Convert only the first page
        images = convert_from_path(pdf_path, first_page=1, last_page=1)
        if not images:
            return "Error: No pages found in the PDF."

        # OCR the first page
        text = pytesseract.image_to_string(images[0])
        return text

    except Exception as e:
        return f"OCR Error: {str(e)}"

# Call and print the result
pdf_path = r"C:\Users\Dell\Music\Fee-Receipt.pdf"
text_output = extract_text_from_pdf(pdf_path)
print(text_output)
