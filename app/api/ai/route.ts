export const dynamic='force-dynamic';
export async function GET(){return Response.json({available:false,mode:'chatgpt-handoff'},{headers:{'Cache-Control':'private, no-store'}});}
export async function POST(){return Response.json({error:'Live AI is not configured. Use the ChatGPT handoff to generate and review task suggestions. Secure API setup is required to enable a model inside this app.'},{status:503,headers:{'Cache-Control':'private, no-store'}});}
