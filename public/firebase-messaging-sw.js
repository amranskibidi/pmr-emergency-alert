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
    body: payload.notification?.body || 'Ada situasi darurat! Segera periksa lokasi.',
    icon: '/logo-pmr.png',
    badge: '/logo-pmr.png',
    vibrate: [200, 100, 200, 100, 200, 100, 400], // Getar panjang pola darurat
    tag: 'emergency-alert',
    renotify: true,
    requireInteraction: true, // Notifikasi tidak akan hilang sampai diklik
    silent: false
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});