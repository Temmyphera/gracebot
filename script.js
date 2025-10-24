const chatToggle = document.getElementById("chat-toggle");
const chatbot = document.getElementById("chatbot");
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const typing = document.getElementById("typing");

let lastUserMessage = "";

// Toggle chat window open/close
chatToggle.addEventListener("click", () => {
  chatbot.classList.toggle("show");
});

// Handle send button and Enter key
sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  appendMessage("user", text);
  userInput.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;

  typing.style.display = "block";

  getBotResponse(text)
    .then((response) => {
      typing.style.display = "none";
      appendMessage("bot", response);
    })
    .catch((err) => {
      typing.style.display = "none";
      appendMessage(
        "bot",
        "⚠️ GraceBot couldn’t reach her brain right now. Please make sure the server is running."
      );
      console.error(err);
    });

  lastUserMessage = text;
}

function appendMessage(sender, text) {
  const div = document.createElement("div");
  div.classList.add(sender === "bot" ? "bot-message" : "user-message");
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// 🌐 Connect to your AI backend (real OpenAI brain)
async function getBotResponse(input) {
  try {
    const res = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    if (!res.ok) throw new Error("Server error");

    const data = await res.json();
    return (
      data.reply ||
      "Hmm… I’m not sure about that, but I can help you think through it 💬"
    );
  } catch (err) {
    console.error("Error reaching AI server:", err);
    return "⚠️ GraceBot couldn’t reach her brain right now. Please make sure the server is running.";
  }
}
