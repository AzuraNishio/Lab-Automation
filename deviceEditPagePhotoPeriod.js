import {
    collection,
    getDocs,
    onSnapshot,
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import { db } from "./firebase.js";

const params = new URLSearchParams(window.location.search);
const deviceId = params.get("id");
const docRef = doc(db, "devices", deviceId);

const deviceName = document.getElementById("deviceName");
const stateIndicator = document.getElementById("state");
const startTime = document.getElementById("date");
const toggleButton = document.getElementById("toggle");
const rotine = document.getElementById("rotina");
const modal = document.getElementById("addToggleModal");
const cancelModal = document.getElementById("cancelToggle");
const createModal = document.getElementById("createToggle");
const dayStartInput = document.getElementById("dayStart");
const hourStartInput = document.getElementById("hourStart");
const minuteStartInput = document.getElementById("minuteStart");

const repeatInput = document.getElementById("repeat");

const hoursInput = document.getElementById("hours");
const minsInput = document.getElementById("mins");


createModal.addEventListener("click", async ()=> {
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) return;

    const data = snapshot.data();

    const dayStart = Number(dayStartInput.value);
    const hourStart = Number(hourStartInput.value);
    const minuteStart = Number(minuteStartInput.value);

    const repeat = Number(repeatInput.value);

    const hours = Number(hoursInput.value);
    const minutes = Number(minsInput.value);


    const newToggles = [...data.toggles];
    for (let offset = 0; offset < repeat; offset++) {
        var hour = hourStart;
        hour += (dayStart - 1) * 24 
        hour += offset * 24 
        hour += minuteStart / 60
        newToggles.push(hour);
        newToggles.push(hour + hours + minutes / 60);
    }


    await updateDoc(docRef, {
        toggles:  newToggles
    });

    modal.classList.add("hidden")
})




cancelModal.addEventListener("click", () => {
    modal.classList.add("hidden")
})


function formatDurationDayOrdinal(seconds) {
    const days = Math.floor(seconds / 86400);
    seconds %= 86400;

    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;

    const minutes = Math.floor(seconds / 60);
    seconds %= 60;

    const parts = [];

    parts.push(`${days + 1}º dia, `);
    parts.push(`${hours}h`);
    parts.push(`${minutes.toString().padStart(2, "0")}`);

    return parts.join("");
}

function formatDurationHoursMinutes(seconds) {
    const days = Math.floor(seconds / 86400);
    seconds %= 86400;

    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;

    const minutes = Math.floor(seconds / 60);
    seconds %= 60;

    const parts = [];

    if (days) parts.push(`${days + 1}º dia, `);
    parts.push(`${hours} hora${hours !== 1 ? "s" : ""}`);
    if (minutes) parts.push(` e ${minutes} minuto${minutes !== 1 ? "s" : ""}`);

    return parts.join("");
}


onSnapshot(docRef, (snapshot) => {
    if (!snapshot.exists()) return;

    const data = snapshot.data();

    rotine.innerHTML = ""
    const titleDiv = document.createElement("div");
    titleDiv.classList.add("photoCicleStepDiv");

    const title = document.createElement("h1");
    title.className = "dateDurationText";
    title.textContent = "Fotoperíodo programado:";

    const addToggle = document.createElement("button");
    addToggle.textContent = "adicionar"
    addToggle.className = "tinyButton"
    addToggle.addEventListener("click", () => {
        modal.classList.remove("hidden")
    })



    title.className = "dateDurationText";
    title.textContent = "Fotoperíodo programado:";
    titleDiv.appendChild(title);
    titleDiv.appendChild(addToggle);

    rotine.appendChild(titleDiv);

    const separator = document.createElement("hr");

    rotine.append(separator);

    var toggle = false
    var lastDate = 0
    const nowSecondsDif = Math.floor(Date.now() / 1000) - data.experimentStartDate;
    const nowHoursDif = nowSecondsDif / 60 / 60

    for (const date of data.toggles.sort((a, b) => a - b)) {

        if (toggle){
            const text = document.createElement("p");
            text.className = "dateDurationText"
            text.textContent = 
            `${formatDurationDayOrdinal(lastDate * 60 * 60)}: Acenda a luz por ${formatDurationHoursMinutes(60 * 60 * (date - lastDate))}`
            
            const remove = document.createElement("button");
            remove.className = "tinyButton"
            remove.textContent = "remover"
            
            remove.addEventListener("click", async () => {
                const newToggles = data.toggles.filter(t => (t !== date && t !== lastDate));
                await updateDoc(docRef, {
                        toggles:  newToggles
                    });
            })
            
            const step = document.createElement("div");
            step.classList.add("photoCicleStepDiv")

            if(data.runningExperiment){
                if(lastDate < nowHoursDif){
                    if(date < nowHoursDif){
                        step.classList.add("photoCicleStepDivDone")
                    } else {
                        step.classList.add("photoCicleStepDivActive")
                    }
                }
            }      
        
            step.appendChild(text)
            step.appendChild(remove)
        rotine.appendChild(step)
        } else {
            lastDate = date;
        }
        toggle = !toggle
    }


    deviceName.textContent = deviceId;

    stateIndicator.textContent = data.runningExperiment
        ? "Experimento em andamento"
        : "Experimento inativo";


    startTime.textContent = data.runningExperiment
        ? new Date(data.experimentStartDate * 1000).toLocaleString("pt-BR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        }) : " -";

    toggleButton.textContent = data.runningExperiment
        ? "Interromper"
        : "Iniciar";
});

toggleButton.addEventListener("click", async () => {
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) return;

    const data = snapshot.data();

    const now = new Date();

    const midnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    );

    const unixMidnight = Math.floor(midnight.getTime() / 1000);

    await updateDoc(docRef, {
        runningExperiment:  !data.runningExperiment,
        experimentStartDate: unixMidnight
    });
});