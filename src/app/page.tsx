'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// 1. PINDAHKAN SELURUH KODE & UTILITY TOMBOL PANGGILAN LAMA KAMU KE SINI
function CallEmergencyContent() {
  const searchParams = useSearchParams();
  const kelas = searchParams.get('kelas') || 'Umum';

  // --- TARUH STATE & FUNGSI GEOLOCATION / NOTIFIKASI KAMU DI SINI ---

  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Panggilan Darurat Kelas: {kelas}</h1>
      
      {/* TARUH TOMBOL PANGGILAN DARURAT & KEBUTUHAN OBAT KAMU DI SINI */}
      
    </div>
  );
}

// 2. HALAMAN UTAMA HANYA MEMBUNGKUS DENGAN SUSPENSE
export default function Home() {
  return (
    <Suspense fallback={<div className="text-white text-center p-10">Loading PWA...</div>}>
      <CallEmergencyContent />
    </Suspense>
  );
}