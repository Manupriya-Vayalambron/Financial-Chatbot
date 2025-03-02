document.getElementById('send-btn').addEventListener('click', function() {
    sendMessage();
});

document.getElementById('user-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() === "") return;

    addMessageToChatBox('user', userInput);
    document.getElementById('user-input').value = '';

    // Show "Thinking..." text
    const thinkingText = document.getElementById('thinking-text');
    thinkingText.style.display = 'block';

    fetch('/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: userInput
        })
    })
    .then(response => {
        console.log("Response Status:", response.status);
        return response.json();
    })
    .then(data => {
        console.log("Response Data:", data);
        // Hide "Thinking..." text
        thinkingText.style.display = 'none';
        // Simulate typing the response
        typeMessage('bot', data.reply);
    })
    .catch(error => {
        console.error("Error:", error);
        // Hide "Thinking..." text
        thinkingText.style.display = 'none';
        addMessageToChatBox('bot', 'Sorry, something went wrong. Please try again.');
    });
}

function addMessageToChatBox(sender, message) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.innerHTML = message;  // Use innerHTML to render any HTML content in the response
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function typeMessage(sender, message) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;

    let index = 0;
    const typingSpeed = 10; // Adjust typing speed (milliseconds per character)
    let isTyping = true; // Flag to control typing

    // Add a "Stop" button
    const stopButton = document.createElement('button');
    stopButton.textContent = 'Stop';
    stopButton.classList.add('stop-button');
    stopButton.addEventListener('click', () => {
        isTyping = false; // Stop typing
        stopButton.remove(); // Remove the button
    });
    chatBox.appendChild(stopButton);

    function type() {
        if (index < message.length && isTyping) {
            // Append characters one by one
            if (message.charAt(index) === '\n') {
                // Handle newlines
                messageElement.innerHTML += '<br>';
            } else {
                // Append regular characters
                messageElement.textContent += message.charAt(index);
            }
            index++;
            chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the latest message
            setTimeout(type, typingSpeed);
        } else {
            // Remove the "Stop" button when typing is complete
            if (stopButton) stopButton.remove();
        }
    }

    type();
}