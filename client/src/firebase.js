// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB6DluZ3E3MoOLRZ_8gorAEuhroJlVzrU0",
  authDomain: "travel-log-cefee.firebaseapp.com",
  projectId: "travel-log-cefee",
  storageBucket: "travel-log-cefee.firebasestorage.app",
  messagingSenderId: "226385690885",
  appId: "1:226385690885:web:fc8fef3a2c44f2ad58376c",
  measurementId: "G-FXLMJV7Z3E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app); // getAuth is a function that returns an auth object
export default app; // ^^ is how we get Auth instance, basically how we begin using firebase abilities