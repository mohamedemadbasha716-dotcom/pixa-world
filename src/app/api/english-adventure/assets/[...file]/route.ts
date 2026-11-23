import recorded from '../../../../../../4-english-adventure-audio.json';
import art from '../../../../../../3-english-adventure-art.json';
import {mapTwoResources} from '@/lib/englishAdventure/mapTwo.server';
import {englishResources} from '@/lib/englishAdventure/resources.server';
import {identity,privateHeaders,errorStatus} from '@/lib/englishAdventure/server';
export const runtime='nodejs';
export async function GET(request:Request,{params}:{params:Promise<{file:string[]}>}){
 try{const {actor}=await identity(request);const file=(await params).file.join('/');
 if(Object.hasOwn(recorded.assets,file)){if(!actor.isAdmin)throw new Error('forbidden');return new Response(Buffer.from(recorded.assets[file as keyof typeof recorded.assets],'base64'),{headers:{...privateHeaders,'Content-Type':'audio/mpeg'}});}
 if(Object.hasOwn(art.assets,file)){if(!actor.isAdmin)throw new Error('forbidden');return new Response(Buffer.from(art.assets[file as keyof typeof art.assets],'base64'),{headers:{...privateHeaders,'Content-Type':'image/webp'}});}
 if(Object.hasOwn(mapTwoResources.assets,file)){if(!actor.isAdmin)throw new Error('forbidden');const bytes=Buffer.from(mapTwoResources.assets[file as keyof typeof mapTwoResources.assets],'base64');return new Response(bytes,{headers:{...privateHeaders,'Content-Type':file.endsWith('.mp3')?'audio/mpeg':'image/webp'}});}
 if(!/^(?:harbour\.webp|islands\.webp|audio\/en-(?:0[1-9]|[12][0-9]|3[0-6])\.mp3)$/.test(file))return new Response('Not found',{status:404,headers:privateHeaders});
 const bytes=Buffer.from(englishResources.assets[file as keyof typeof englishResources.assets],'base64');
 return new Response(bytes,{headers:{...privateHeaders,'Content-Type':file.endsWith('.mp3')?'audio/mpeg':'image/webp'}});
 }catch(error){return new Response('Unavailable',{status:errorStatus(error),headers:privateHeaders})}
}
