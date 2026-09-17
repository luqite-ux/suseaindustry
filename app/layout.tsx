import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { getSite } from '@/lib/content-db'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: 'Ningbo Shuzhihai New Materials | PLA Basic 3D Printer Filament',
    template: '%s | Ningbo Shuzhihai New Materials',
  },
  description:
    'Ningbo Shuzhihai New Materials manufactures PLA Basic 3D printer filament with color-masterbatch modification, OEM/ODM, and custom color and packaging solutions for distributors, cross-border sellers, makers, education, and industrial buyers.',
  metadataBase: new URL('https://suseaindustry.com'),
  openGraph: {
    title: 'Ningbo Shuzhihai New Materials | PLA Basic 3D Printer Filament',
    description:
      'PLA Basic filament manufacturer with color-masterbatch modification, OEM/ODM, and custom color and packaging solutions.',
    type: 'website',
  },
  icons: { icon: '/icon.png', apple: '/icon.png' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#152238' },
  ],
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const site=await getSite('en')
  const organization={"@context":"https://schema.org","@type":"Organization","@id":"https://suseaindustry.com/#organization",name:site.legalName,url:'https://suseaindustry.com',logo:site.logo,email:site.email,telephone:site.phone,address:{"@type":"PostalAddress",streetAddress:site.address,addressCountry:'CN'}}
  const website={"@context":"https://schema.org","@type":"WebSite","@id":"https://suseaindustry.com/#website",url:'https://suseaindustry.com',name:site.brand,publisher:{"@id":"https://suseaindustry.com/#organization"},inLanguage:'en'}
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify([organization,website]).replace(/</g,'\\u003c')}} />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
