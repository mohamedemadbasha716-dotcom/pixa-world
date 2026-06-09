import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get('text');
  
  if (!text) {
    return NextResponse.json({ error: 'No text' }, { status: 400 });
  }
  
  const encodedText = encodeURIComponent(text);
  
  // 🎯 محاولة 1: StreamElements - Hans (راجل ألماني)
  try {
    const url = `https://api.streamelements.com/kappa/v2/speech?voice=Hans&text=${encodedText}`;
    const response = await fetch(url, {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'audio/mpeg',
      },
      cache: 'no-store',
    });
    
    console.log('StreamElements status:', response.status);
    
    if (response.ok) {
      const buffer = await response.arrayBuffer();
      console.log('✅ StreamElements (Hans) succeeded, size:', buffer.byteLength);
      
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type': 'audio/mpeg',
          'Cache-Control': 'public, max-age=31536000, immutable',
          'X-Voice-Used': 'StreamElements-Hans',
        },
      });
    } else {
      console.error('❌ StreamElements failed with status:', response.status);
    }
  } catch (e) {
    console.error('❌ StreamElements error:', e);
  }
  
  // 🎯 محاولة 2: TikTok TTS - de_002 (راجل ألماني مختلف)
  try {
    const url = `https://tiktok-tts.weilnet.workers.dev/api/generation`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: text,
        voice: 'de_002', // 🎙️ ذكر ألماني (de_002 بدل de_001)
      }),
    });
    
    console.log('TikTok status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      if (data.data) {
        const buffer = Buffer.from(data.data, 'base64');
        console.log('✅ TikTok (de_002) succeeded');
        
        return new NextResponse(buffer, {
          status: 200,
          headers: {
            'Content-Type': 'audio/mpeg',
            'Cache-Control': 'public, max-age=31536000, immutable',
            'X-Voice-Used': 'TikTok-de_002',
          },
        });
      }
    }
  } catch (e) {
    console.error('❌ TikTok error:', e);
  }
  
  return NextResponse.json({ error: 'All TTS services failed' }, { status: 500 });
}