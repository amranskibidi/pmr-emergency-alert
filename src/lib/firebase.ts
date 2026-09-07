import { initializeApp, getApps, getApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyCqK_DYIa5R0UI9IgFbwRZDrDafGA2VN6Y",
  authDomain: "pmr-emergency-app.firebaseapp.com",
  projectId: "pmr-emergency-app",
  storageBucket: "pmr-emergency-app.firebasestorage.app",
  messagingSenderId: "358181156864",
  appId: "1:358181156864:web:946f4385b6d647b0b4c0e5",
  measurementId: "G-KFGTX6DLXG"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const requestForToken = async () => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    alert('Browser ini tidak mendukung Push Notification.');
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      alert('Izin ditolak! Izinkan notifikasi di setelan browser HP kamu.');
      return null;
    }

    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: '/'
    });
    
    await navigator.serviceWorker.ready;

    const messaging = getMessaging(app);
    const token = await getToken(messaging, {
      vapidKey: 'BArH_wRORx4QcDIpne4mu26FPSg1oE80JcKwODz5wcfa-gB-fFwbC9Us7ChONMkGX2UyYKcYsgF71sGNOBJpX-w',
      serviceWorkerRegistration: registration,
    });

    if (token) {
      alert('BERHASIL! Notifikasi PMR Berhasil Diaktifkan 🎉');
      console.log('FCM Token:', token);
      return token;
    } else {
      alert('Gagal mengambil token dari Firebase.');
      return null;
    }
  } catch (err: any) {
    console.error('Error FCM:', err);
    alert('Error Terjadi: ' + (err?.message || JSON.stringify(err)));
    return null;
  }
};