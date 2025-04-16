import { auth, db } from "./firebaseConfig.js";
import { createUserWithEmailAndPassword, getAuth, signOut, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";


// login, regist 
const registerForm = document.querySelector(".register-form");
const loginForm = document.querySelector(".login-form");

if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const firstName = e.target.firstName.value;
        const lastName = e.target.lastName.value;
        const email = e.target.email.value;
        const phone = e.target.phone.value;
        const password = e.target.password.value;
        const confirmPassword = e.target.confirmPassword.value;

        if (password === confirmPassword) {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed up
                    const user = userCredential.user;
                    set(ref(db, 'users/' + user.uid), {
                        username: firstName + " " + lastName,
                        email: email,
                        phone: phone
                    })
                        .then(() => {
                            console.log("User data saved successfully.");
                            window.location.href = "index.html";
                        })
                        .catch((error) => {
                            console.error("Error saving user data:", error);
                        });
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.error("Error during registration:", errorCode, errorMessage);
                });
        } else {
            console.error("Passwords do not match.");
        }
    });
}
if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                // ...
                window.location.href = "index.html";
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
    })
}
// end login, regist 
