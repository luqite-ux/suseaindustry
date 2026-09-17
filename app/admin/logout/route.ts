import {NextRequest,NextResponse} from 'next/server'
import {database,tenantId} from '@/lib/content-db'
export async function GET(request:NextRequest){
  const token=request.cookies.get('hq_admin_session')?.value
  if(token){
    const db=database()
    const {data:users}=await db.from('admin_users').select('id').eq('tenant_id',tenantId())
    if(users?.length)await db.from('admin_user_sessions').delete().eq('token',token).in('admin_user_id',users.map(user=>user.id))
  }
  const response=NextResponse.redirect(new URL('/admin/login',request.url),303)
  for(const name of ['hq_admin_session','hq_tenant_id'])response.cookies.set(name,'',{path:'/',maxAge:0})
  return response
}
