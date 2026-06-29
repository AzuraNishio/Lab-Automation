import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

onAuthStateChanged(auth, async (user) => {
    if (!auth.currentUser){
        window.location.href = "index.html";
    } else {
        if (!auth.currentUser.emailVerified) {
            window.location.href = "checkYourEmail.html";
        }
    }
});