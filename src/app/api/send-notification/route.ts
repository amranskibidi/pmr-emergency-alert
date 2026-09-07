import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { type, title, body, kelas, lat, lng } = await request.json();

    console.log('Incoming Emergency Alert:', { type, title, body, kelas, lat, lng });

    // Logika pengiriman pesan via FCM atau Service dapat diproses di sini

    return NextResponse.json({
      success: true,
      message: 'Alert processed successfully',
      data: { type, title, body, kelas, lat, lng },
    });
  } catch (error) {
    console.error('Error in send-notification route:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process alert' },
      { status: 500 }
    );
  }
}