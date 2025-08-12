@echo off
REM Setup Python virtual environment and install dependencies

echo Creating virtual environment...
python -m venv venv

echo Activating virtual environment...
call venv\Scripts\activate

echo Installing dependencies...
pip install flask flask-cors

echo Saving requirements...
pip freeze > requirements.txt

echo Setup complete.
echo To start the server, run:
echo venv\Scripts\activate && python run.py
pause