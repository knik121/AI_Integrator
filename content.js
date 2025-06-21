// Description: Handles all the webpage level activities (e.g. manipulating page data, etc.)

const ASSET_URL = {
    "close": chrome.runtime.getURL("assets/delete.png"),
    "send": chrome.runtime.getURL("assets/play.png")
  };
  
  const CODING_DESC_CONTAINER_CLASS = "py-4 px-3 coding_desc_container__gdB9M";
  const AI_HELPER_BUTTON_ID = "ai-helper-button";
  const CHAT_CONTAINER_ID = "ai-helper-chat-container";
  
  const COLORS = {
    "blue": "#805C83",
    "dark_blue": "#012841",
    "beige": "#EFEBDA",
    "light_green": "#54A59C",
    "dark_green": "#106550",
    "light_brown": "#7F7350",
    "dark_brown": "#28190E",
    "red": "#A33330",
    "lightgray": "#dfebee",
    "gray": "#639caf",
    "white": "#ffffff"
  };

  // content.js

window.addEventListener("xhrDataFetched", (event) => {
    const data = event.detail;
    console.log("Received data in content.js:", data);
  });

let lastPageVisited="";


const observer=new MutationObserver(()=>{
    handleContentChange();
});

observer.observe(document.body, { childList: true, subtree: true });

handleContentChange();

function handleContentChange() {
  if (isPageChange()) handlePageChange();
}

function isPageChange() {
  const currentPage = window.location.pathname;
  //returns name after domain name
  if (currentPage === lastPageVisited) return false;
  lastPageVisited = currentPage;//Unnecessary??
  return true;
}

function handlePageChange() {
  if (isProblemsRoute()) {
    cleanUpPage();//Removes opened Chatbbox (if applicable)
    addInjectScript();
    addAIChatbotButton();//Adds the button
  }
}

//Wrong innit coz https://maang/problems is an invalid location
// function onTargetPage() {

//   return window.location.pathname.startsWith('/problems/');
// }

function isProblemsRoute() {
    const pathname = window.location.pathname;
    return pathname.startsWith("/problems/") && pathname.length > "/problems/".length;
}

function cleanUpPage() {
    const existingButton = document.getElementById(AI_HELPER_BUTTON_ID);
    if(existingButton) existingButton.remove();

    const existingChatContainer = document.getElementById(CHAT_CONTAINER_ID);
    if(existingChatContainer) existingChatContainer.remove();
}

function addInjectScript() {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("inject.js");
    document.documentElement.insertAdjacentElement("afterbegin", script);
    script.remove();
}

// Wait for the page to load
// function AddAIButton () {
//     // Check if the "AI Help" button already exists (to avoid duplicates)
//     if (document.querySelector("#ai-help-button")) return;                              
  
//     // Find the container for the tabs
//     const tabContainer = document.querySelector(
//       "ul.d-flex.flex-row.p-0.gap-2.justify-content-between"
//     );
    
//     if(!tabContainer) return
//     // if(tabContainer){
//       // Create a new list item for the AI Help button
//       const aiHelpButton = document.createElement("li");
//       aiHelpButton.id = AI_HELPER_BUTTON_ID; // Set ID for the button
//       aiHelpButton.className = "d-flex flex-row rounded-3"; // Add classes to match existing buttons
//       aiHelpButton.style.cursor = "pointer"; // Add a cursor pointer on hover
  
//       // Add inner content (similar to other tabs)
//       aiHelpButton.innerHTML = `
//         <button style="padding: 0.36rem 1rem; background-color: #4CAF50; color: white; border: none; border-radius: 3px;">
//           AI Help
//         </button>
//       `;
  
//       // Append the new button to the tab container
//       tabContainer.appendChild(aiHelpButton);
//       aiHelpButton.addEventListener("click", () => {
//         if (!document.getElementById(CHAT_CONTAINER_ID)) {
//           injectChatInterface(CHAT_CONTAINER_ID);
//         }
//       });
//     // }
//   };


function addAIChatbotButton() {
    const aiButton = document.createElement("button");
    aiButton.id = AI_HELPER_BUTTON_ID;
    aiButton.innerText = "AI Helper";
    aiButton.style.cssText = `
      background-color: ${COLORS["blue"]};
      color: white;
      border: none;
      border-radius: 5px;
      padding: 10px 15px;
      cursor: pointer;
      font-size: 14px;
      font-weight: bold;
      box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
      margin: 10px 0;
      transition: all 0.3s ease;
`;

    aiButton.onmouseover = () => (aiButton.style.backgroundColor = COLORS["dark_blue"]);
    aiButton.onmouseleave = () => (aiButton.style.backgroundColor = COLORS["blue"]);

    console.log(document.getElementsByClassName(CODING_DESC_CONTAINER_CLASS));
    const positioningElements=document.getElementsByClassName(CODING_DESC_CONTAINER_CLASS);
    if (positioningElements.length === 0) {
        console.log("No container found with class:", CODING_DESC_CONTAINER_CLASS);
        return;
    }

const codingDescContainer = positioningElements[0];
codingDescContainer.insertAdjacentElement("beforeend", aiButton);

aiButton.addEventListener("click", () => {
  if (!document.getElementById(CHAT_CONTAINER_ID)) {
    injectChatInterface(CHAT_CONTAINER_ID);
  }
});

}

function injectChatInterface(containerId) {
  // Create the main chat container
  const chatContainer = document.createElement("div");
  chatContainer.id = containerId;

  chatContainer.style.cssText = `
    width: 100%;
    height: 400px;
    display: flex;
    flex-direction: column;
    background-color: ${COLORS["white"]};
    border: 1px solid ${COLORS["dark_blue"]};
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
    border-radius: 20px;
    overflow: hidden;
`;

// Header with close button
const chatHeader = document.createElement("div");

chatHeader.style.cssText = `
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: ${COLORS["blue"]};
  color: ${COLORS["beige"]};
  font-size: 16px;
  font-weight: bold;
`;

chatHeader.innerText = "AI Helper";

const closeButton = document.createElement("img");
closeButton.src = ASSET_URL["close"];
closeButton.alt = "Close";
closeButton.style.cssText = `
  width: 20px;
  height: 20px;
  cursor: pointer;
`;
closeButton.addEventListener("click", () => chatContainer.remove());
chatHeader.appendChild(closeButton);

// Chat messages area
const chatMessages = document.createElement("div");
chatMessages.id = "chat-messages";
chatMessages.style.cssText = `
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  background-color: ${COLORS["lightgray"]};
`;
// Input area
const chatInputContainer = document.createElement("div");
chatInputContainer.style.cssText = `
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: ${COLORS["beige"]};
  border-top: 1px solid ${COLORS["lightgray"]};
`;

const chatInput = document.createElement("textarea");
chatInput.id = "chat-input";
chatInput.placeholder = "Type your message...";
chatInput.rows = 2; // Default visible rows, can expand

chatInput.style.cssText = `
  flex: 1;
  padding: 8px;
  border: 1px solid ${COLORS["lightgray"]};
  border-radius: 5px;
  outline: none;
  resize: none; /* Prevent manual resizing */
  font-size: 14px;
  line-height: 1.4;
  background-color: ${COLORS["white"]};
`;

const sendButton = document.createElement("img");
sendButton.src = ASSET_URL["send"];
sendButton.alt = "Send";
sendButton.style.cssText = `
  width: 25px;
  height: 25px;
  margin-left: 10px;
  cursor: pointer;
`;
sendButton.addEventListener("click", () => handleSendMessage());

// Assemble input area
chatInputContainer.appendChild(chatInput);
chatInputContainer.appendChild(sendButton);

// Assemble chat container
chatContainer.appendChild(chatHeader);
chatContainer.appendChild(chatMessages);
chatContainer.appendChild(chatInputContainer);

const aiButton = document.getElementById(AI_HELPER_BUTTON_ID)
aiButton.insertAdjacentElement("afterend", chatContainer);
}


async function sendMessageToAPI(userMessage) {

    const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
    const API_KEY = "AIzaSyBro5a0eALUbWBduUM8mdn7hvfwvcGTbss"; // Replace with your actual API key

    try {
        // Prepare the payload
        const payload = {
            contents: [
                {
                    parts: [
                        { text: userMessage }
                    ]
                }
            ]
        };

        // Send the request
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
        // Parse the JSON response
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

// Extract the AI response from the first candidate
        return data.candidates &&
            data.candidates[0] &&
            data.candidates[0].content &&
            data.candidates[0].content.parts &&
            data.candidates[0].content.parts[0].text
            ? data.candidates[0].content.parts[0].text
            : "No response from the API.";

        } catch (error) {
            console.error("Error sending message to API:", error);
            return "An error occurred while connecting to the API.";
        }
}

async function handleSendMessage() {
    const chatInput = document.getElementById("chat-input");
    const chatMessages = document.getElementById("chat-messages");      
    // Get user message
    const userMessage = chatInput.value.trim();      
    if (!userMessage) return; // Don't send empty messages      
    // Display user's message in the chat
    const userMessageElement = document.createElement("div");
    userMessageElement.style.cssText = `
          padding: 8px;
          margin: 5px;
          background-color: ${COLORS["blue"]};
          color: ${COLORS["white"]};
          border-radius: 5px;
          align-self: flex-end;
          max-width: 70%;
          word-wrap: break-word;
        `;
        userMessageElement.innerText = userMessage;
        chatMessages.appendChild(userMessageElement);
      
        // Clear the input
        chatInput.value = "";
// Send the message to the API and get the response
const botReply = await sendMessageToAPI(userMessage);

// Display bot's reply
const botMessageElement = document.createElement("div");
botMessageElement.style.cssText = `
  padding: 8px;
  margin: 5px;
  background-color: ${COLORS["beige"]};
  color: ${COLORS["black"]};
  border-radius: 5px;
  align-self: flex-start;
  max-width: 70%;
  word-wrap: break-word;
`;
botMessageElement.innerText = botReply;
chatMessages.appendChild(botMessageElement);

// Scroll to the bottom of the chat
chatMessages.scrollTop = chatMessages.scrollHeight;
}