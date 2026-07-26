'use client';

import { useEffect } from 'react';
import '@/lib/subscription'; // 🔥 ده اللي بيحمّل دوال الأدمن في window

export default function AdminInit() {
  useEffect(() => {
    // 👑 رسالة ترحيبية للأدمن في الـ Console
    console.log(
      '%c🎮 PIXA WORLD - Developer Console',
      'background: linear-gradient(135deg, #FF4D6D, #9D4EDD); color: white; font-size: 16px; font-weight: bold; padding: 8px 16px; border-radius: 8px;'
    );
    console.log(
      '%c💡 الأوامر المتاحة:',
      'color: #FFD700; font-weight: bold; font-size: 14px;'
    );
    console.log(
      '%c  enableAdmin("PIXA_ADMIN_2025")  → تفعيل وضع الأدمن',
      'color: #06D6A0; font-size: 12px;'
    );
    console.log(
      '%c  disableAdmin()                  → إلغاء وضع الأدمن',
      'color: #FF6B35; font-size: 12px;'
    );
    console.log(
      '%c  checkAdmin()                    → التحقق من حالة الأدمن',
      'color: #4CC9F0; font-size: 12px;'
    );
  }, []);

  return null;
}