import { supabase } from '@/lib/supabase';
export type EnglishBootstrap = {userId:string;admin:boolean;completed:string[]};
export async function loadEnglishBootstrap():Promise<EnglishBootstrap> {
  const {data,error} = await supabase.auth.getSession();
  if (error || !data.session) throw new Error('sign_in_required');
  const result = await fetch('/api/english-adventure/bootstrap', {headers:{Authorization:`Bearer ${data.session.access_token}`},cache:'no-store'});
  if (!result.ok) throw new Error(result.status===401?'sign_in_required':'english_account_integration_pending');
  return result.json();
}
