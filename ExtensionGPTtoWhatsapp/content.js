// Wait for WhatsApp Web to load and inject buttons into the interface
window.addEventListener('load', function () {
    // Inject Correction Button
    const inputBox = document.querySelector("div[contenteditable='true']"); // WhatsApp message input field
    if (inputBox) {
        addButtons(inputBox);
    }

    function addButtons(inputBox) {
        const correctionButton = document.createElement('button');
        correctionButton.innerText = 'Correct';
        correctionButton.classList.add('correct-button');
        correctionButton.onclick = () => handleCorrection(inputBox);

        const suggestionButton = document.createElement('button');
        suggestionButton.innerText = 'Suggest';
        suggestionButton.classList.add('suggest-button');
        suggestionButton.onclick = () => handleSuggestion(inputBox);

        inputBox.parentElement.appendChild(correctionButton);
        inputBox.parentElement.appendChild(suggestionButton);
    }

    // Handle text correction via ChatGPT
    function handleCorrection(inputBox) {
        const userText = inputBox.innerText;
        chrome.runtime.sendMessage({ type: "correct_text", text: userText }, (response) => {
            inputBox.innerText = response.text;
        });
    }

    // Handle response suggestion via ChatGPT
    function handleSuggestion(inputBox) {
        const chatHistory = getLastMessages(); // Function to get chat history
        const prompt = `Based on this conversation, suggest an appropriate response: ${chatHistory}`;
        
        chrome.runtime.sendMessage({ type: "suggest_response", text: prompt }, (response) => {
            inputBox.innerText = response.text;
        });
    }

    // Helper function to fetch recent chat history
    function getLastMessages() {
        const messages = [...document.querySelectorAll(".message-text")];
        const lastFive = messages.slice(-5).map(msg => msg.innerText).join("\n");
        return lastFive;
    }
});
