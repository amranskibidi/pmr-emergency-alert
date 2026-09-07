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
  const notificationTitle = payload.notification.title || 'PMR Emergency Alert';
  const notificationOptions = {
    body: payload.notification.body || 'Ada panggilan darurat!',
    icon: '/logo-pmr.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});