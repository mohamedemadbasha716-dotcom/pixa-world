'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PricingRedirect() {
  const router = useRouter();

  useEffect(() => {
    async function detectCountry() {
      try {
        const res = await fetch('/api/geo');
        const data = await res.json();
        router.replace(data.redirectPath || '/pricing/eg');
      } catch {
        router.replace('/pricing/eg');
      }
    }
    detectCountry();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#1a1a3e] flex items-center justify-center" dir="rtl">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#FF4D6D] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-white/60 text-sm font-bold">جاري تحديد موقعك...</p>
      </div>
    </div>
  );
}