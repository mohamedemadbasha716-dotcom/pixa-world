import 'server-only';
import recorded from '../../../4-english-adventure-audio.json';
import {englishResources} from './resources.server';
import {mapTwoResources} from './mapTwo.server';
// Reuse exact utterances only, never infer a word from a differently worded clip.
const raw=englishResources.ui.audio.match(/audioFiles=(\{[\s\S]*\});/);
if(!raw)throw Error('audio_inventory_version_mismatch');
const initial:Record<string,string>=JSON.parse(raw[1]);
const phrases:Record<string,string>=(recorded as {phrases?:Record<string,string>}).phrases||{};
const carriers=Object.fromEntries(Object.entries(phrases).map(([target,actual])=>[target,recorded.audio[actual as keyof typeof recorded.audio]]));
export const bundledAudio:Record<string,string>={...Object.fromEntries(Object.entries(initial).map(([text,path])=>[text,path.replace('assets/','/api/english-adventure/assets/')])),...mapTwoResources.audio,...recorded.audio,...carriers};

export const audioPhrases=phrases;
