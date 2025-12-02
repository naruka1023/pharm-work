importScripts('https://www.gstatic.com/firebasejs/10.1.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.1.0/firebase-messaging-compat.js')

firebase.initializeApp({
    projectId: 'pharm-work',
    appId: '1:797947649067:web:bad0f4f64244e37f249e6e',
    storageBucket: 'pharm-work.appspot.com',
    locationId: 'us-central',
    apiKey: 'AIzaSyB9LMNy74FMy1pL7fimCv5Qc2-pOYhdj5k',
    authDomain: 'pharm-work.firebaseapp.com',
    messagingSenderId: '797947649067',
    measurementId: 'G-TKMY6WTWZN',
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // // Customize notification here
    // const notificationTitle = payload.data.title;
    // const notificationOptions = {
    //   body: payload.data.body,
    //   icon: payload.data.image,
    //   click_action : payload.data.url
    // };
    // self.registration.showNotification(notificationTitle,
    //   notificationOptions);
  });