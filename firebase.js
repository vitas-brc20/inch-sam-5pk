const firebaseConfig = {
  apiKey: "AIzaSyB1cHw8r6sL46B96xqbWt6IQWOiV32Ie00",
  authDomain: "inch-sam5pk.firebaseapp.com",
  projectId: "inch-sam5pk",
  storageBucket: "inch-sam5pk.firebasestorage.app",
  messagingSenderId: "638595335864",
  appId: "1:638595335864:web:226458233f64e7b158964d"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

const vapidKey = 'BPqv1O7kKb0zwFJ3p0Oz3pH-DrFXKZq4XbIrGfcQusyGug8Irjs_ocSi6UFN6ekoqKNioPvBOQXPODLqPt1aH8M';

const tokenDisplay = document.getElementById('token-display');
const notificationButton = document.getElementById('enable-notifications');

async function requestPermissionAndGetToken() {
  try {
    await Notification.requestPermission();
    console.log('Notification permission granted.');
    tokenDisplay.innerText = 'Getting token...';

    // Get the current service worker registration
    const swRegistration = await navigator.serviceWorker.ready;
    console.log('Using service worker registration:', swRegistration);

    // Get the token, explicitly passing the service worker registration
    const token = await messaging.getToken({ 
        vapidKey: vapidKey,
        serviceWorkerRegistration: swRegistration
    });

    if (token) {
      console.log('FCM Token:', token);
      tokenDisplay.innerText = token;
      alert('Push notifications enabled! You can use the token above to send a test message from the Firebase Console.');
    } else {
      console.log('No registration token available. Request permission to generate one.');
      tokenDisplay.innerText = 'Failed to get token. Please allow notifications.';
    }
  } catch (err) {
    console.log('An error occurred while retrieving token. ', err);
    tokenDisplay.innerText = `Error: ${err.message}`;
  }
}

notificationButton.addEventListener('click', requestPermissionAndGetToken);
