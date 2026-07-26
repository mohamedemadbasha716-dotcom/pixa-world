import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    // Vercel بيحط الدولة تلقائياً في الـ header ده
    const country = request.headers.get('x-vercel-ip-country') || 'EG';

    // نحدد الـ route المناسب حسب الدولة
    let redirectPath = '/pricing/eg';
    if (country === 'SA') redirectPath = '/pricing/sa';
    else if (country === 'AE') redirectPath = '/pricing/ae';
    else redirectPath = '/pricing/eg';

    return NextResponse.json({
      country,
      redirectPath,
    });
  } catch {
    return NextResponse.json({
      country: 'EG',
      redirectPath: '/pricing/eg',
    });
  }
}