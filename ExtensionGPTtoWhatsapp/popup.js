document.getElementById('saveButton').addEventListener('click', () => {
    const apiKey = document.getElementById('apiKeyInput').value;
    chrome.storage.sync.set({ openaiKey: apiKey }, () => {
        alert('API Key Saved');
    });
});
