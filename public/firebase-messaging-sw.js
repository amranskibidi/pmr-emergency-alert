importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Ganti nilai config di bawah ini dengan Firebase Config dari Console kamu
firebase.initializeApp({
  apiKey: "AIzaSyCqK_DYIa5R0UI9IgFbwRZDrDafGA2VN6Y",
  authDomain: "pmr-emergency-app.firebaseapp.com",
  projectId: "pmr-emergency-app",
  storageBucket: "pmr-emergency-app.firebasestorage.app",
  messagingSenderId: "358181156864",
  appId: "1:358181156864:web:946f4385b6d647b0b4c0e5"
});

const messaging = firebase.messaging();

// Menangani notifikasi saat HP PMR lagi main game / mati layar
messaging.onBackgroundMessage((payload) => {
  console.log('Notifikasi Background Diterima:', payload);

  const notificationTitle = payload.notification?.title || 'PANGGILAN PMR!';
  const notificationOptions = {
    body: payload.notification?.body || 'Ada panggilan darurat/obat masuk!',
    icon: '/logo-pmr.png',
    badge: '/logo-pmr.png',
    vibrate: [500, 100, 500, 100, 500],
    requireInteraction: true,
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});