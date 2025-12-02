'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { MoreVertical, X } from 'lucide-react'

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    setMenuOpen(false)
    if (sectionId === 'explore') {
      window.location.href = '/#explore'
    } else if (sectionId === 'research') {
      window.location.href = '/research'
    } else if (sectionId === 'radar') {
      window.location.href = '/radar'
    }
  }

  const menuItems = [
    { id: 'explore', label: 'About', disabled: false },
    { id: 'research', label: 'Research', disabled: false },
    { id: 'radar', label: 'Radar', disabled: false },
    { id: 'product', label: 'Product', disabled: true },
  ]

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'py-3' : 'py-6'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="glass-morphism rounded-full px-6 py-3 flex items-center justify-between">
              {/* Logo as link to home */}
              <a href="/" className="flex items-center group">
                <Image
                  src="/assets/logos/fp-logo.png"
                  alt="Freezing Point AI"
                  width={32}
                  height={32}
                  className="transition-transform group-hover:scale-110"
                />
              </a>

              {/* Center desktop navigation + right spacer */}
              <div className="hidden md:flex items-center justify-center flex-1">
                <div className="flex items-center space-x-8">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => !item.disabled && scrollToSection(item.id)}
                      disabled={item.disabled}
                      className={`font-montserrat-alternates transition-colors duration-200 ${
                        item.disabled
                          ? 'text-gray-500 cursor-not-allowed'
                          : 'text-white hover:text-cobalt-light cursor-pointer'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right side: kebab on mobile, spacer on desktop */}
              <div className="flex items-center justify-end w-10 md:w-24">
                <button
                  type="button"
                  className="md:hidden flex items-center justify-center p-2 rounded-full text-white hover:bg-white/10 transition-colors"
                  onClick={() => setMenuOpen(true)}
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-space-black/95 backdrop-blur-lg md:hidden flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-4">
              <a href="/" className="flex items-center">
                <Image
                  src="/assets/logos/fp-logo.png"
                  alt="Freezing Point AI"
                  width={32}
                  height={32}
                />
              </a>
              <button
                type="button"
                className="p-2 rounded-full text-white hover:bg-white/10 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center space-y-8">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => !item.disabled && scrollToSection(item.id)}
                  disabled={item.disabled}
                  className={`text-2xl font-montserrat-alternates ${
                    item.disabled
                      ? 'text-gray-600 cursor-not-allowed'
                      : 'text-white hover:text-cobalt-light'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navigation