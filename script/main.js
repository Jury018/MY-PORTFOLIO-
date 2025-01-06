// Import modules
import { skillFunctionality } from "./skills.js";
import { topNav } from "./topnav.js";
import { animation } from "./animation.js";
import { db, collection, addDoc, viewDocRef, getDoc, updateDoc, setDoc } from './firebase.js';

// Initialize imported modules
topNav();
skillFunctionality();
animation();

// Add copyright dynamically
const copyright = `&copy;${new Date().getFullYear()} BONFIRE. All rights reserved`;
document.querySelector('footer p').innerHTML = copyright;

// DOMContentLoaded Event
document.addEventListener("DOMContentLoaded", async () => {
  // Add CSS styles dynamically
  const style = document.createElement("style");
  style.innerHTML = `
    .custom-alert {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: none;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }

    .custom-alert-content {
      background-color: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      width: 300px;
    }

    #alertMessage {
      color: black;  
    }

    .btn {
      background-color: red;  
      color: white;
      border: none;
      padding: 10px 15px;
      cursor: pointer;
      border-radius: 5px;
      margin-top: 15px;
    }

    .btn:hover {
      background-color: darkred;  
    }

    .word-warning {
      color: red;
      font-size: 0.9em;
      margin-top: 5px;
      display: none;
    }
  `;
  document.head.appendChild(style);

  // Create and append the custom alert modal
  const customAlert = document.createElement("div");
  customAlert.id = "customAlert";
  customAlert.className = "custom-alert";
  customAlert.innerHTML = `
    <div class="custom-alert-content">
      <p id="alertMessage"></p>
      <button id="closeAlert" class="btn">Close</button>
    </div>
  `;
  document.body.appendChild(customAlert);

  // Close alert functionality
  const closeAlert = document.querySelector("#closeAlert");
  closeAlert.addEventListener("click", () => {
    customAlert.style.display = "none";
  });

  // Form validation and submission
  const form = document.querySelector("#contactForm");

  if (form) {
    const nameInput = form.querySelector('#name');
    const emailInput = form.querySelector('#email');
    const messageInput = form.querySelector('#message');

    // Add word limit warning
    const wordWarning = document.createElement('p');
    wordWarning.className = 'word-warning';
    wordWarning.textContent = 'Feedback must be between 5 and 500 words.';
    messageInput.parentNode.appendChild(wordWarning);

    // Add live word count display
    const wordCountDisplay = document.createElement('p');
    wordCountDisplay.id = 'wordCountDisplay';
    wordCountDisplay.style.color = 'gray';
    wordCountDisplay.textContent = 'Word count: 0';
    messageInput.parentNode.appendChild(wordCountDisplay);

    // Handle word count validation and live count display
    const updateWordCount = () => {
      const wordCount = messageInput.value.trim().split(/\s+/).filter(word => word).length;
      wordCountDisplay.textContent = `Word count: ${wordCount}`;

      if (wordCount < 10) {
        wordWarning.style.display = 'block';
        wordWarning.textContent = 'Feedback must be at least 10 words.';
        return false;
      } else if (wordCount > 500) {
        wordWarning.style.display = 'block';
        wordWarning.textContent = 'Feedback has reached the maximum limit of 500 words.';
        return false;
      } else {
        wordWarning.style.display = 'none';
        return true;
      }
    };

    // Attach input event listener for live word count
    messageInput.addEventListener('input', updateWordCount);

    // Form submit event
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Validate word count
      if (!updateWordCount()) return;

      // Collect form data
      const clientData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        message: messageInput.value.trim(),
      };

      try {
        // Track page views in Firestore
        const viewSnapshot = await getDoc(viewDocRef);
        if (viewSnapshot.exists()) {
          const currentCount = viewSnapshot.data().count || 0;
          await updateDoc(viewDocRef, { count: currentCount + 1 });
        } else {
          await setDoc(viewDocRef, { count: 1 });
        }

        // Add client feedback to Firestore
        await addDoc(collection(db, "clientFeedback"), clientData);

        // Show success alert
        const showCustomAlert = (message) => {
          const alertMessage = document.querySelector("#alertMessage");
          alertMessage.textContent = message;
          customAlert.style.display = "flex";
        };

        showCustomAlert("Feedback submitted successfully!");
        form.reset();
        wordCountDisplay.textContent = 'Word count: 0'; // Reset word count
      } catch (error) {
        console.error("Error submitting feedback: ", error);
        showCustomAlert("Failed to submit feedback. Please try again.");
      }
    });
  } else {
    console.error("Form not found!");
  }
});