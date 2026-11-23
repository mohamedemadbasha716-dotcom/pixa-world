import {englishResources} from '@/lib/englishAdventure/resources.server';
import {identity,privateHeaders,errorStatus} from '@/lib/englishAdventure/server';
export const runtime='nodejs';
export async function GET(request:Request,{params}:{params:Promise<{file:string[]}>}){
 try{await identity(request);const file=(await params).file.join('/');
 if(!/^(?:harbour\.webp|islands\.webp|audio\/en-(?:0[1-9]|[12][0-9]|3[0-6])\.mp3)$/.test(file))return new Response('Not found',{status:404,headers:privateHeaders});
 const bytes=Buffer.from(englishResources.assets[file as keyof typeof englishResources.assets],'base64');
 return new Response(bytes,{headers:{...privateHeaders,'Content-Type':file.endsWith('.mp3')?'audio/mpeg':'image/webp'}});
 }catch(error){return new Response('Unavailable',{status:errorStatus(error),headers:privateHeaders})}
}
