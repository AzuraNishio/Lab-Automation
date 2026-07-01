import {
    collection,
    getDocs,
    onSnapshot,
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import { db } from "./firebase.js";

const addDeviceButton = document.getElementById("addDeviceButton");
const addDeviceCancelButton = document.getElementById("cancelDevice");
const createDeviceButton = document.getElementById("createDevice");
const addDeviceModal = document.getElementById("addDeviceModal");
const deviceName = document.getElementById("deviceName")
const deviceType = document.getElementById("deviceType")

addDeviceModal.classList.add("hidden");

addDeviceButton.addEventListener("click", () => {
    addDeviceModal.classList.remove("hidden");
});

addDeviceCancelButton.addEventListener("click", () => {
    addDeviceModal.classList.add("hidden");
});

createDeviceButton.addEventListener("click", async () => {
    await setDoc(
        doc(db, "devices", deviceName.value),
        {
            runningExperiment: false,
            experimentStartDate: 0,
            experimentType: deviceType.value,
        }
    );
    addDeviceModal.classList.add("hidden");

})