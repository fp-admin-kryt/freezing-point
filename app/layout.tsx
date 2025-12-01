import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Image from 'next/image'

const inter = Inter({ subsets: ['latin'] })

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
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/assets/logos/fp-logo.svg" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-space-black to-space-gray flex flex-col">
          <div className="flex-1">{children}</div>
          <footer className="bg-space-black py-8 px-4 border-t border-gray-800 flex flex-col items-center">
            <Image
              src="/assets/logos/fp-logo.png"
              alt="Freezing Point AI"
              width={36}
              height={36}
              className="mb-2"
            />
            <span className="text-gray-400 font-montserrat text-sm">© 2025 Freezing Point AI. All rights reserved.</span>
          </footer>
        </div>
      </body>
    </html>
  )
} 