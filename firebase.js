// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB8PSJOsuuAX52wv7sHv_ehEaN2YjF7iGc",
  authDomain: "usplabquimicaautomation.firebaseapp.com",
  projectId: "usplabquimicaautomation",
  storageBucket: "usplabquimicaautomation.firebasestorage.app",
  messagingSenderId: "421109997164",
  appId: "1:421109997164:web:968039d3d6291090d08249",
  measurementId: "G-QJYXH8536Q"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

