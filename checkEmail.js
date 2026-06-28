import { auth } from "./firebase.js";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendEmailVerification
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const button = document.querySelector(".login_confirm_button");

const checkEmail = document.getElementById("checkEmail");

setInterval(async () => {
    if (!auth.currentUser) return;

    await auth.currentUser.reload();

    if (auth.currentUser.emailVerified) {
        window.location.href = "dashboard.html";
    }
}, 1000);

checkEmail.addEventListener("click", async (event) => {
    event.preventDefault();

    await auth.currentUser.reload();

    if (auth.currentUser.emailVerified) {
        window.location.href = "dashboard.html";
    } else {
        alert("Seu email ainda não foi verificado.");
    }
});