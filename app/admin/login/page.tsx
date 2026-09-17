import type {Metadata} from 'next'
export const metadata:Metadata={title:'Customer login',robots:{index:false,follow:false}}
export default async function LoginPage({searchParams}:{searchParams:Promise<{error?:string}>}){
  const {error}=await searchParams
  return <div className="mx-auto w-full max-w-md px-6 py-20"><h1 className="text-3xl font-semibold">Customer login</h1><form action="/api/auth/login" method="post" className="mt-8 space-y-5">
    <div><label htmlFor="email" className="block text-sm font-medium">Email</label><input className="mt-2 h-11 w-full border border-border px-3" id="email" name="email" type="email" autoComplete="username" required /></div>
    <div><label htmlFor="password" className="block text-sm font-medium">Password</label><input className="mt-2 h-11 w-full border border-border px-3" id="password" name="password" type="password" autoComplete="current-password" required /></div>
    {error&&<p role="alert" className="text-sm text-red-800">{error==='invalid'?'The email or password is incorrect.':'Unable to sign in. Please try again.'}</p>}
    <button className="h-11 w-full rounded-lg bg-primary px-6 font-medium text-primary-foreground" type="submit">Sign in</button>
  </form></div>
}
