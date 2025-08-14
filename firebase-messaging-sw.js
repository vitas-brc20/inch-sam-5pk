// This is the dedicated service worker file for Firebase Messaging.

// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB1cHw8r6sL46B96xqbWt6IQWOiV32Ie00",
  authDomain: "inch-sam5pk.firebaseapp.com",
  projectId: "inch-sam5pk",
  storageBucket: "inch-sam5pk.firebasestorage.app",
  messagingSenderId: "638595335864",
  appId: "1:638595335864:web:226458233f64e7b158964d"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(payload => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || '/favicon.ico'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
