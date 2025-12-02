'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'explore') {
      // Go to home page and scroll to explore section
      window.location.href = '/#explore'
    } else if (sectionId === 'research') {
      // Go to research page
      window.location.href = '/research'
    } else if (sectionId === 'radar') {
      // Go to radar page
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

            {/* Navigation Menu - Center Aligned */}
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

            {/* Right side - placeholder for balance */}
            <div className="w-24" />
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navigation 