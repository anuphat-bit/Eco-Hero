// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyACtr3uehe2o5HDAIVDsUiVvfek3bmFcKI",
  authDomain: "eco-hero-ad9ee.firebaseapp.com",
  projectId: "eco-hero-ad9ee",
  storageBucket: "eco-hero-ad9ee.firebasestorage.app",
  messagingSenderId: "169080356701",
  appId: "1:169080356701:web:c9039183286e4026f572b4",
  measurementId: "G-G2Z8RKMKDR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
