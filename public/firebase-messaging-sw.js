


// firebase-messaging-sw.js

// Import the Firebase libraries from the CDN
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js");




// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyCjFLFXvS2k7V7LZfPtnPqdklJNdrTsA5E",
  authDomain: "aitechs-push-notifications.firebaseapp.com",
  projectId: "aitechs-push-notifications",
  storageBucket: "aitechs-push-notifications.firebasestorage.app",
  messagingSenderId: "1078944936992",
  appId: "1:1078944936992:web:09d408e0144461afa4b845"
};

 

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload);
  const audio = new Audio('/751326__robinhood76__13129-mystery-cash-bonus.wav')
  audio.play()
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
