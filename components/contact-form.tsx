"use client"
import { useState, type FormEvent } from "react"
import { InquiryCaptchaField } from "@/components/inquiry-captcha-field"

export function ContactForm() {
  const [status,setStatus]=useState<"idle"|"submitting"|"success"|"error">("idle")
  const [message,setMessage]=useState("")
  const [refreshKey,setRefreshKey]=useState(0)
  const [formKey,setFormKey]=useState(0)
  async function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();if(status==="submitting")return;setStatus("submitting");setMessage("");const form=event.currentTarget;try{const response=await fetch('/api/contact',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(Object.fromEntries(new FormData(form).entries()))});const data=await response.json().catch(()=>null);if(response.ok&&data?.ok){setStatus('success');setMessage('Thank you. Your inquiry has been received.');setFormKey(v=>v+1)}else{setStatus('error');setMessage(data?.error||'Unable to send your inquiry. Please try again.')}}catch{setStatus('error');setMessage('Unable to send your inquiry. Please try again.')}finally{setRefreshKey(v=>v+1)}}
  const input="h-11 rounded-lg border border-border bg-background px-3 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
  return <form key={formKey} onSubmit={submit} className="grid gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
    <div className="grid gap-5 sm:grid-cols-2"><label className="grid gap-2 text-sm font-medium text-foreground">Name<input required name="name" autoComplete="name" className={input}/></label><label className="grid gap-2 text-sm font-medium text-foreground">Business email<input required type="email" name="email" autoComplete="email" className={input}/></label></div>
    <div className="grid gap-5 sm:grid-cols-2"><label className="grid gap-2 text-sm font-medium text-foreground">Company<input required name="company" autoComplete="organization" className={input}/></label><label className="grid gap-2 text-sm font-medium text-foreground">Phone / WhatsApp<input name="phone" autoComplete="tel" className={input}/></label></div>
    <label className="grid gap-2 text-sm font-medium text-foreground">Inquiry details<textarea required name="message" rows={6} placeholder="Tell us the colors, volume, packaging and application you need." className="rounded-lg border border-border bg-background px-3 py-3 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"/></label>
    <label className="flex items-start gap-2 text-sm text-muted-foreground"><input required type="checkbox" name="consent" value="on" className="mt-1"/>I consent to the use of this information to respond to my inquiry.</label>
    <InquiryCaptchaField refreshKey={refreshKey}/>
    {message&&<p role="status" className={`rounded-lg border p-3 text-sm ${status==='success'?'border-green-600 bg-green-50 text-green-900':'border-red-600 bg-red-50 text-red-900'}`}>{message}</p>}
    <button type="submit" disabled={status==='submitting'} className="h-11 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground disabled:opacity-60">{status==='submitting'?'Sending…':'Submit inquiry'}</button>
  </form>
}
