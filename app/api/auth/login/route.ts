import {NextRequest,NextResponse} from 'next/server'
import bcrypt from 'bcryptjs'
import {randomUUID} from 'node:crypto'
import {database,tenantId} from '@/lib/content-db'
export const runtime='nodejs'
export async function POST(request:NextRequest){
  const fail=(code:string)=>NextResponse.redirect(new URL(`/admin/login?error=${code}`,request.url),303)
  try {
    const form=await request.formData()
    const email=String(form.get('email')||'').trim().toLowerCase(),password=String(form.get('password')||'')
    if(!email||!password||password.length>1024)return fail('invalid')
    const db=database(),tenant=tenantId()
    const {data:user,error}=await db.from('admin_users').select('id,password_hash').eq('email',email).eq('tenant_id',tenant).eq('is_active',true).maybeSingle()
    if(error||!user||!await bcrypt.compare(password,user.password_hash))return fail('invalid')
    const token=randomUUID(),expires=new Date(Date.now()+7*86400000)
    const session=await db.from('admin_user_sessions').insert({admin_user_id:user.id,token,expires_at:expires.toISOString(),ip:request.headers.get('x-forwarded-for')?.split(',')[0]?.trim(),user_agent:request.headers.get('user-agent')})
    if(session.error)return fail('unavailable')
    await db.from('admin_users').update({last_login_at:new Date().toISOString()}).eq('id',user.id).eq('tenant_id',tenant)
    const response=NextResponse.redirect(new URL('/admin',request.url),303)
    for(const [name,value] of [['hq_admin_session',token],['hq_tenant_id',tenant]])response.cookies.set(name,value,{httpOnly:true,secure:request.nextUrl.protocol==='https:',sameSite:'lax',path:'/',expires})
    return response
  }catch{return fail('unavailable')}
}
