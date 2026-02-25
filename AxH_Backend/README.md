# AxH Project

This is a voice AI routing backend project. It handles incoming webhook calls, routes them to an AI model (Gemini), and handles generating text-to-speech responses, possibly utilizing Twilio for making/answering calls.

## Key Files
- `app.py`: Main Flask/FastAPI application routing the requests.
- `ai_router.py`: Handles router logic for AI prompts.
- `db.py` & `setup_db.py`: Database operations and setup scripts.
- `check_ngrok.py`: Utility to ensure ngrok is running for local webhook testing.
- `make_call.py`: Script to initiate a call.

## Setup
1. Create a virtual environment and install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Run database setup:
   ```bash
   python setup_db.py
   ```
3. Set environment variables based on `.env.example`.
4. Run the app:
   ```bash
   python app.py
   ```
