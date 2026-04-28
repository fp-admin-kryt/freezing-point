'use client'

import { usePathname } from 'next/navigation'
import { AppNavBar } from '@/components/AppNavBar'

export function NavbarConditional() {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) return null
  return <AppNavBar />
}
