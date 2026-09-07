import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, getToken, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyCqK_DYIa5R0UI9IgFbwRZDrDafGA2VN6Y",
  authDomain: "AIzaSyCqK_DYIa5R0UI9IgFbwRZDrDafGA2VN6Y",
  projectId: "pmr-emergency-app",
  storageBucket: "pmr-emergency-app.firebasestorage.app",
  messagingSenderId: "358181156864",
  appId: "1:358181156864:web:946f4385b6d647b0b4c0e5"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// PENTING: Harus ada kata 'export' di depan const di bawah ini
export const requestForToken = async () => {
  try {
    const messagingSupported = await isSupported();
    if (!messagingSupported) return null;

    const messaging = getMessaging(app);
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      const currentToken = await getToken(messaging, { 
        vapidKey: 'BGvUOr-SksdgdUYPy7gLPinmJytJfuuasJpK0fr6Dm1sb2L3jfj5ip0FY9HvucGUiF4IoQVxbO6GUOhs8dHs0Ro' 
      });
      
      if (currentToken) {
        console.log('Token HP PMR berhasil didapat:', currentToken);
        return currentToken;
      }
    }
  } catch (err) {
    console.error('Gagal mengambil token notifikasi:', err);
  }
  return null;
};