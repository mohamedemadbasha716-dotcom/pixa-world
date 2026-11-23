import 'server-only';
import {createClient} from '@supabase/supabase-js';
import {cookies} from 'next/headers';
import {verifiedActor} from './access';
export const privateHeaders={'Cache-Control':'private, no-store',Vary:'Cookie, Authorization','X-Content-Type-Options':'nosniff'};
export async function identity(request:Request){
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 if(!url||!key)throw new Error('configuration_unavailable');
 const bearer=request.headers.get('authorization');
 const token=bearer?.startsWith('Bearer ')?bearer.slice(7):(await cookies()).get('pixa_english_session')?.value;
 if(!token)throw new Error('unauthenticated');
 const client=createClient(url,key,{global:{headers:{Authorization:`Bearer ${token}`}},auth:{persistSession:false,autoRefreshToken:false}});
 const {data,error}=await client.auth.getUser(token);
 if(error||!data.user||data.user.is_anonymous||!data.user.email_confirmed_at)throw new Error('unauthenticated');
 const {data:owner,error:ownerError}=await client.rpc('pixa_is_owner');
 if(ownerError||typeof owner!=='boolean')throw new Error('owner_policy_unavailable');
 const actor=verifiedActor(data.user,new Set<string>());
 return {actor:{...actor!,isAdmin:owner},token};
}
export function database(){
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!url||!key)throw new Error('configuration_unavailable');
 return createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
}
export function safeMutation(request:Request){
 const origin=request.headers.get('origin');
 if(!origin||new URL(origin).host!==request.headers.get('host')||!['http:','https:'].includes(new URL(origin).protocol)||!request.headers.get('content-type')?.includes('application/json'))throw new Error('forbidden');
}
export function errorStatus(error:unknown){const s=error instanceof Error?error.message:'';return s==='unauthenticated'?401:s==='forbidden'?403:s==='unknown_lesson'||s==='locked_sequence'?403:s==='conflict'?409:503;}
