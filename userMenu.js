import { auth } from "./firebase.js";
import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const avatar = document.getElementById("userAvatar");
const dropdown = document.getElementById("dropdown");
const emailText = document.getElementById("userEmail");
const logoutBtn = document.getElementById("logoutBtn");

avatar.addEventListener("click", () => {
    dropdown.classList.toggle("hidden");
});

document.addEventListener("click", (e) => {
    if (!e.target.closest(".userMenu")) {
        dropdown.classList.add("hidden");
    }
});

onAuthStateChanged(auth, (user) => {
    if (!user) return;

    emailText.textContent = user.email;

    avatar.src =
        user.photoURL ||
        `https://api.dicebear.com/7.x/identicon/svg?seed=${user.email}`;
});

logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "index.html";
});