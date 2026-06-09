import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get('text');
  
  if (!text) {
    return NextResponse.json({ error: 'No text' }, { status: 400 });
  }
  
  const encodedText = encodeURIComponent(text);
  
  // محاولة 1: StreamElements - Hans
  try {
    const url = `https://api.streamelements.com/kappa/v2/speech?voice=Hans&text=${encodedText}`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    
    if (response.ok) {
      const buffer = await response.arrayBuffer();
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type': 'audio/mpeg',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }
  } catch (e) {
    console.error('StreamElements failed:', e);
  }
  
  // محاولة 2: TikTok TTS (صوت راجل ألماني)
  try {
    const url = `https://tiktok-tts.weilnet.workers.dev/api/generation`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: text,
        voice: 'de_001', // ذكر ألماني
      }),
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.data) {
        const buffer = Buffer.from(data.data, 'base64');
        return new NextResponse(buffer, {
          status: 200,
          headers: {
            'Content-Type': 'audio/mpeg',
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      }
    }
  } catch (e) {
    console.error('TikTok TTS failed:', e);
  }
  
  return NextResponse.json({ error: 'All TTS services failed' }, { status: 500 });
}