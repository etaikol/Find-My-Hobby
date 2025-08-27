FROM python:3.10-slim

WORKDIR /app

# copy requirements first
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# copy rest of the app
COPY . .

CMD ["python", "run.py"]
