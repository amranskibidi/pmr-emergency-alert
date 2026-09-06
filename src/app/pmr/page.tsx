'use client';

import React, { useState } from 'react';
import { requestForToken } from '@/lib/firebase';
import { Bell, ShieldCheck, CheckCircle, Smartphone } from 'lucide-react';

export default function PMRDashboard() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const handleEnableNotifications = async () => {
    const fcmToken = await requestForToken();
    if (fcmToken) {
      setToken(fcmToken);
      setIsRegistered(true);
      console.log("Token tersimpan:", fcmToken);
    } else {
      alert('Izin notifikasi ditolak atau tidak didukung di browser ini.');
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center shadow-2xl">
        <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-8 h-8 text-amber-400" />
        </div>

        <h1 className="text-xl font-black text-white mb-1">DASHBOARD PETUGAS PMR</h1>
        <p className="text-xs text-slate-400 mb-6">Aktifkan perangkat ini agar tetap menerima notifikasi panggilan darurat meski aplikasi ditutup.</p>

        {!isRegistered ? (
          <button
            onClick={handleEnableNotifications}
            className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
          >
            <Bell className="w-5 h-5" /> AKTIFKAN NOTIFIKASI HP PMR
          </button>
        ) : (
          <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-emerald-200">
            <div className="flex items-center justify-center gap-2 font-bold text-sm mb-1">
              <CheckCircle className="w-5 h-5 text-emerald-400" /> HP TERHUBUNG KE SISTEM
            </div>
            <p className="text-[11px] text-emerald-300/80">
              Perangkat ini siap menerima notifikasi darurat & permintaan obat secara otomatis.
            </p>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-center gap-2 text-[10px] text-slate-500">
          <Smartphone className="w-3.5 h-3.5" /> status: Standby Mode (2026)
        </div>
      </div>
    </main>
  );
}

// Fungsi untuk memicu push notification ke HP PMR
const triggerPushNotification = async (type: 'emergency' | 'medicine', detailMessage: string) => {
  try {
    // Ambil token HP PMR yang tersimpan (nanti di-sync via database/local storage)
    const savedToken = localStorage.getItem('pmr_fcm_token');
    if (!savedToken) return;

    await fetch('/api/send-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: savedToken,
        title: type === 'emergency' ? '🚨 PANGGILAN DARURAT!' : '💊 PERMINTAAN OBAT!',
        body: `${kelas}: ${detailMessage}`,
        type: type,
        kelas: kelas,
      }),
    });
  } catch (err) {
    console.error('Gagal mengirim sinyal push notification:', err);
  }
};