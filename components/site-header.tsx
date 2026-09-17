"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { navLinks } from "@/lib/site-config"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 shrink-0" onClick={() => setOpen(false)}>
          <Image src="/images/logo.png" alt="Ningbo Shuzhihai New Materials logo" width={36} height={36} className="h-9 w-9" priority />
          <span className="text-sm font-semibold leading-tight text-foreground sm:text-base">
            Shuzhihai
            <span className="block text-[11px] font-medium text-muted-foreground sm:text-xs">New Materials</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {navLinks.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-150",
                  active ? "bg-primary text-primary-foreground" : "text-foreground/80 hover:bg-secondary hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden lg:block">
          <Button asChild size="sm" className="gap-1.5">
            <Link href="/contact">
              Request a quote
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-md text-foreground lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background px-4 pb-4 pt-2 lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {navLinks.map((link) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-2.5 text-sm font-medium transition-colors duration-150",
                    active ? "bg-primary text-primary-foreground" : "text-foreground/85 hover:bg-secondary",
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
          <Button asChild size="sm" className="mt-3 w-full gap-1.5">
            <Link href="/contact" onClick={() => setOpen(false)}>
              Request a quote
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      )}
    </header>
  )
}
