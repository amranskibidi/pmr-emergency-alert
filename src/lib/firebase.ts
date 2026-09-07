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
      vapidKey: 'PASTE_VAPID_KEY_KAMU_DI_SINI',
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