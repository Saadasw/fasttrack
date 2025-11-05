FROM python:3.11-slim

WORKDIR /app

# Environment setup
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download the cross-encoder model to speed up startup
RUN python -c "from sentence_transformers import CrossEncoder; CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')"

# Copy source code
COPY . .

# Create necessary directories
RUN mkdir -p vector_store uploads kb

# Expose port (chatbot runs on 8010)
EXPOSE 8010

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8010/api/health')" || exit 1

# Start the chatbot FastAPI server
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8010"]

