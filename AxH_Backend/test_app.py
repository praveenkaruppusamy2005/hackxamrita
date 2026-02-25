import traceback
from app import app

with app.test_client() as c:
    response = c.post('/process', data={'SpeechResult': 'hello world'})
    print("STATUS", response.status_code)
    print("TEXT", response.text)
