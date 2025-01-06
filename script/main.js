import { skillFunctionality } from "./skills.js";
import { topNav } from "./topnav.js";
import { animation } from "./animation.js";


topNav();
skillFunctionality();
animation();


const copyright = `&copy;${new Date().getFullYear()} BONFIRE. All rights reserved`;
document.querySelector('footer p').innerHTML = copyright;


//FIREBASE SETUP WITH CSS STYLE
import { db, collection, addDoc, viewDocRef, getDoc, updateDoc } from './firebase.js';

document.addEventListener("DOMContentLoaded", async () => {
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

  // Create modal structure dynamically
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

  // Get form elements
  const form = document.querySelector("#contactForm");

  if (form) {
    const nameInput = form.querySelector('#name');
    const emailInput = form.querySelector('#email');
    const messageInput = form.querySelector('#message');

    // Add a word limit warning message
    const wordWarning = document.createElement('p');
    wordWarning.className = 'word-warning';
    wordWarning.textContent = 'Feedback must be between 5 and 10 words.';
    messageInput.parentNode.appendChild(wordWarning);

    // Get modal elements
    const alertMessage = document.querySelector("#alertMessage");
    const closeAlert = document.querySelector("#closeAlert");

    // Function to display the custom alert
    const showCustomAlert = (message) => {
      alertMessage.textContent = message;
      customAlert.style.display = "flex";
    };

    // Close the custom alert when the close button is clicked
    closeAlert.addEventListener("click", () => {
      customAlert.style.display = "none";
    });

    // Handle word count validation
    const validateWordCount = () => {
      const wordCount = messageInput.value.trim().split(/\s+/).filter(word => word).length;
      if (wordCount < 5 || wordCount > 10) {
        wordWarning.style.display = 'block';
        return false;
      } else {
        wordWarning.style.display = 'none';
        return true;
      }
    };

    // Add input event listener to check word count
    messageInput.addEventListener('input', validateWordCount);

    // Handle form submission
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!validateWordCount()) {
        showCustomAlert("Feedback must be between 5 and 10 words.");
        return;
      }

      const clientData = {
        name: nameInput.value,
        email: emailInput.value,
        message: messageInput.value,
        timestamp: new Date(),
      };

      try {
        // Track page view count in Firestore
        try {
          const viewSnapshot = await getDoc(viewDocRef);
          if (viewSnapshot.exists()) {
            const currentCount = viewSnapshot.data().count || 0;
            await updateDoc(viewDocRef, {
              count: currentCount + 1
            });
          } else {
            await setDoc(viewDocRef, { count: 1 });
          }
        } catch (error) {
          console.error("Error tracking views: ", error);
        }

        // Add client feedback to Firestore
        await addDoc(collection(db, "clientFeedback"), clientData);
        showCustomAlert("Thank you sa feedback kupal.");
        form.reset();
      } catch (error) {
        console.error("Error submitting feedback. Hays bug na naman.", error);
        showCustomAlert("Failed to submit feedback. Ayusin mo! ");
      }
    });
  } else {
    console.error('Form not found!');
  }
});