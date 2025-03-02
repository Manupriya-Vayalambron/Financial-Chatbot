from flask import Flask, request, jsonify, render_template
from openai import OpenAI
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),  # Load API key from environment
)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')  # Get the text message
    image_url = request.json.get('image_url')  # Get the image URL (optional)

    print(f"User Message: {user_message}")  # Debugging: Print the user's message
    if image_url:
        print(f"Image URL: {image_url}")  # Debugging: Print the image URL

    try:
        # Prepare the messages for the API
        messages = [
            {
                "role": "user",
                "content": []
            }
        ]

        # Add text message if provided
        if user_message:
            messages[0]["content"].append({
                "type": "text",
                "text": user_message
            })

        # Add image URL if provided
        if image_url:
            messages[0]["content"].append({
                "type": "image_url",
                "image_url": {
                    "url": image_url
                }
            })

        # Call the OpenAI API with Google Gemini model
        completion = client.chat.completions.create(
            extra_headers={
                "HTTP-Referer": "<YOUR_SITE_URL>",  # Optional. Site URL for rankings on openrouter.ai.
                "X-Title": "<YOUR_SITE_NAME>",  # Optional. Site title for rankings on openrouter.ai.
            },
            extra_body={},
            model="google/gemini-exp-1206:free",  # Use Google Gemini model
            messages=messages
        )

        # Extract the chatbot's reply
        reply = completion.choices[0].message.content
        print(f"Chatbot Reply: {reply}")  # Debugging: Print the chatbot's reply
        return jsonify({'reply': reply})
    except Exception as e:
        print(f"Error: {e}")  # Debugging: Print any exceptions
        return jsonify({'reply': 'Sorry, something went wrong. Please try again.'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)