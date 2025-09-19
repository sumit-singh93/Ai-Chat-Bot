const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

const chatTab = document.getElementById("chat-tab");
const historyTab = document.getElementById("history-tab");
const chatContainer = document.getElementById("chat-container");
const historyContainer = document.getElementById("history-container");
const historyList = document.getElementById("history-list");
const clearHistoryBtn = document.getElementById("clear-history");
const themeToggle = document.getElementById("theme-toggle");

// Gemini API details
let GEMINI_API_KEY = "AIzaSyAp8fdRBapj4P4TRg2s-X6Nr6foiiWfxWQ";
let GEMINI_MODEL = "gemini-2.5-flash";

// Store history in memory
let chatHistory = [];

// ✅ Custom predefined answers
const customReplies = {
  "hi": "Hello! How can I help you?😊",
  "hello": "Hey there 👋",
  "who are you": "I am CareSync AI 🤖",
  "tell me something about CareSync": "Nabha’s rural areas face severe healthcare shortages, with few doctors and poor access to medicines. A simple telemedicine app with offline records and real-time pharmacy updates can improve care for thousands.",
  "bye": "bye! have a nice day 😊"
};

// Auto scroll function
function scrollToBottom() {
  setTimeout(() => {
    chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: "smooth" });
  }, 100);
}

async function getGeminiReply(userMessage) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userMessage }] }]
      })
    });

    const data = await response.json();
    return (
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ Sorry, I didn’t get that."
    );
  } catch (err) {
    console.error(err);
    return "❌ Error: Could not connect to server";
  }
}

async function sendMessage() {
  let message = userInput.value.trim();
  if (message === "") return;

  // User message add
  let userMsgDiv = document.createElement("div");
  userMsgDiv.classList.add("user-message");
  userMsgDiv.innerHTML = `
    <div class="message">${message}</div>
    <img src="user.png" class="user-icon">
  `;
  chatBox.appendChild(userMsgDiv);
  scrollToBottom();
  userInput.value = "";

  // Bot thinking message
  let botMsgDiv = document.createElement("div");
  botMsgDiv.classList.add("bot-message");
  botMsgDiv.innerHTML = `
    <img src="ai.png" class="bot-icon">
    <div class="message">⏳ Thinking...</div>
  `;
  chatBox.appendChild(botMsgDiv);
  scrollToBottom();

  let reply;

  // ✅ First check custom replies
  if (customReplies[message.toLowerCase()]) {
    reply = customReplies[message.toLowerCase()];
  } else {
    // Otherwise call Gemini API
    reply = await getGeminiReply(message);
  }

  botMsgDiv.querySelector(".message").innerText = reply;
  scrollToBottom();

  // Save to history
  saveToHistory(message, reply);
}

// Save chat to history tab
function saveToHistory(userMessage, botReply) {
  const item = document.createElement("div");
  item.classList.add("history-item");
  item.innerHTML = `
    <p><strong>You:</strong> ${userMessage}</p>
    <p><strong>Bot:</strong> ${botReply}</p>
  `;
  historyList.appendChild(item);

  chatHistory.push({ user: userMessage, bot: botReply });
}

// Clear history
clearHistoryBtn.addEventListener("click", () => {
  historyList.innerHTML = "";
  chatHistory = [];
});

// Tab switching
chatTab.addEventListener("click", () => {
  chatTab.classList.add("active");
  historyTab.classList.remove("active");
  chatContainer.style.display = "flex";
  historyContainer.style.display = "none";
});

historyTab.addEventListener("click", () => {
  historyTab.classList.add("active");
  chatTab.classList.remove("active");
  chatContainer.style.display = "none";
  historyContainer.style.display = "flex";
});

// Send on button click / enter
sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") sendMessage();
});

// Dark/Light Mode Toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");

  if (document.body.classList.contains("dark")) {
    themeToggle.textContent = "🌙";
  } else {
    themeToggle.textContent = "☀️";
  }
});
