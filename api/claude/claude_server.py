from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

import os
from dotenv import load_dotenv

app = Flask(__name__)
# Full CORS configuration
CORS(app, 
    resources={r"/api/*": {
        "origins": [
            "http://localhost:8000", 
            "http://127.0.0.1:8000",
            "localhost:8000",
            "localhost"
        ],
        "methods": ["OPTIONS", "HEAD", "GET", "POST"],
        "allow_headers": ["Content-Type", "Authorization"]
    }},
    supports_credentials=True
)

# Custom CORS handler
@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS, GET'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response

@app.route('/api/claude', methods=['OPTIONS', 'POST'])
def claude_proxy():
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        return jsonify(success=True), 200

    try:
        # Your Anthropic API key
        load_dotenv()
        anthropic_api_key = os.getenv('ANTHROPIC_API_KEY')
        
        # Anthropic API headers
        headers = {
            'Content-Type': 'application/json',
            'x-api-key': anthropic_api_key,
            'anthropic-version': '2023-06-01'
        }
        
        # Forward the request to Anthropic API
        anthropic_response = requests.post(
            'https://api.anthropic.com/v1/messages', 
            headers=headers, 
            json=request.json
        )
        
        return jsonify(anthropic_response.json())
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)