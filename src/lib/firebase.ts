export const requestForToken = async () => {
  try {
    const supported = await isSupported();
    if (!supported) {
      alert('Browser HP ini tidak mendukung Push Notification.');
      return null;
    }

    // 1. Minta izin Notifikasi bawaan browser
    const permission = await Notification.requestPermission();
    if (permission === 'denied') {
      alert('Izin terblokir di Chrome HP! Buka Titik Tiga (⋮) -> Setelan -> Setelan Situs -> Notifikasi -> Izinkan.');
      return null;
    }

    if (permission !== 'granted') {
      alert('Izin notifikasi tidak diberikan.');
      return null;
    }

    // 2. Daftar Service Worker secara manual
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

    const messaging = getMessaging(app);
    const currentToken = await getToken(messaging, {
      vapidKey: 'BGvUOr-SksdgdUYPy7gLPinmJytJfuuasJpK0fr6Dm1sb2L3jfj5ip0FY9HvucGUiF4IoQVxbO6GUOhs8dHs0Ro',
      serviceWorkerRegistration: registration,
    });

    if (currentToken) {
      alert('BERHASIL! Token FCM: ' + currentToken.substring(0, 10) + '...');
      return currentToken;
    }
  } catch (err: any) {
    console.error('Error FCM:', err);
    alert('Error Firebase: ' + (err?.message || 'Gagal mengambil token'));
    return null;
  }
};