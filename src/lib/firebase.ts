import { initializeApp, getApps, getApp } from 'firebase/app';
import { getMessaging, getToken, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyCqK_DYIa5R0UI9IgFbwrZDrDafGA2VN6Y",
  authDomain: "pmr-emergency-app.firebaseapp.com",
  projectId: "pmr-emergency-app",
  storageBucket: "pmr-emergency-app.firebasestorage.app",
  messagingSenderId: "358181156864",
  appId: "1:358181156864:web:946f4385b6d647b0b4c0e5"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const requestForToken = async () => {
  try {
    const supported = await isSupported();
    if (!supported) {
      console.warn('Browser tidak mendukung Push Notification FCM');
      return null;
    }

    if (Notification.permission === 'denied') {
      alert('Izin Notifikasi di-Block oleh Browser! Mohon klik ikon Gembok di baris URL atas untuk mengubah izin menjadi Allow.');
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      alert('Izin notifikasi tidak diberikan.');
      return null;
    }

    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

    const messaging = getMessaging(app);
    const currentToken = await getToken(messaging, {
      vapidKey: 'BGvUOr-SksdgdUYPy7gLPinmJytJfuuasJpK0fr6Dm1sb2L3jfj5ip0FY9HvucGUiF4IoQVxbO6GUOhs8dHs0Ro',
      serviceWorkerRegistration: registration,
    });

    if (currentToken) {
      console.log('FCM Token Berhasil Didapat:', currentToken);
      return currentToken;
    } else {
      console.warn('Tidak ada registration token yang tersedia.');
      return null;
    }
  } catch (err) {
    console.error('Error saat mengambil FCM Token:', err);
    return null;
  }
};
