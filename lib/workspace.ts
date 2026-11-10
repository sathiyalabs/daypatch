import type {Task,Fixed,Settings} from './planner.ts';

export type FocusSession={id:string;taskId:string;title:string;minutes:number;at:string};
export type Saved={sessions?:FocusSession[];checks?:Record<string,string[]>;notes?:Record<string,string>;version:1;tasks:Task[];fixed:Fixed[];settings:Settings;targets:Record<string,number>;receipt:string[];example:boolean};
export const LIMIT=300;
const reserved=new Set(['__proto__','prototype','constructor']);
const record=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==='object'&&!Array.isArray(v)&&(Object.getPrototypeOf(v)===Object.prototype||Object.getPrototypeOf(v)===null)&&!Object.keys(v).some(k=>reserved.has(k));
const text=(v:unknown,max:number,min=0):v is string=>typeof v==='string'&&v.length>=min&&v.length<=max;
const integer=(v:unknown,min:number,max:number):v is number=>typeof v==='number'&&Number.isInteger(v)&&v>=min&&v<=max;
const id=(v:unknown):v is string=>text(v,128,1)&&/^[\w-]+$/.test(v)&&!reserved.has(v)&&!/^buffer\d+$/.test(v);
export const validTime=(v:unknown):v is string=>typeof v==='string'&&/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(v);
export function validDate(v:unknown):v is string{if(typeof v!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(v)||+v.slice(0,4)<1000)return false;const d=new Date(v+'T12:00:00Z');return Number.isFinite(d.getTime())&&d.toISOString().slice(0,10)===v;}
export const validDue=(v:unknown):v is string=>typeof v==='string'&&(v===''||(v.length===16&&v[10]==='T'&&validDate(v.slice(0,10))&&validTime(v.slice(11))));
export function safeURL(value:string){if(value.length>2048||/[\u0000-\u001f\u007f]/.test(value))return '';try{const u=new URL(value);return ['https:','http:'].includes(u.protocol)&&!u.username&&!u.password?u.href:'';}catch{return '';}}
const uniqueIds=(items:unknown[])=>new Set(items.map(v=>(v as {id:string}).id)).size===items.length;
export function validateBackup(value:unknown):value is Saved{
 if(!record(value)||value.version!==1||typeof value.example!=='boolean')return false;
 const {tasks,fixed,settings:s,targets,receipt,sessions,checks,notes}=value;
 if(!Array.isArray(tasks)||tasks.length>LIMIT||!tasks.every(t=>record(t)&&id(t.id)&&text(t.title,160,1)&&t.title.trim().length>0&&text(t.course,120)&&integer(t.minutes,1,1440)&&integer(t.remaining,0,t.minutes)&&validDue(t.due)&&['high','medium','low'].includes(String(t.priority))&&typeof t.split==='boolean'&&typeof t.done==='boolean'&&text(t.url,2048)&&(t.url===''||!!safeURL(t.url))&&text(t.source,160)&&typeof t.blocked==='boolean')||!uniqueIds(tasks))return false;
 if(!Array.isArray(fixed)||fixed.length>LIMIT||!fixed.every(f=>record(f)&&id(f.id)&&text(f.title,160,1)&&validTime(f.start)&&validTime(f.end)&&f.end>f.start&&(f.date===undefined||validDate(f.date)))||!uniqueIds([...tasks,...fixed]))return false;
 if(!record(s)||!validDate(s.date)||!validTime(s.start)||!validTime(s.end)||!integer(s.buffer,0,180)||!integer(s.lead,0,120)||!validTime(s.quietStart)||!validTime(s.quietEnd)||typeof s.reminders!=='boolean'||typeof s.sound!=='boolean'||typeof s.reduced!=='boolean')return false;
 if(!record(targets)||Object.keys(targets).length>LIMIT||!Object.entries(targets).every(([key,n])=>id(key)&&integer(n,0,1440))||!Array.isArray(receipt)||receipt.length>LIMIT+4||!receipt.every(r=>text(r,500)))return false;
 if(sessions!==undefined&&(!Array.isArray(sessions)||sessions.length>1000||!sessions.every(v=>record(v)&&id(v.id)&&id(v.taskId)&&text(v.title,160,1)&&integer(v.minutes,1,1440)&&text(v.at,40)&&/^\d{4}-\d{2}-\d{2}T/.test(v.at)&&Number.isFinite(Date.parse(v.at)))||!uniqueIds(sessions)))return false;
 const map=(v:unknown,check:(x:unknown)=>boolean)=>record(v)&&Object.keys(v).length<=LIMIT&&Object.entries(v).every(([key,x])=>id(key)&&check(x));
 if(checks!==undefined&&!map(checks,v=>Array.isArray(v)&&v.length<=4&&new Set(v).size===v.length&&v.every(c=>['requirements','files','destination','submitted'].includes(c))))return false;
 return notes===undefined||map(notes,v=>text(v,2000));
}
export function parseAISuggestions(value:unknown):{tasks:Partial<Task>[];questions:string[]}{
 if(!record(value)||!Array.isArray(value.tasks)||value.tasks.length>20)throw new Error('Expected JSON with a tasks array (maximum 20).');
 const tasks=value.tasks.map(t=>{if(!record(t)||!text(t.title,160,1)||!t.title.trim())throw new Error('Every suggested task needs a title of 1–160 characters.');return {title:t.title.trim(),course:typeof t.course==='string'?t.course.slice(0,120):'',minutes:integer(t.minutes,1,1440)?t.minutes:undefined,due:validDue(t.due)?t.due:'',priority:(['high','medium','low'].includes(String(t.priority))?t.priority:'medium') as Task['priority'],source:'AI suggestion, reviewed'};});
 return {tasks,questions:Array.isArray(value.questions)?value.questions.filter((v):v is string=>typeof v==='string').slice(0,3).map(q=>q.slice(0,500)):[]};
}
export function mergeCalendar(existing:Fixed[],incoming:Fixed[],newId:()=>string):Fixed[]{const key=(f:Fixed)=>JSON.stringify([f.title,f.start,f.end,f.date]);const seen=new Set(existing.map(key)),add:Fixed[]=[];for(const f of incoming){const k=key(f);if(seen.has(k))continue;seen.add(k);add.push({...f,id:newId()});}if(existing.length+add.length>LIMIT)throw new Error('A workspace supports up to 300 fixed commitments. Remove older commitments before importing.');return [...existing,...add];}
