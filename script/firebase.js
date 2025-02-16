import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { 
  getFirestore, collection, addDoc, getDoc, updateDoc, setDoc, doc 
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJvk0qhwZmLCpwKOhn1lWw1F3DHDucqF8",
  authDomain: "new-portfolio-9c126.firebaseapp.com",
  databaseURL: "https://new-portfolio-9c126-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "new-portfolio-9c126",
  storageBucket: "new-portfolio-9c126.appspot.com",
  messagingSenderId: "213335134410",
  appId: "1:213335134410:web:3704a6aeb8634781962433",
  measurementId: "G-4DF86P5TYK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Function to track profile views
async function trackProfileView() {
  const userAgent = navigator.userAgent;
  const referrer = document.referrer || "Direct";

  try {
    // Log event to Firebase Analytics
    logEvent(analytics, 'profile_view', { referrer, userAgent });

    // Save to Firestore
    await addDoc(collection(db, "profile_views"), {
      timestamp: new Date().toISOString(),
      userAgent: userAgent,
      referrer: referrer
    });

    console.log("Profile view recorded.");
  } catch (error) {
    console.error("Error recording profile view: ", error);
  }
}

// Export necessary functions
export { db, collection, addDoc, getDoc, updateDoc, setDoc, doc, trackProfileView };