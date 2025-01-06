<script type="module"
  // Import the functions you need from the SDKs
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
  import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBJvk0qhwZmLCpwKOhn1lWw1F3DHDucqF8",
    authDomain: "new-portfolio-9c126.firebaseapp.com",
    databaseURL: "https://new-portfolio-9c126-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "new-portfolio-9c126",
    storageBucket: "new-portfolio-9c126.firebasestorage.app",
    messagingSenderId: "213335134410",
    appId: "1:213335134410:web:3704a6aeb8634781962433",
    measurementId: "G-4DF86P5TYK"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const db = getFirestore(app); // Firestore initialization

  // Get form elements
  const form = document.querySelector("#contactForm");
  const nameInput = form.querySelector('#name');
  const emailInput = form.querySelector('#email');
  const messageInput = form.querySelector('#message');

  // Add form submission listener
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent default form submission

    const clientData = {
      name: nameInput.value,
      email: emailInput.value,
      message: messageInput.value,
      timestamp: new Date(), // Optional: Add timestamp
    };

    try {
      // Add client feedback to Firestore
      await addDoc(collection(db, "clientFeedback"), clientData);
      alert("Feedback submitted successfully!");
      form.reset(); // Reset form fields
    } catch (error) {
      console.error("Error submitting feedback: ", error);
      alert("Failed to submit feedback. Please try again.");
    }
  });
</script>