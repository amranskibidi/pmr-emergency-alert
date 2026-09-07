importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCqK_DYIa5R0UI9IgFbwRZDrDafGA2VN6Y",
  authDomain: "pmr-emergency-app.firebaseapp.com",
  projectId: "pmr-emergency-app",
  storageBucket: "pmr-emergency-app.firebasestorage.app",
  messagingSenderId: "358181156864",
  appId: "1:358181156864:web:946f4385b6d647b0b4c0e5",
  measurementId: "G-KFGTX6DLXG"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || 'PANGGILAN DARURAT PMR';
  const notificationOptions = {
    body: payload.notification?.body || 'Ada situasi darurat!',
    icon: '/logo-pmr.png',
    badge: '/logo-pmr.png',
    vibrate: [500, 110, 500, 110, 450, 110, 200, 110, 170, 110, 450, 110, 200, 110, 170, 110, 450],
    tag: 'emergency-alert-' + Date.now(), // Tag dinamis agar tiap notifikasi dianggap baru
    renotify: true,
    requireInteraction: true,
    silent: false,
    sound: 'default'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});