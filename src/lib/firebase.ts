import { initializeApp, getApps, getApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

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
  if (typeof window === 'undefined' || !('Notification' in window)) {
    alert('Browser kamu tidak mendukung Notifikasi.');
    return null;
  }

  try {
    // 1. Minta Izin
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      alert('Izin ditolak! Buka Titik 3 di Chrome -> Setelan Situs -> Notifikasi -> Izinkan.');
      return null;
    }

    // 2. Register Service Worker
    const swRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

    // 3. Ambil Messaging & Token
    const messaging = getMessaging(app);
    const token = await getToken(messaging, {
      vapidKey: 'BGvU0r-SksdgdUYPy7gLPinmJytJfuuasJpK0fr6Dm1sb2L3jfj5ip0FY9HvucGUiF4IoQVxb06GU0hs8dHs0Ro',
      serviceWorkerRegistration: swRegistration
    });

    if (token) {
      alert('BERHASIL! Token FCM terbit.');
      console.log('FCM Token:', token);
      return token;
    } else {
      alert('Gagal mendapatkan token dari Firebase.');
      return null;
    }
  } catch (err: any) {
    console.error('Error detail:', err);
    alert('Detail Error: ' + (err?.message || err));
    return null;
  }
};