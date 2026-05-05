import type { Metadata } from 'next'
import { Space_Grotesk, Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Image from 'next/image'
import PageTransition from '@/components/PageTransition'
import { NavbarConditional } from '@/components/NavbarConditional'
import { Providers } from '@/components/Providers'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-blog',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Freezing Point AI',
  description: 'Ultra modern AI newsletter space exploring the frontiers of technology',
  keywords: 'AI, artificial intelligence, technology, newsletter, research',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${playfairDisplay.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/assets/logos/fp-logo.svg" />
      </head>
      <body>
        <Providers>
        <NavbarConditional />
        <div className="min-h-screen bg-[#050508] flex flex-col">
          <div className="flex-1">
            <PageTransition>{children}</PageTransition>
          </div>
          <footer className="bg-[#050508] py-8 px-4 border-t border-white/5 flex flex-col items-center mb-16 sm:mb-0">
            <Image
              src="/assets/logos/fp-logo.png"
              alt="Freezing Point AI"
              width={32}
              height={32}
              className="mb-3 opacity-60"
            />
            <span className="text-gray-600 font-sans text-xs tracking-widest uppercase">
              © 2026 Freezing Point AI
            </span>
          </footer>
        </div>
        </Providers>
      </body>
    </html>
  )
}
