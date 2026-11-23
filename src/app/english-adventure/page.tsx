 'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {supabase} from '@/lib/supabase';
export default function EnglishAdventurePage(){
 const [practice,setPractice]=useState(false),[mapId,setMapId]=useState('1');
 const [ready,setReady]=useState(false),[message,setMessage]=useState('بنفتح رحلتك المرتبطة بحسابك...');
 useEffect(()=>{let active=true;let version=0;const preview=new URLSearchParams(window.location.search).get('practice')==='1';setPractice(preview);const chosenMap=new URLSearchParams(window.location.search).get('map')||'1';setMapId(['1','2','3','4','5'].includes(chosenMap)?chosenMap:'1');
 const refresh=async()=>{const current=++version;setReady(false);try{const {data,error}=await supabase.auth.getSession();if(error||!data.session)throw new Error('سجّل الدخول بحسابك الأول، وبعدها ارجع لجزيرة البدايات.');
 const response=await fetch('/api/english-adventure/bootstrap'+(preview?'?practice=1':''),{method:'POST',headers:{Authorization:`Bearer ${data.session.access_token}`,'Content-Type':'application/json'},body:'{}',cache:'no-store'});
 if(!response.ok)throw new Error('ربط حفظ التقدّم مش جاهز دلوقتي. بياناتك الحالية متغيّرتش.');
 if(active&&current===version)setReady(true);
 }catch(e){if(active&&current===version)setMessage(e instanceof Error?e.message:'الدخول مش متاح دلوقتي.')}};
 void refresh();const {data}=supabase.auth.onAuthStateChange((event)=>{if(event==='SIGNED_OUT'){version++;setReady(false);setMessage('اتسجل خروجك. المحتوى اتقفل.');void fetch('/api/english-adventure/bootstrap',{method:'DELETE',headers:{'Content-Type':'application/json'},body:'{}'});}else if(event==='TOKEN_REFRESHED'||event==='SIGNED_IN')void refresh()});
 return()=>{active=false;data.subscription.unsubscribe()};},[]);
 if(ready)return <iframe title="جزيرة البدايات، الإنجليزية" src={'/api/english-adventure/play'+(practice?'?practice=1&map='+mapId:'')} style={{width:'100%',height:'100dvh',border:0,display:'block'}}/>;
 return <main dir="rtl" className="min-h-screen bg-[#11192f] text-[#f5e9d0] flex items-center justify-center p-8"><section className="max-w-lg text-center"><p>PIXA WORLD · ENGLISH</p><h1 className="text-3xl font-bold my-5">جزيرة البدايات</h1>{practice&&<p className="leading-8">معاينة خاصة للأدمن للألعاب والشكل والصوت فقط. مفيش حفظ أو نقاط أو مكافآت. سجّل دخولك بحساب الأدمن الأول.</p>}<p role="status" className="leading-8">{message}</p><Link href="/login" className="inline-block mt-8 rounded-xl bg-[#edc27a] text-slate-900 px-6 py-3 font-bold">دخول المنصة</Link></section></main>
}
