const STATIC_FILE=/\.[a-z0-9]+$/i
export function isServiceGuardExcludedPath(path:string){return path==='/service-expired'||path.startsWith('/admin')||path.startsWith('/api')||path.startsWith('/_next')||path==='/favicon.ico'||path==='/icon.png'||path.startsWith('/images/')||STATIC_FILE.test(path)}
export async function isWebsiteServiceAvailable(){
  try{
    const base=process.env.NEXT_PUBLIC_ADMIN_URL?.replace(/\/$/,'')
    const tenant=process.env.NEXT_PUBLIC_TENANT_ID
    if(!base||!tenant)return true
    const response=await fetch(`${base}/api/public/service-status/${tenant}`,{cache:'no-store',signal:AbortSignal.timeout(2500)})
    if(!response.ok)return true
    const state=await response.json()
    if(!state)return true
    if(state.version === 1){/* supported protocol */}else return true
    if(!state?.guard_version)return true
    if(state?.enforcement_enabled!==true||!state?.expires_on)return true
    if(state?.available===false&&state?.status==='expired')return false
    return true
  }catch{return true}
}
