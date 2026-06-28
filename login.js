import { auth } from "./firebase.js";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const provider = new GoogleAuthProvider();

const button = document.querySelector(".login_confirm_button");
const email = document.getElementById("username");
const password = document.getElementById("password");
const googleButton = document.getElementById("googleLoginButton");

googleButton.addEventListener("click", async (event) => {
    event.preventDefault();

    try {
        const result = await signInWithPopup(auth, provider);

        console.log("Logged in as:", result.user.displayName);

        window.location.href = "dashboard.html";
    } catch (err) {
        alert(err.message);
    }
});


email.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        password.focus();
    }
});

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
        const credential = await createUserWithEmailAndPassword(
            auth,
            email.value,
            password.value
        );

        await sendEmailVerification(credential.user);
        
        window.location.href = "checkYourEmail.html";

    } catch (err) {
        try {
            const credential = await signInWithEmailAndPassword(
                auth,
                email.value,
                password.value
            );

            await credential.user.reload();

            if (!credential.user.emailVerified) {
                window.location.href = "checkYourEmail.html";
                return;
            }

            window.location.href = "dashboard.html";
        } catch (err) {
            alert(err.message);
        }
    }
});