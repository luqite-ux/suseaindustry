import {NextRequest,NextResponse} from 'next/server'
import {applyServiceExpiryGuard} from '@/lib/service-expiry-integration'
export async function proxy(request:NextRequest){
  const path=request.nextUrl.pathname
  const serviceExpiryResponse=await applyServiceExpiryGuard(request)
  if(serviceExpiryResponse)return serviceExpiryResponse
  if(path.startsWith('/admin')&&!path.startsWith('/admin/login')&&!path.startsWith('/admin/logout')&&!request.cookies.get('hq_admin_session')?.value)return NextResponse.redirect(new URL('/admin/login',request.url))
  const headers=new Headers(request.headers)
  headers.delete('x-site-locale')
  const match=path.match(/^\/([a-z]{2}(?:-[A-Za-z]{2})?)(\/.*|$)/)
  if(match){
    const response=await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/tenants?id=eq.${process.env.NEXT_PUBLIC_TENANT_ID}&select=supported_languages,default_language`,{headers:{apikey:process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||''},cache:'no-store'})
    if(response.ok){
      const [settings]=await response.json()
      if(settings?.supported_languages?.includes(match[1])){
        headers.set('x-site-locale',match[1])
        const url=request.nextUrl.clone();url.pathname=match[2]||'/'
        return NextResponse.rewrite(url,{request:{headers}})
      }
    }
  }
  return NextResponse.next({request:{headers}})
}
export const config={matcher:['/((?!api|_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|images).*)']}
