import { auth, db } from './firebase.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

document.getElementById("login-btn").addEventListener("click", loginUser);

function loginUser() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Validate input fields
    if (!email || !password) {
        alert("Please fill in both email and password fields.");
        return;
    }

    // Sign in the user with email and password
    signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            const user = userCredential.user;

            // Fetch the user data from Firestore to get the role
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const role = userData.role; // Get the role from Firestore
                
                // Redirect user based on their role
                if (role === "admin") {
                    window.location.href = "admindashboard.html"; // Redirect to Admin Dashboard
                } else if (role === "student") {
                    window.location.href = "resource.html"; // Redirect to Student Dashboard
                } else {
                    alert("User role not found. Please contact support.");
                }
            } else {
                alert("User data not found.");
            }
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(`Login failed: ${errorMessage}`);
        });
}

