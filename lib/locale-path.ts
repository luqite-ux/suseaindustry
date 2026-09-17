export function localePath(href:string,locale:string,defaultLanguage:string){
  if(locale===defaultLanguage||!href.startsWith('/')||href.startsWith('//')||/^\/(?:api|admin|_next)(?:\/|$)/.test(href)||/^\/[a-z]{2}(?:-[A-Za-z]{2})?(?:\/|$)/.test(href))return href
  return `/${locale}${href==='/'?'':href}`
}

export function localized<T>(value:Record<string,T>|null|undefined,locale:string,defaultLanguage:string,legacy:T):T{
  const usable=(v:T|undefined)=>v!==undefined&&v!==null&&v!==''&&(!Array.isArray(v)||v.length>0)
  // Never select an unrelated language by JSON property order.
  for(const candidate of [value?.[locale],value?.[defaultLanguage]])if(usable(candidate))return candidate as T
  // Legacy fields in this English-first site must not leak untranslated CJK.
  if(locale==='en'&&/[\u3400-\u9fff\u3040-\u30ff\uac00-\ud7af]/u.test(JSON.stringify(legacy)))return (Array.isArray(legacy)?[]:'') as T
  return legacy
}
