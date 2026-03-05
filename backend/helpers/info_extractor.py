import pdfplumber
import docx2txt
import io
import os
import re
import spacy # 1. Added import
import fitz  # PyMuPDF
import zipfile

# Load the NLP model (Make sure to run: python -m spacy download en_core_web_sm)
try:
    nlp = spacy.load("en_core_web_sm")
except:
    nlp = None

SUPPORTED_TYPES = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain"
]

# 2. Define the missing function
def extract_name_spacy(text: str):
    if not nlp:
        return None
    # Process only the first 500 characters (where the name usually is)
    doc = nlp(text[:500])
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            # Simple check to ensure the name doesn't contain digits
            if not any(char.isdigit() for char in ent.text):
                return ent.text
    return None

def extract_name(text: str):
    # Try spaCy first
    try:
        name = extract_name_spacy(text)
        if name: return name
    except:
        pass
        
    # Fallback to the first-line heuristic (skipping common headers)
    skip_keywords = ["resume", "curriculum vitae", "cv", "personal info"]
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    
    for line in lines[:3]: # Check the first 3 lines
        if line.lower() not in skip_keywords:
            return line
            
    return "Unknown"

def extract_experience_section(text: str):
    # Regex to find text between "Experience" and another common header
    pattern = re.compile(r"(?:Experience|Work History|Employment)(.*?)(?:Education|Skills|Projects|Certifications|$)", re.DOTALL | re.IGNORECASE)
    match = re.search(pattern, text)
    if match:
        return match.group(1).strip()
    return "Experience section not found"

# --- Extraction Logic ---

def extract_pdf(file_bytes: bytes) -> str:
    text = []
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text.append(page_text)
    return "\n".join(text)

def extract_docx(file_bytes: bytes) -> str:
    temp_path = "temp.docx"
    with open(temp_path, "wb") as f:
        f.write(file_bytes)
    text = docx2txt.process(temp_path)
    os.remove(temp_path)
    return text

def extract_txt(file_bytes: bytes) -> str:
    return file_bytes.decode("utf-8", errors="ignore")

# --- Specific Parsers ---

def extract_emails(text: str):
    return list(set(re.findall(
        r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}",
        text
    )))

def extract_phone_numbers(text: str):
    return list(set(re.findall(
        r"(?:\+63|0|\(\+63\))9\d{9}",
        text
    )))

def extract_education(text: str):
    education_keywords = ["Bachelor", "BS", "BA", "Master", "MS", "PhD", "College", "University"]
    education = []
    for line in text.split("\n"):
        if any(k.lower() in line.lower() for k in education_keywords):
            education.append(line.strip())
    return education

# --- Main Entry Point ---

def extract_info(file_bytes: bytes, content_type: str):
    if content_type == "application/pdf":
        extracted_text = extract_pdf(file_bytes)
    elif content_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        extracted_text = extract_docx(file_bytes)
    elif content_type == "text/plain":
        extracted_text = extract_txt(file_bytes)
    else:
        raise ValueError("Unsupported file type")
    
    profile_image = extract_resume_image(file_bytes, content_type)

    # 3. Return the results including the name
    return {
        "name": extract_name(extracted_text),
        "emails": extract_emails(extracted_text),
        "phone_numbers": extract_phone_numbers(extracted_text),
        "education": extract_education(extracted_text),
        "profile_image": profile_image,
        "experience": extract_experience_section(extracted_text), # Add this!
        "text": extracted_text
    }

# extract image from .pdf files
def extract_images_from_pdf(file_bytes: bytes):
    images = []

    pdf = fitz.open(stream=file_bytes, filetype="pdf")

    for page_index in range(len(pdf)):
        page = pdf[page_index]
        image_list = page.get_images(full=True)

        for img in image_list:
            xref = img[0]
            base_image = pdf.extract_image(xref)
            image_bytes = base_image["image"]
            images.append(image_bytes)

    pdf.close()
    return images

# extract image from .docx files
def extract_images_from_docx(file_bytes: bytes):
    images = []

    with zipfile.ZipFile(io.BytesIO(file_bytes)) as docx:
        for file in docx.namelist():
            if file.startswith("word/media/"):
                images.append(docx.read(file))

    return images

def get_profile_image(images: list[bytes]):
    if not images:
        return None

    # choose largest image (likely profile picture)
    return max(images, key=len)


def extract_resume_image(file_bytes: bytes, content_type: str):

    images = []

    if content_type == "application/pdf":
        images = extract_images_from_pdf(file_bytes)

    elif content_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        images = extract_images_from_docx(file_bytes)

    if not images:
        return None

    return get_profile_image(images)