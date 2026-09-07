'use client';

import React, { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';

function EmergencyForm() {
  const searchParams = useSearchParams();
  const kelas = searchParams.get('kelas') || 'Umum';

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const sendAlert = async (type: string, title: string) => {
    setLoading(true);
    setStatus('Memproses panggilan...');

    const sendData = async (lat: number | null, lng: number | null) => {
      setStatus('Mengirim sinyal ke PMR...');
      try {
        const res = await fetch('/api/send-notification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type,
            title,
            body: `Panggilan dari Kelas ${kelas}! Lokasi terlampir.`,
            kelas,
            lat,
            lng,
          }),
        });

        if (res.ok) {
          setStatus('✅ Panggilan berhasil terkirim!');
        } else {
          setStatus('❌ Gagal mengirim panggilan.');
        }
      } catch (err) {
        console.error(err);
        setStatus('❌ Error koneksi jaringan.');
      } font-medium {
        setLoading(false);
      }
    };

    if (!navigator.geolocation) {
      await sendData(null, null);
      return;
    }

    // Mencoba mengambil lokasi dengan batas waktu (timeout) 4 detik
    navigator.geolocation.getCurrentPosition(
      (position) => {
        sendData(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.warn('Gagal/Lambat mengambil lokasi GPS, tetap mengirim sinyal:', error);
        sendData(null, null);
      },
      { enableHighAccuracy: false, timeout: 4000, maximumAge: 0 }
    );
  };

  return (
    <div className="max-w-md w-full bg-slate-800 rounded-3xl p-6 border border-slate-700 shadow-2xl text-center space-y-6">
      <div>
        <span className="px-3 py-1 bg-red-500/10 text-red-400 text-xs font-semibold rounded-full border border-red-500/20">
          SISTEM DARURAT PMR
        </span>
        <h1 className="text-2xl font-black mt-3 text-white tracking-wide">
          PANGGILAN KELAS: <span className="text-amber-400">{kelas}</span>
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Tekan tombol di bawah untuk mengirim sinyal & koordinat lokasi ke Tim PMR.
        </p>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => sendAlert('darurat', 'PANGGILAN DARURAT!')}
          disabled={loading}
          className="w-full py-5 px-4 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-extrabold text-lg rounded-2xl transition shadow-lg shadow-red-600/30 border border-red-500 disabled:opacity-50"
        >
          🚨 KEADAAN DARURAT
        </button>

        <button
          onClick={() => sendAlert('obat', 'BUTUH OBAT / PERTOLONGAN')}
          disabled={loading}
          className="w-full py-4 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-base rounded-2xl transition shadow-lg shadow-emerald-600/20 border border-emerald-500 disabled:opacity-50"
        >
          💊 KEBUTUHAN OBAT / P3K
        </button>
      </div>

      {status && (
        <div className="p-3 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-amber-400 font-medium">
          📍 {status}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 font-sans">
      <Suspense fallback={<div className="text-white text-center">Loading PMR System...</div>}>
        <EmergencyForm />
      </Suspense>
    </main>
  );
}