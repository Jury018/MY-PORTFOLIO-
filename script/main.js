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

//MAINTENANCE MECHANISM 
  fetch('maintenance.txt')
    .then(response => {
      if (response.ok) {
        // Redirect to the custom 404 page if maintenance.txt exists
        window.location.href = '/404.html';
      }
    })
    .catch(error => {
      // Ignore errors if the file is not found
    });

    
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

    .word-warning,
    .name-error {
      color: red;
      font-size: 0.9em;
      margin-top: 5px;
      display: none;
    }

    #wordCountDisplay {
      color: gray;
      font-size: 0.9em;
      margin-top: 5px;
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

    // Error message elements
    const nameError = document.createElement('p');
    nameError.className = 'name-error';
    nameInput.parentNode.appendChild(nameError);

    const wordWarning = document.createElement('p');
    wordWarning.className = 'word-warning';
    messageInput.parentNode.appendChild(wordWarning);

    const wordCountDisplay = document.createElement('p');
    wordCountDisplay.id = 'wordCountDisplay';
    messageInput.parentNode.appendChild(wordCountDisplay);

   // Suspicious names for monitoring
const suspiciousNames = [
  "admin", "administrator", "root", "system", 
  "test", "tester", "testing", "example", 
  "unknown", "anonymous", "user", "guest", 
  "null", "undefined", "none", "empty", 
  "default", "new", "demo", "sample", 
  "account", "bot", "robot", "spam", 
  "temp", "temporary", "invalid", "fake", 
  "crush", "handsome", "abcdef", "abc", 
  "qwerty", "asdf", "guest123", "guestuser", 
  "firstname", "lastname", "name", "xyz", 
  "testaccount", "random", "admin123", 
  "nobody", "someone", "anyone", 
  "tite", "server", "operator", 
  "owner", "superuser", "manager", 
  "developer", "developer123", "secret", 
  "friend", "test123", "pogi"
];

// Validate name input
const validateName = () => {
  const name = nameInput.value.trim();
  const maxLength = 50;
  const minLength = 3;  // Ensure name is at least 3 characters
  const nameRegex = /^[a-zA-Z\s]+$/;  // Only letters and spaces
  const repeatedPatternRegex = /^(.)\1{2,}$/;  // Prevent repeated characters (e.g., "aaaa")
  const numberSequenceRegex = /\d+/;  // Disallow numbers

  // Check for leading/trailing spaces
  if (name !== name.trim()) {
    nameError.textContent = "Name cannot have leading or trailing spaces.";
    nameError.style.display = "block";
    return false;
  }

  // Check if name contains only letters and spaces
  if (!nameRegex.test(name)) {
    nameError.textContent = "Name can only contain letters and spaces.";
    nameError.style.display = "block";
    return false;
  }

  // Check for length
  if (name.length > maxLength) {
    nameError.textContent = `Name cannot exceed ${maxLength} characters.`;
    nameError.style.display = "block";
    return false;
  } else if (name.length < minLength) {
    nameError.textContent = `Name must be at least ${minLength} characters.`;
    nameError.style.display = "block";
    return false;
  }

  // Check for suspicious names
  if (suspiciousNames.includes(name.toLowerCase())) {
    nameError.textContent = "Suspicious name detected. Please use a valid name.";
    nameError.style.display = "block";
    return false;
  }

  // Check for repeated characters (e.g., "aaaa", "bbbb")
  if (repeatedPatternRegex.test(name)) {
    nameError.textContent = "Name cannot contain repeated characters.";
    nameError.style.display = "block";
    return false;
  }

  // Check for numbers in name
  if (numberSequenceRegex.test(name)) {
    nameError.textContent = "Name cannot contain numbers.";
    nameError.style.display = "block";
    return false;
  }

  // Capitalize name to ensure proper format (optional)
  const capitalizeName = name.replace(/\b\w/g, char => char.toUpperCase());
  nameInput.value = capitalizeName;

  nameError.style.display = "none";
  return true;
};

    // Word count validation
    const updateWordCount = () => {
      const wordCount = messageInput.value.trim().split(/\s+/).filter(word => word).length;
      wordCountDisplay.textContent = `Word count: ${wordCount}`;

      if (wordCount < 10) {
        wordWarning.textContent = "Feedback must be at least 10 words.";
        wordWarning.style.display = "block";
        return false;
      } else if (wordCount > 500) {
        wordWarning.textContent = "Feedback cannot exceed 500 words.";
        wordWarning.style.display = "block";
        return false;
      }

      wordWarning.style.display = "none";
      return true;
    };

    // Attach event listeners
    nameInput.addEventListener('input', validateName);
    messageInput.addEventListener('input', updateWordCount);

    // Form submit event
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Validate inputs
      if (!validateName() || !updateWordCount()) {
        return;
      }

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