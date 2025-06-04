
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCjFLFXvS2k7V7LZfPtnPqdklJNdrTsA5E",
  authDomain: "aitechs-push-notifications.firebaseapp.com",
  projectId: "aitechs-push-notifications",
  storageBucket: "aitechs-push-notifications.firebasestorage.app",
  messagingSenderId: "1078944936992",
  appId: "1:1078944936992:web:09d408e0144461afa4b845",
  measurementId: "G-GVY08EQ6KX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
// autocomplete=”webauthn”
export { messaging, getToken, onMessage };


















