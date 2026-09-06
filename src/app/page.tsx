'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { AlertTriangle, Pill, MapPin, Stethoscope, ShieldCheck, Volume2, VolumeX, Sparkles, CheckCircle2, SmartphoneNfc } from 'lucide-react';

export default function HomePage() {
  const searchParams = useSearchParams();
  const [kelas, setKelas] = useState<string>('Mendeteksi lokasi...');
  
  const [activeAlarmType, setActiveAlarmType] = useState<'emergency' | 'medicine' | null>(null);
  const [selectedMedicine, setSelectedMedicine] = useState<string>('');
  const [isMedicineModalOpen, setIsMedicineModalOpen] = useState<boolean>(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const vibrateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const classParam = searchParams.get('kelas');
    if (classParam) {
      setKelas(`Kelas ${classParam.toUpperCase()}`);
    } else {
      setKelas('Kelas X-1');
    }
  }, [searchParams]);

  const initAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // MATIKAN ALARM, SUARA, DAN GETARAN
  const stopAllAlarms = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (vibrateIntervalRef.current) {
      clearInterval(vibrateIntervalRef.current);
      vibrateIntervalRef.current = null;
    }
    if ('vibrate' in navigator) {
      navigator.vibrate(0); // Stop getar
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    setActiveAlarmType(null);
    setSelectedMedicine('');
  };

  // 1. ALARM DARURAT + GETARAN EXTREME
  const startEmergencySiren = () => {
    stopAllAlarms();
    setActiveAlarmType('emergency');

    const ctx = initAudioContext();

    const playSirenBurst = () => {
      if (!audioCtxRef.current) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(700, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.4);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.8);

      gain.gain.setValueAtTime(1.0, now);
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.8);
    };

    // Jalankan Getar Cepat Berulang
    if ('vibrate' in navigator) {
      navigator.vibrate([400, 100, 400, 100]);
      vibrateIntervalRef.current = setInterval(() => {
        navigator.vibrate([400, 100, 400, 100]);
      }, 1000);
    }

    playSirenBurst();
    timerRef.current = setInterval(playSirenBurst, 900);
  };

  // 2. ALARM OBAT + GETARAN HALUS BERULANG
  const startMedicineAlarm = (medicineName: string) => {
    stopAllAlarms();
    setSelectedMedicine(medicineName);
    setIsMedicineModalOpen(false);
    setActiveAlarmType('medicine');

    const ctx = initAudioContext();

    const playChimeBurst = () => {
      if (!audioCtxRef.current) return;
      const now = ctx.currentTime;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.9, now);
      masterGain.connect(ctx.destination);

      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now);
      gain1.gain.setValueAtTime(0.8, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc1.connect(gain1);
      gain1.connect(masterGain);
      osc1.start(now);
      osc1.stop(now + 0.6);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(783.99, now + 0.2);
      gain2.gain.setValueAtTime(1.0, now + 0.2);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.0);
      osc2.connect(gain2);
      gain2.connect(masterGain);
      osc2.start(now + 0.2);
      osc2.stop(now + 1.0);
    };

    // Getar Halus untuk Obat
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 200, 200]);
      vibrateIntervalRef.current = setInterval(() => {
        navigator.vibrate([200, 200, 200]);
      }, 1400);
    }

    playChimeBurst();
    timerRef.current = setInterval(playChimeBurst, 1400);
  };

  return (
    <main className={`min-h-screen text-slate-100 flex flex-col items-center justify-between p-4 sm:p-6 font-sans transition-colors duration-500 ${
      activeAlarmType === 'emergency' ? 'bg-red-950 animate-pulse' : activeAlarmType === 'medicine' ? 'bg-amber-950/80' : 'bg-slate-950'
    }`}>
      <div className="w-full max-w-md flex flex-col justify-between min-h-[92vh]">
        
        <div>
          {/* HEADER */}
          <div className="flex items-center justify-between mb-6 border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 flex items-center justify-center p-1 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-md">
                <img src="/logo-pmr.png" alt="Logo PMR" className="w-10 h-10 object-contain" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-sm font-extrabold text-white tracking-wider">PMR WIRA</h1>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded">MORORENDOMA</span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Smart Emergency Alert System</p>
              </div>
            </div>
            <span className="px-2.5 py-1 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Standby
            </span>
          </div>

          {/* KARTU LOKASI */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-6 backdrop-blur-xl shadow-xl">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                <span>Lokasi Terdeteksi:</span>
              </div>
              <span className="text-[10px] text-slate-500">Auto-Locked</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">{kelas}</h2>
          </div>

          {/* STATUS DARURAT */}
          {activeAlarmType === 'emergency' && (
            <div className="mb-6 p-4 bg-red-900/90 border-2 border-red-500 text-red-100 rounded-2xl text-center shadow-2xl">
              <div className="flex items-center justify-center gap-2 font-black text-base text-red-200 mb-1">
                <Volume2 className="w-6 h-6 animate-bounce" /> ALARM DARURAT AKTIF!
              </div>
              <p className="text-xs mb-3 font-medium">Panggilan darurat berulang dari <span className="font-black text-white underline">{kelas}</span></p>
              <button
                onClick={stopAllAlarms}
                className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
              >
                <VolumeX className="w-5 h-5" /> TIM PMR MELUNCUR / MATIKAN
              </button>
            </div>
          )}

          {/* STATUS OBAT */}
          {activeAlarmType === 'medicine' && (
            <div className="mb-6 p-4 bg-amber-900/90 border-2 border-amber-400 text-amber-100 rounded-2xl text-center shadow-2xl">
              <div className="flex items-center justify-center gap-2 font-black text-base text-amber-300 mb-1">
                <SmartphoneNfc className="w-6 h-6 animate-bounce" /> PERMINTAAN OBAT BERLANGSUNG!
              </div>
              <p className="text-xs mb-3 font-medium"><span className="font-black text-white underline">{kelas}</span> membutuhkan <span className="text-amber-200 font-extrabold">{selectedMedicine}</span></p>
              <button
                onClick={stopAllAlarms}
                className="w-full py-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
              >
                <CheckCircle2 className="w-5 h-5" /> OBAT TERKIRIM / TIM PMR MELUNCUR
              </button>
            </div>
          )}

          {/* TOMBOL PANGGILAN */}
          {!activeAlarmType && (
            <>
              <p className="text-xs text-slate-400 mb-3 text-center">Pilih jenis bantuan yang dibutuhkan:</p>

              <button
                onClick={startEmergencySiren}
                className="w-full bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold py-6 rounded-2xl shadow-xl shadow-red-900/40 border border-red-500/30 flex flex-col items-center justify-center gap-2 mb-4 active:scale-95 transition-all duration-200"
              >
                <AlertTriangle className="w-10 h-10 text-white animate-bounce" />
                <span className="text-xl tracking-wider">KEADAAN DARURAT</span>
                <span className="text-[11px] font-normal text-red-100/80">(Pingsan, Pendarahan, Cedera Parah)</span>
              </button>

              <button
                onClick={() => setIsMedicineModalOpen(true)}
                className="w-full bg-slate-900 hover:bg-slate-800/80 border border-amber-500/30 text-amber-400 font-bold py-5 rounded-2xl shadow-lg flex items-center justify-between px-5 active:scale-95 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20">
                    <Pill className="w-6 h-6 text-amber-400" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-white">KEBUTUHAN OBAT / UKS</div>
                    <div className="text-[11px] text-slate-400 font-normal">Sakit Kepala, Maag, Luka Ringan</div>
                  </div>
                </div>
                <Sparkles className="w-4 h-4 text-amber-400/60" />
              </button>
            </>
          )}
        </div>

        {/* FOOTER LEGACY 2026 */}
        <div className="mt-8 pt-4 border-t border-slate-900/80 text-center flex flex-col items-center gap-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>PMR Wira Mororendoma</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Dibuat pada tahun <span className="text-white font-bold">2026</span> oleh <span className="text-amber-400 font-semibold">Ketua Divisi Humas</span>
          </p>
          <p className="text-[10px] text-slate-500">
            Masa Jabatan Periode 2025/2026
          </p>
        </div>

      </div>

      {/* MODAL OBAT */}
      {isMedicineModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end justify-center z-50 animate-fade-in">
          <div className="bg-slate-900 border-t border-slate-800 w-full max-w-md rounded-t-3xl p-6 shadow-2xl">
            <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto mb-4"></div>
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-amber-400" /> Pilih Bantuan Non-Darurat:
            </h3>

            <div className="grid grid-cols-1 gap-3 mb-6">
              {[
                { title: 'Obat Maag', icon: '🤢', desc: 'Sakit Perut / Nyeri Mual' },
                { title: 'Obat Pusing', icon: '🤕', desc: 'Sakit Kepala / Pusing / Demam' },
                { title: 'Luka Ringan', icon: '🩹', desc: 'P3K / Minyak Angin / Betadine' },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => startMedicineAlarm(item.title)}
                  className="p-4 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-left hover:border-amber-500/50 transition-all flex items-center gap-4 active:scale-95"
                >
                  <span className="text-3xl">{item.icon}</span>
                  <div>
                    <div className="font-bold text-sm text-white">{item.title}</div>
                    <div className="text-xs text-slate-400">{item.desc}</div>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsMedicineModalOpen(false)}
              className="w-full py-3 bg-slate-800 text-slate-400 font-bold rounded-xl text-xs hover:text-white transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </main>
  );
}