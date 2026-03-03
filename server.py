#!/usr/bin/env python3
"""
Simple Flask-based Telegram proxy server for the Rnasaks2 project
Serves static files and proxies Telegram API requests server-side to avoid CORS
"""

from flask import Flask, request, jsonify, send_from_directory
import requests
import json
import os
from pathlib import Path

app = Flask(__name__, static_folder=".", static_url_path="")
app.config['JSON_AS_ASCII'] = False
PORT = int(os.getenv('PORT', 5000))

# Serve static files (HTML, CSS, JS)
@app.route('/')
def serve_root():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    """Serve static files from project root"""
    if path.endswith('.html') or path.endswith('.js') or path.endswith('.css'):
        if os.path.isfile(path):
            return send_from_directory('.', path)
        # Try in subdirectories
        for file_path in Path('.').rglob(Path(path).name):
            if file_path.is_file():
                return send_from_directory(str(file_path.parent), file_path.name)
    return send_from_directory('.', path)

# Telegram proxy endpoint
@app.route('/telegram-proxy', methods=['POST'])
def telegram_proxy():
    """
    Proxy Telegram API requests server-side to avoid browser CORS restrictions.
    Accepts JSON: { url, method, headers, body }
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({'ok': False, 'error': 'No JSON body'}), 400

        url = data.get('url', '')
        method = data.get('method', 'POST').upper()
        headers = data.get('headers', {})
        body = data.get('body')

        # Validate URL (only allow Telegram API)
        if not url or not url.startswith('https://api.telegram.org/'):
            return jsonify({'ok': False, 'error': 'Invalid URL'}), 400

        # Make request to Telegram API
        try:
            if method in ['POST', 'PUT']:
                # Handle both JSON and form data
                if isinstance(body, dict):
                    resp = requests.post(url, json=body, headers=headers, timeout=15)
                else:
                    resp = requests.post(url, data=body, headers=headers, timeout=15)
            else:
                resp = requests.get(url, headers=headers, timeout=15)

            # Return Telegram's response as-is
            try:
                return jsonify(resp.json()), resp.status_code
            except:
                return jsonify({'ok': False, 'text': resp.text}), resp.status_code

        except requests.exceptions.Timeout:
            return jsonify({'ok': False, 'error': 'Request timeout'}), 504
        except requests.exceptions.RequestException as e:
            return jsonify({'ok': False, 'error': str(e)}), 500

    except Exception as e:
        return jsonify({'ok': False, 'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for monitoring"""
    return jsonify({'status': 'ok', 'server': 'telegram-proxy'})

if __name__ == '__main__':
    print(f"🚀 Telegram Proxy Server running at http://localhost:{PORT}")
    print(f"📁 Serving static files from: {os.getcwd()}")
    print(f"🔄 Proxy endpoint: http://localhost:{PORT}/telegram-proxy")
    app.run(host='0.0.0.0', port=PORT, debug=False)
