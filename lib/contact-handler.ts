type Dependencies = {verify:(body:Record<string,unknown>)=>Promise<{ok:boolean}>;save:(value:Record<string,string>)=>Promise<void>}
export function createContactHandler(dependencies:Dependencies) {
  return async function POST(request:Request) {
    const fail=(error:string,status=400)=>Response.json({ok:false,error},{status,headers:{'Cache-Control':'no-store'}})
    let body:Record<string,unknown>
    try { body=await request.json(); if(!body||typeof body!=='object'||Array.isArray(body))return fail('Invalid inquiry.') } catch { return fail('Invalid inquiry.') }
    try {
      const captcha=await dependencies.verify(body)
      if(!captcha.ok)return fail('The verification code is invalid or expired. Please enter the new code.')
      const text=(key:string,max:number)=>typeof body[key]==='string'?(body[key] as string).trim().slice(0,max):''
      const name=text('name',200),email=text('email',254),company=text('company',300),message=text('message',10000)
      if(!name||!company||!message||!/^\S+@\S+\.\S+$/.test(email)||!['on','true'].includes(text('consent',10)))return fail('Please complete your name, company, email, message and consent.')
      const product=text('product',300),quantity=text('quantity',500)
      await dependencies.save({name,email,company,phone:text('phone',100),subject:product?`Equipment inquiry: ${product}`:'Project inquiry',message:[message,quantity?`Quantity / project needs: ${quantity}`:''].filter(Boolean).join('\n\n')})
      return Response.json({ok:true},{headers:{'Cache-Control':'no-store'}})
    } catch {return fail('Your inquiry could not be sent. Please try again or contact us by email.',503)}
  }
}
