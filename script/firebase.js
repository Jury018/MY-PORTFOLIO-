import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore, collection, addDoc, doc, getDoc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Your Firebase configuration
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
const db = getFirestore(app);


const viewDocRef = doc(db, "view", "viewCount");

export { db, viewDocRef, collection, addDoc, doc, getDoc, updateDoc, setDoc };