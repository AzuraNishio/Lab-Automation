import {
    collection,
    getDocs,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import { db } from "./firebase.js";

const container = document.getElementById("container");
const querySnapshot = await getDocs(collection(db, "devices"));



onSnapshot(collection(db, "devices"), (snapshot) => {
    const nowSeconds = Math.floor(Date.now() / 1000);
    container.innerHTML = "";

    snapshot.forEach((doc) => {
        const data = doc.data();

        const deviceDiv = document.createElement("div");
        deviceDiv.className = "deviceDiv";

        // Device name
        const title = document.createElement("h2");
        title.textContent = doc.id;

        data.startDate
        const diff  = nowSeconds - data.experimentStartDate;
        const days  = Math.floor(diff / (60 * 60 * 24));
        const hours = Math.floor(diff / (60 * 60)) % 24;

        // Status
        const status = document.createElement("p");
        status.textContent = data.runningExperiment
            ? "🟢 Experimento em andamento por " + days + " dias e " + hours + " horas!"
            : "⚪ Experimento inativo";

        // Button
        const button = document.createElement("button");
        button.textContent = "Editar";
        

        button.addEventListener("click", () => {
            console.log("Clicked device:", doc.id);
            window.location.href = `dashboardEditDevice.html?id=${encodeURIComponent(doc.id)}`;
        });

        deviceDiv.appendChild(title);
        deviceDiv.appendChild(status);
        deviceDiv.appendChild(button);

        container.appendChild(deviceDiv);
    });
});