// Deliberately limited CSP: the framework streams inline hydration scripts.
// Full script-src enforcement needs nonce integration and is not claimed here.
export function secureResponse(response:Response,https=true):Response{
 if(response.status===101)return response;
 const headers=new Headers(response.headers);
 headers.set('X-Content-Type-Options','nosniff');
 headers.set('Referrer-Policy','no-referrer');
 headers.set('Permissions-Policy','camera=(), microphone=(), geolocation=()');
 headers.append('Content-Security-Policy',"object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'");
 headers.set('X-Frame-Options','SAMEORIGIN');
 if(https)headers.set('Strict-Transport-Security','max-age=31536000');
 return new Response(response.body,{status:response.status,statusText:response.statusText,headers});
}
