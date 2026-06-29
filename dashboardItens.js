import { auth } from "./firebase.js";
import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


const items = [
    "Reactor Control",
    "Temperature Sensor",
    "Pressure Valve",
    "Emergency Shutdown"
];

const container = document.getElementById("container");

items.forEach(item => {
    const h1 = document.createElement("h1");
    h1.textContent = item;
    container.appendChild(h1);
});