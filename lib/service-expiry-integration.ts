import { NextRequest, NextResponse } from 'next/server'
import { isServiceGuardExcludedPath, isWebsiteServiceAvailable } from '@/lib/service-expiry-guard'

export async function applyServiceExpiryGuard(request: NextRequest) {
  if (isServiceGuardExcludedPath(request.nextUrl.pathname)) return null
  if (await isWebsiteServiceAvailable()) return null
  return NextResponse.rewrite(new URL('/service-expired', request.url))
}
