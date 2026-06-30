import {
    collection,
    getDocs,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import { db } from "./firebase.js";

const params = new URLSearchParams(window.location.search);
const deviceId = params.get("id");

const deviceName = document.getElementById("deviceName");

deviceName.textContent = deviceId