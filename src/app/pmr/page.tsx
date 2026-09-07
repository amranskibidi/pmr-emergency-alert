'use client';

import React, { useState } from 'react';
import { requestForToken } from '@/lib/firebase';
import { Bell, ShieldCheck, CheckCircle } from 'lucide-react';

export default function PMRDashboard() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEnableNotifications = async () => {
    setLoading(true);
    try {
      const fcmToken = await requestForToken();
      if (fcmToken) {
        setIsRegistered(true);
        alert('Notifikasi HP PMR Berhasil Aktif!');
      } else {
        alert('Izin notifikasi ditolak atau tidak didukung di browser ini.');
      }
    } catch (err) {
      console.error(err);
      alert('Gagal mengaktifkan notifikasi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 color-white text-white p-6 flex flex-col items-center justify-center font-sans">
      <div className="max-w-md w-full bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-4 bg-red-500/10 rounded-full border border-red-500/20">
            <Bell className="w-12 h-12 text-red-500 animate-bounce" />
          </div>
        </div>

        <h1 className="text-2xl font-bold tracking-tight">
          DASHBOARD PETUGAS PMR
        </h1>
        <p className="text-slate-400 text-sm">
          Aktifkan notifikasi pada perangkat ini untuk menerima panggilan darurat real-time dari siswa di kelas.
        </p>

        {!isRegistered ? (
          <button
            onClick={handleEnableNotifications}
            disabled={loading}
            className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
          >
            <ShieldCheck className="w-5 h-5" />
            {loading ? 'MEMPROSES...' : 'AKTIFKAN NOTIFIKASI HP PMR'}
          </button>
        ) : (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 flex items-center justify-center gap-2 font-medium">
            <CheckCircle className="w-5 h-5" />
            HP PMR Terhubung & Siap Menerima Alert
          </div>
        )}
      </div>
    </main>
  );
}