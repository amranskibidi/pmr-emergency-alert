'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// 1. Buat komponen terpisah untuk mengambil query param (?kelas=x1)
function CallEmergencyContent() {
  const searchParams = useSearchParams();
  const kelas = searchParams.get('kelas') || 'Umum';

  return (
    <div>
      <h1 className="text-xl font-bold">Panggilan Darurat Kelas: {kelas}</h1>
      {/* Taruh logika/tombol panggil darurat & geolocation kamu di sini */}
    </div>
  );
}

// 2. Bungkus komponen tersebut dengan Suspense di halaman utama
export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
      <Suspense fallback={<p className="text-slate-400">Loading halaman...</p>}>
        <CallEmergencyContent />
      </Suspense>
    </main>
  );
}