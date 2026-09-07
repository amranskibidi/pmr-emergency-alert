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
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    alert('Browser ini tidak mendukung Service Worker / Push Notification.');
    return null;
  }

  try {
    // 1. Minta Izin Notifikasi
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      alert('Izin ditolak! Mohon izinkan notifikasi di setelan Chrome HP.');
      return null;
    }

    // 2. Pastikan Service Worker terdaftar dan SIAP (ready)
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: '/'
    });
    
    // Tunggu sampai SW benar-benar aktif
    await navigator.serviceWorker.ready;

    // 3. Ambil Messaging Instance & Token FCM
    const messaging = getMessaging(app);
    const token = await getToken(messaging, {
      vapidKey: 'BGvU0r-SksdgdUYPy7gLPinmJytJfuuasJpK0fr6Dm1sb2L3jfj5ip0FY9HvucGUiF4IoQVxb06GU0hs8dHs0Ro',
      serviceWorkerRegistration: registration,
    });

    if (token) {
      alert('BERHASIL! Token FCM terbit 🎉');
      console.log('FCM Token:', token);
      return token;
    } else {
      alert('Gagal mengambil token. VAPID Key atau SW tidak merespons.');
      return null;
    }
  } catch (err: any) {
    console.error('Error FCM Detail:', err);
    alert('Error Terjadi: ' + (err?.message || JSON.stringify(err)));
    return null;
  }
};