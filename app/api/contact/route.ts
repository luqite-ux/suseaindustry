import { createContactHandler } from '@/lib/contact-handler'
import { createSupabaseCaptchaContextFromEnv, verifyCaptchaSubmission } from '@/lib/inquiry-captcha'
import { database, tenantId } from '@/lib/content-db'

export const runtime = 'nodejs'
export const POST = createContactHandler({
  async verify(body) {
    const text=(key:string)=>typeof body[key]==='string'?body[key] as string:''
    return verifyCaptchaSubmission({secret:process.env.CAPTCHA_SECRET||'',...createSupabaseCaptchaContextFromEnv(),scope:text('captchaScope'),token:text('captchaToken'),answer:text('captchaAnswer')})
  },
  async save(value) {
    const {error}=await database().from('inquiries').insert({...value,tenant_id:tenantId(),status:'new'})
    if(error)throw new Error('Inquiry storage failed')
  },
})
