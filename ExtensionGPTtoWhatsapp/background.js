chrome.runtime.onInstalled.addListener(() => {
    console.log("WhatsApp ChatGPT Extension Installed");
});

const CHATGPT_API_KEY = 'YOUR_API_KEY_HERE';

// Function to handle API calls to OpenAI
async function getChatGPTResponse(prompt) {
    const response = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${CHATGPT_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: "gpt-4", 
            prompt: prompt,
            max_tokens: 1000
        }),
    });
    const data = await response.json();
    return data.choices[0].text.trim();
}

// Listen for messages from content.js
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.type === "correct_text" || message.type === "suggest_response") {
        const gptResponse = await getChatGPTResponse(message.text);
        sendResponse({ text: gptResponse });
    }
    return true; // Keeps the message channel open for async response
});
