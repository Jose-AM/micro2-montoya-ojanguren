// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB42V5mzK2fTVY3unU3lc3b-GlbhYYiito",
  authDomain: "micro2-montoya-ojanguren.firebaseapp.com",
  projectId: "micro2-montoya-ojanguren",
  storageBucket: "micro2-montoya-ojanguren.appspot.com",
  messagingSenderId: "241928254275",
  appId: "1:241928254275:web:b115cbd65be888977175f6",
  measurementId: "G-S0CSMLGMDQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;
