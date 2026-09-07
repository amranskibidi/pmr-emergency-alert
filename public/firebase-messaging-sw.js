importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCqK_DYIa5R0UI9IgFbwRZDrDafGA2VN6Y",
  projectId: "pmr-emergency-app",
  messagingSenderId: "358181156864",
  appId: "1:358181156864:web:946f4385b6d647b0b4c0e5"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png',
    // Properti wajib agar memaksa Android membunyikan suara
    sound: 'default', 
    vibrate: [200, 100, 200],
    requireInteraction: true
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});