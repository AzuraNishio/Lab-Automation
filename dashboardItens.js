import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { db } from "./firebase.js";

const container = document.getElementById("container");

onSnapshot(collection(db, "devices"), (snapshot) => {

    container.innerHTML = ""; // clear old UI

    snapshot.forEach((doc) => {
        const data = doc.data();

        const h1 = document.createElement("h1");
        h1.textContent = data.name;

        container.appendChild(h1);
    });
});