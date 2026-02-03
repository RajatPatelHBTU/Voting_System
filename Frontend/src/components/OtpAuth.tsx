// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyBDJgbD0wPKmdDwtmxfV0-r_O3tqEmgFp4",
  authDomain: "electcode-615de.firebaseapp.com",
  projectId: "electcode-615de",
  storageBucket: "electcode-615de.firebasestorage.app",
  messagingSenderId: "371973047241",
  appId: "1:371973047241:web:29a7fb06355c4d26c49e18",
  measurementId: "G-FDL59WLQDE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, RecaptchaVerifier, signInWithPhoneNumber };