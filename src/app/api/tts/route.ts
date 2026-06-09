import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get('text');
  
  if (!text) {
    return NextResponse.json({ error: 'No text' }, { status: 400 });
  }
  
  const encodedText = encodeURIComponent(text);
  
  // 🎯 StreamElements - Brian (راجل واضح جداً)
  // Brian صوت راجل ألماني/إنجليزي رجولي وواضح
  try {
    const url = `https://api.streamelements.com/kappa/v2/speech?voice=Hans&text=${encodedText}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'audio/mpeg,audio/*;q=0.9,*/*;q=0.8',
        'Referer': 'https://streamelements.com/',
      },
    });
    
    if (response.ok) {
      const buffer = await response.arrayBuffer();
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type': 'audio/mpeg',
          'Cache-Control': 'public, max-age=31536000, immutable',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  } catch (e) {
    console.error('Hans failed:', e);
  }
  
  // Fallback: TikTok TTS - de_002 (راجل ألماني)
  try {
    const response = await fetch('https://tiktok-tts.weilnet.workers.dev/api/generation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: text,
        voice: 'de_002',
      }),
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.data) {
        const binaryString = atob(data.data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        return new NextResponse(bytes, {
          status: 200,
          headers: {
            'Content-Type': 'audio/mpeg',
            'Cache-Control': 'public, max-age=31536000, immutable',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    }
  } catch (e) {
    console.error('TikTok failed:', e);
  }
  
  return NextResponse.json({ error: 'All TTS failed' }, { status: 500 });
}