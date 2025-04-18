import { skillFunctionality } from "./skills.js";
import { topNav } from "./topnav.js";
import { animation } from "./animation.js";

// Initialize imported modules
topNav();
skillFunctionality();
animation();

// Add copyright dynamically
const copyright = `&copy;${new Date().getFullYear()} BONFIRE. All rights reserved`;
document.querySelector('footer p').innerHTML = copyright;

// Utility function: debounce
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
      width: 320px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 1rem;
      color: #333;
    }

    #alertMessage {
      color: black;  
      margin-bottom: 15px;
    }

    .btn {
      background-color:rgb(151, 155, 160);  
      color: white;
      border: none;
      padding: 10px 20px;
      cursor: pointer;
      border-radius: 5px;
      font-weight: 600;
      transition: background-color 0.3s ease;
    }

    .btn:hover {
      background-color:rgb(255, 2, 2);  
    }

    .word-warning,
    .name-error,
    .email-error {
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

    /* Modern input validation styles */
    input.valid, textarea.valid {
      border: 2px solid #4CAF50; /* Green */
      background-color: #e8f5e9;
    }

    input.invalid, textarea.invalid {
      border: 2px solid #f44336; /* Red */
      background-color: #ffebee;
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

  // Show modal alert function
  const showModalAlert = (message) => {
    const alertMessage = document.querySelector("#alertMessage");
    alertMessage.textContent = message;
    customAlert.style.display = "flex";
  };

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

    const emailError = document.createElement('p');
    emailError.className = 'email-error';
    emailInput.parentNode.appendChild(emailError);

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

// Modernized name validation
const validateName = () => {
  const name = nameInput.value.trim();
  const maxLength = 50;
  const minLength = 3;
  // Allow letters, spaces, hyphens, apostrophes
  const nameRegex = /^[a-zA-Z]+([ '-][a-zA-Z]+)*$/;
  const repeatedPatternRegex = /^(.)\1{2,}$/;  // Prevent repeated characters (e.g., "aaaa")
  
  if (name.length < minLength) {
    nameError.textContent = `Name must be at least ${minLength} characters.`;
    nameError.style.display = "block";
    nameInput.classList.add('invalid');
    nameInput.classList.remove('valid');
    return false;
  }
  if (name.length > maxLength) {
    nameError.textContent = `Name cannot exceed ${maxLength} characters.`;
    nameError.style.display = "block";
    nameInput.classList.add('invalid');
    nameInput.classList.remove('valid');
    return false;
  }
  if (!nameRegex.test(name)) {
    nameError.textContent = "Name can only contain letters, spaces, hyphens, and apostrophes.";
    nameError.style.display = "block";
    nameInput.classList.add('invalid');
    nameInput.classList.remove('valid');
    return false;
  }
  if (repeatedPatternRegex.test(name)) {
    nameError.textContent = "Name cannot contain repeated characters.";
    nameError.style.display = "block";
    nameInput.classList.add('invalid');
    nameInput.classList.remove('valid');
    return false;
  }
  if (suspiciousNames.includes(name.toLowerCase())) {
    nameError.textContent = "Suspicious name detected. Please use a valid name.";
    nameError.style.display = "block";
    nameInput.classList.add('invalid');
    nameInput.classList.remove('valid');
    return false;
  }
  // Capitalize each word
  const capitalizeName = name.replace(/\b\w/g, char => char.toUpperCase());
  nameInput.value = capitalizeName;

  nameError.style.display = "none";
  nameInput.classList.remove('invalid');
  nameInput.classList.add('valid');
  return true;
};

// Email validation
const validateEmail = () => {
  const email = emailInput.value.trim();
  // Basic email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    emailError.textContent = "Please enter a valid email address.";
    emailError.style.display = "block";
    emailInput.classList.add('invalid');
    emailInput.classList.remove('valid');
    return false;
  }

  emailError.style.display = "none";
  emailInput.classList.remove('invalid');
  emailInput.classList.add('valid');
  return true;
};

    // Word count validation
    const updateWordCount = () => {
      const wordCount = messageInput.value.trim().split(/\s+/).filter(word => word).length;
      wordCountDisplay.textContent = `Word count: ${wordCount}`;

      if (wordCount < 10) {
        wordWarning.textContent = "Feedback must be at least 10 words.";
        wordWarning.style.display = "block";
        messageInput.classList.add('invalid');
        messageInput.classList.remove('valid');
        return false;
      } else if (wordCount > 500) {
        wordWarning.textContent = "Feedback cannot exceed 500 words.";
        wordWarning.style.display = "block";
        messageInput.classList.add('invalid');
        messageInput.classList.remove('valid');
        return false;
      }

      wordWarning.style.display = "none";
      messageInput.classList.remove('invalid');
      messageInput.classList.add('valid');
      return true;
    };

    // Attach event listeners with debounce for better UX
    let debounceTimer;
    nameInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(validateName, 300);
    });
    emailInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(validateEmail, 300);
    });
    messageInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(updateWordCount, 300);
    });

    // Form submit event
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Validate inputs before submission
      const isNameValid = validateName();
      const isEmailValid = validateEmail();
      const isMessageValid = updateWordCount();
      if (!isNameValid || !isEmailValid || !isMessageValid) {
        showModalAlert("Please input all fields correctly.");
        return;
      }

      // Prepare form data
      const formData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        message: messageInput.value.trim(),
        access_key: "86e63595-8335-4c19-89e4-8d9f3dcdaa94"
      };

      // Show loading message
      showModalAlert("Sending message...");

      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
          showModalAlert("Message sent successfully!");
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          showModalAlert("Failed to send message. Please try again later.");
        }
      } catch (error) {
        showModalAlert("An error occurred. Please try again later.");
        console.error("Error sending form:", error);
      }
    });
  } else {
    console.error("Form not found!");
  }
});
