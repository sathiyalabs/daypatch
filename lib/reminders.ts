import {localDate,mins,type Task,type Plan,type Settings} from './planner.ts';
export function dueReminders(tasks:Task[],plan:Plan,settings:Settings,now:Date){
 if(!settings.reminders||localDate(now)!==settings.date)return [];
 const minute=now.getHours()*60+now.getMinutes(),start=mins(settings.quietStart),end=mins(settings.quietEnd);
 if(start!==end&&(start>end?minute>=start||minute<end:minute>=start&&minute<end))return [];
 return [...plan.blocks.filter(b=>b.kind==='task').map(b=>({id:'block-'+b.id,time:b.start,title:`Start: ${b.title}`})),...tasks.filter(t=>!t.done&&t.due.startsWith(settings.date)).map(t=>({id:'due-'+t.id,time:mins(t.due.slice(11,16)),title:`Due soon: ${t.title}`}))].filter(a=>a.time-minute<=settings.lead&&a.time-minute>=0).map(a=>({...a,key:settings.date+'-'+a.id+'-'+a.time}));
}
