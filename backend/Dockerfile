# Use a slim Python base
FROM python:3.12-slim

# Set work directory
WORKDIR /app

# Copy only requirements first to leverage caching
COPY requirements.txt .

# Upgrade pip and install dependencies
RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy the rest of the code
COPY . .

# Download spaCy models at build time
RUN python -m spacy download en_core_web_sm \
    || echo "en_core_web_sm already installed" \
 && python -m spacy download tl_core_news_sm \
    || echo "tl_core_news_sm already installed"

# Expose the port
EXPOSE 8000

# Start FastAPI app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
