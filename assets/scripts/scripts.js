import { auth, db } from "./firebaseConfig.js";
import { createUserWithEmailAndPassword, getAuth, signOut, signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { ref, set, onValue, push } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";


const registerForm = document.querySelector(".register-form");
const loginForm = document.querySelector(".login-form");
const authLink = document.querySelector("#auth-link");
const newsletterForm = document.querySelector(".newsletter-form");
let userId = null;
const paymentForm = document.querySelector(".payment-form");
const forgetForm = document.querySelector(".forget-form");

// login, regist 
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
                        phone: phone,
                        membership: false
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

// auth state change 
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        const uid = user.uid;
        userId = uid;
        authLink.textContent = "Logout";
        authLink.href = "#"
        authLink.addEventListener("click", () => {
            const auth = getAuth();
            signOut(auth).then(() => {
                // Sign-out successful.

                // Show success alert

                const logoutAlert = document.createElement("div");
                logoutAlert.className = "alert alert-success";
                logoutAlert.role = "alert";
                logoutAlert.textContent = "You have successfully logged out!";
                document.body.prepend(logoutAlert);

                setTimeout(() => {
                    logoutAlert.remove();
                }, 1000);



            }).catch((error) => {
                // An error happened.
            });
        })

    } else {
        // User is signed out
        // ...
        authLink.textContent = "Login";
        authLink.href = "login.html"
    }
});
// end auth state change 


// select payment
if (paymentForm) {
    paymentForm.querySelectorAll(".pay-month, .pay-year").forEach((element) => {
        element.addEventListener("click", () => {
            // Check if the clicked element is pay-month
            if (element.classList.contains("pay-month")) {
                // Add 'selected-payment' class to pay-month and remove it from pay-year
                document.querySelector(".pay-month").classList.add("selected");
                document.querySelector(".pay-year").classList.remove("selected");
            } else if (element.classList.contains("pay-year")) {
                // Add 'selected-payment' class to pay-year and remove it from pay-month
                document.querySelector(".pay-year").classList.add("selected");
                document.querySelector(".pay-month").classList.remove("selected");
            }
        });
    });
}
// end select payment

// reset password 
if (forgetForm) {

    let emailFound = false;

    forgetForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        sendPasswordResetEmail(auth, email)
            .then(() => {
                // Password reset email sent!
                // ..

                // checking email 
                const userRef = ref(db, 'users/');
                onValue(userRef, (snapshot) => {
                    const data = snapshot.val();
                    for (let key in data) {
                        const user = data[key];

                        // if found email 
                        if (user.email === email) {
                            const resetAlert = document.createElement("div");
                            resetAlert.className = "alert alert-success";
                            resetAlert.role = "alert";
                            resetAlert.textContent = "Check your email to change password!";
                            document.body.prepend(resetAlert);
                            setTimeout(() => {
                                resetAlert.remove();
                            }, 1000);
                            emailFound = true;
                            break;
                        }
                    }
                    // if email not found 
                    if (!emailFound) {
                        const resetAlert = document.createElement("div");
                        resetAlert.className = "alert alert-danger";
                        resetAlert.role = "alert";
                        resetAlert.textContent = "Incorrect Email!";
                        document.body.prepend(resetAlert);
                        setTimeout(() => {
                            resetAlert.remove();
                        }, 1000);
                    }
                });

            })
            .catch((error) => {

                const errorCode = error.code;
                const errorMessage = error.message;
                // ..
            });
    })
}
// end reset password



/// subcribe newsletter 
if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = e.target.email.value.trim();

        // validation email
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        

        // Check email used
        const subscribersRef = ref(db, 'subcriber');
        onValue(subscribersRef, (snapshot) => {
            const data = snapshot.val();
            let emailExists = false;

            if (data) {
                for (let key in data) {
                    if (data[key].email === email) {
                        emailExists = true;
                        break;
                    }
                }
            }

            if (emailExists) {
                const errorAlert = document.createElement("div");
                errorAlert.className = "alert alert-danger";
                errorAlert.role = "alert";
                errorAlert.textContent = "This email is already subscribed to our newsletter!";
                errorAlert.style.position = "fixed";
                errorAlert.style.top = "0";
                errorAlert.style.left = "0";
                errorAlert.style.width = "100%";
                errorAlert.style.zIndex = "9999";

                document.body.prepend(errorAlert);

                setTimeout(() => {
                    errorAlert.remove();
                }, 2000);
                return;
            } else {
                const newSubcriberRef = push(ref(db, 'subcriber'));

                set(newSubcriberRef, {
                    email: email,
                })
                    .then(() => {
                        const successAlert = document.createElement("div");
                        successAlert.className = "alert alert-success";
                        successAlert.role = "alert";
                        successAlert.textContent = "Thank you for subscribing. We will send you the latest updates";
                        successAlert.style.position = "fixed";
                        successAlert.style.top = "0";
                        successAlert.style.left = "0";
                        successAlert.style.width = "100%";
                        successAlert.style.zIndex = "9999";

                        document.body.prepend(successAlert);

                        e.target.reset();

                        setTimeout(() => {
                            successAlert.remove();
                        }, 2000);
                    })
                    .catch((error) => {
                        const errorAlert = document.createElement("div");
                        errorAlert.className = "alert alert-danger";
                        errorAlert.role = "alert";
                        errorAlert.textContent = "An error occurred. Please try again later";
                        errorAlert.style.position = "fixed";
                        errorAlert.style.top = "0";
                        errorAlert.style.left = "0";
                        errorAlert.style.width = "100%";
                        errorAlert.style.zIndex = "9999";
        
                        document.body.prepend(errorAlert);
        
                        setTimeout(() => {
                            errorAlert.remove();
                        }, 2000);
                    });
            }
        }, {
            onlyOnce: true
        });
    });
}
// end subcribe newsletter 
