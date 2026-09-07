'use client';

import React, { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AlertTriangle, Pill, MapPin, CheckCircle2 } from 'lucide-react';

function EmergencyForm() {
  const searchParams = useSearchParams();
  const kelas = searchParams.get('kelas') || 'Umum';

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const sendAlert = async (type: string, title: string) => {
    setLoading(true);
    setStatus('Mengambil lokasi GPS...');

    if (!navigator.geolocation) {
      alert('Browser tidak mendukung Geolocation');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setStatus('Sending alert to PMR...');

        try {
          const res = await fetch('/api/send-notification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type,
              title,
              body: `Panggilan dari Kelas ${kelas}! Lokasi GPS terlampir.`,
              kelas,
              lat: latitude,
              lng: longitude,
            }),
          });

          if (res.ok) {
            setStatus('Panggilan berhasil terkirim!');
          } else {
            setStatus('Gagal mengirim panggilan.');
          }
        } catch (err) {
          console.error(err);
          setStatus('Error koneksi.');
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error(error);
        alert('Gagal mengambil lokasi. Pastikan izin GPS diaktifkan.');
        setLoading(false);
        setStatus('');
      },
      { enableHighAccuracy: true }
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
          Pilih jenis bantuan di bawah ini untuk mengirim notifikasi & koordinat GPS ke Tim PMR.
        </p>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => sendAlert('darurat', 'PANGGILAN DARURAT!')}
          disabled={loading}
          className="w-full py-5 px-4 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-extrabold text-lg rounded-2xl transition shadow-lg shadow-red-600/30 flex items-center justify-center gap-3 border border-red-500 disabled:opacity-50"
        >
          <AlertTriangle className="w-7 h-7 animate-pulse" />
          KEADAAN DARURAT
        </button>

        <button
          onClick={() => sendAlert('obat', 'BUTUH OBAT / PERTOLONGAN')}
          disabled={loading}
          className="w-full py-4 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-base rounded-2xl transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-3 border border-emerald-500 disabled:opacity-50"
        >
          <Pill className="w-6 h-6" />
          KEBUTUHAN OBAT / P3K
        </button>
      </div>

      {status && (
        <div className="p-3 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-amber-400 font-medium flex items-center justify-center gap-2">
          <MapPin className="w-4 h-4 animate-bounce text-amber-400" />
          {status}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <Suspense fallback={<div className="text-white text-center">Loading PMR System...</div>}>
        <EmergencyForm />
      </Suspense>
    </main>
  );
}
