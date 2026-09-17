import Link from "next/link"
import Image from "next/image"
import { navLinks } from "@/lib/site-config"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <Image src="/images/logo.png" alt="Ningbo Shuzhihai New Materials logo" width={32} height={32} className="h-8 w-8" />
              <span className="text-sm font-semibold text-foreground">Shuzhihai New Materials</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              PLA Basic 3D printer filament, color masterbatch modification, and OEM/ODM material solutions for
              global buyers.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Navigate</h3>
            <ul className="mt-3 space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Solutions</h3>
            <ul className="mt-3 space-y-2">
              <li><Link href="/products" className="text-sm text-muted-foreground transition-colors hover:text-foreground">PLA Basic filament</Link></li>
              <li><Link href="/capabilities" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Color &amp; masterbatch</Link></li>
              <li><Link href="/capabilities" className="text-sm text-muted-foreground transition-colors hover:text-foreground">OEM / ODM</Link></li>
              <li><Link href="/applications" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Applications</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Contact</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Ningbo, Zhejiang, China</li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-foreground">
                  Submit an inquiry
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Ningbo Shuzhihai New Materials Co., Ltd. All rights reserved.</p>
          <p>Manufacturer of PLA Basic 3D printer filament and custom material solutions.</p>
        </div>
      </div>
    </footer>
  )
}
