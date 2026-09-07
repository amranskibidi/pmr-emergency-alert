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
      alert('Browser HP ini tidak mendukung fitur FCM Push Notification.');
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      alert('Izin Notifikasi ditolak di browser. Silahkan reset izin situs di setelan Chrome.');
      return null;
    }

    const messaging = getMessaging(app);
    // MASUKKAN VAPID KEY KAMU DI BAWAH INI:
    const currentToken = await getToken(messaging, {
      vapidKey: 'BGvUOr-SksdgdUYPy7gLPinmJytJfuuasJpK0fr6Dm1sb2L3jfj5ip0FY9HvucGUiF4IoQVxbO6GUOhs8dHs0Ro'
    });

    if (currentToken) {
      alert('SUCCESS! Notifikasi PMR Berhasil Diaktifkan 🎉');
      return currentToken;
    }
    return null;
  } catch (err) {
    console.error('Error FCM:', err);
    alert('Gagal mengambil token FCM. Pastikan VAPID Key sudah benar.');
    return null;
  }
};