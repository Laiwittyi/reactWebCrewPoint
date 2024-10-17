// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCAjIaD8z1ZPJnueARU4VHiRPBcZ70TiI0",
    authDomain: "crew-point-login.firebaseapp.com",
    projectId: "crew-point-login",
    storageBucket: "crew-point-login.appspot.com",
    messagingSenderId: "757876416427",
    appId: "1:757876416427:web:b76550b18a450179c5fcee",
    measurementId: "G-E6XMX53YV7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);