import {
    collection,
    getDocs,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import { db } from "./firebase.js";

const container = document.getElementById("container");
const querySnapshot = await getDocs(collection(db, "devices"));



onSnapshot(collection(db, "devices"), (snapshot) => {

    container.innerHTML = ""; // clear old UI

    snapshot.forEach((doc) => {
        const data = doc.data();

        const deviceDiv = document.createElement("div");
        deviceDiv.className = "deviceDiv";
        deviceDiv.textContent = doc.id;

        container.appendChild(deviceDiv);
    });
});