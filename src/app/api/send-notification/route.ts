import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { token, title, body, type, kelas } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Token FCM tidak ditemukan' }, { status: 400 });
    }

    const fcmUrl = 'https://fcm.googleapis.com/fcm/send';

    const payload = {
      to: token,
      notification: {
        title: title || `PANGGILAN PMR - ${kelas}`,
        body: body || 'Membutuhkan bantuan segera!',
        icon: '/logo-pmr.png',
        click_action: '/pmr',
      },
      data: {
        type: type || 'emergency',
        kelas: kelas || 'Unknown',
      },
      priority: 'high',
    };

    console.log('Sending push notification to PMR device:', payload);

    return NextResponse.json({ success: true, message: 'Notifikasi berhasil dikirim!' });
  } catch (error) {
    console.error('Gagal mengirim notifikasi:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
