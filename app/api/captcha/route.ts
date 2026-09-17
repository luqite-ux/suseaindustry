import {createSupabaseCaptchaContextFromEnv,issueCaptchaChallenge} from '@/lib/inquiry-captcha'
export const runtime='nodejs'
export const dynamic='force-dynamic'
export async function GET(request:Request){
  const headers={'Cache-Control':'no-store, max-age=0'}
  const scope=new URL(request.url).searchParams.get('scope')||''
  if(!/^[A-Za-z0-9_-]{16,160}$/.test(scope))return Response.json({error:'Invalid verification request.'},{status:400,headers})
  try {
    const {svg,token,expiresAt}=await issueCaptchaChallenge({secret:process.env.CAPTCHA_SECRET||'',scope,...createSupabaseCaptchaContextFromEnv()})
    return Response.json({svg,token,expiresAt},{headers})
  } catch {return Response.json({error:'Verification is temporarily unavailable. Please try again.'},{status:503,headers})}
}
