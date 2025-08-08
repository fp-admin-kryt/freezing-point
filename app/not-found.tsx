'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'

const messages = [
  "Oops! Your neural network took a wrong turn",
  "404: AI couldn't process this request",
  "Error: Consciousness not found in this dimension",
  "The algorithm got lost in the matrix",
  "404: Quantum state undefined",
  "Error: Human.exe has encountered an unexpected input",
  "The AI overlords couldn't find this page",
  "404: Reality.exe has stopped working"
]

const quirkyLines = [
  "Maybe the AI is just having a moment...",
  "Even robots get lost sometimes",
  "This page is in a parallel universe",
  "The neural network needs a coffee break",
  "Error 404: Human not found (just kidding)",
  "The AI is currently rebooting its sense of direction",
  "This page exists in a quantum superposition",
  "The algorithm is having an existential crisis"
]

export default function NotFound() {
  const [currentMessage, setCurrentMessage] = useState(0)
  const [quirky, setQuirky] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, vx: number, vy: number}>>([])
  const [wink, setWink] = useState(false)

  useEffect(() => {
    // Generate floating particles
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2
    }))
    setParticles(newParticles)

    // Animate particles
    const animateParticles = () => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        vx: particle.x <= 0 || particle.x >= window.innerWidth ? -particle.vx : particle.vx,
        vy: particle.y <= 0 || particle.y >= window.innerHeight ? -particle.vy : particle.vy
      })))
    }
    const interval = setInterval(animateParticles, 50)

    // Pick a random message and quirky line on mount
    setCurrentMessage(Math.floor(Math.random() * messages.length))
    setQuirky(Math.floor(Math.random() * quirkyLines.length))

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Wink animation
    const winkInterval = setInterval(() => {
      setWink(true)
      setTimeout(() => setWink(false), 350)
    }, 3500)

    return () => {
      clearInterval(interval)
      clearInterval(winkInterval)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-space-black via-space-gray to-space-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Floating particles */}
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-cobalt-light rounded-full opacity-60"
            style={{
              left: particle.x,
              top: particle.y,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: particle.id * 0.1
            }}
          />
        ))}
        {/* Gradient orbs following mouse */}
        <motion.div
          className="absolute w-96 h-96 bg-gradient-radial from-cobalt-blue to-transparent opacity-20 rounded-full pointer-events-none"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(77, 166, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(77, 166, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }} />
        </div>
      </div>
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        {/* 404 Number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, type: "spring" }}
          className="text-center mb-8"
        >
          <motion.h1
            className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cobalt-blue via-cobalt-light to-cobalt-blue font-montserrat"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              backgroundSize: '200% 200%'
            }}
          >
            404
          </motion.h1>
        </motion.div>
        {/* Animated Logo with winking effect */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-8 flex items-center justify-center"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
            style={{ width: 80, height: 80 }}
          >
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="40" fill="#136fd7" />
              <circle cx="50" cy="50" r={wink ? 2 : 4} fill="#136fd7" />
            </svg>
          </motion.div>
        </motion.div>
        {/* Main Message */}
        <motion.h2
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-4xl font-bold text-white text-center mb-6 max-w-4xl font-montserrat"
        >
          {messages[currentMessage]}
        </motion.h2>
        {/* Quirky Line */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-lg md:text-xl text-gray-300 text-center mb-12 max-w-2xl italic font-montserrat"
        >
          {quirkyLines[quirky]}
        </motion.p>
        {/* Interactive Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <motion.a
            href="/"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-cobalt-blue to-cobalt-light text-white rounded-full font-semibold hover:shadow-lg hover:shadow-cobalt-blue/25 transition-all duration-300"
          >
            <Home className="w-5 h-5" />
            <span>Return Home</span>
          </motion.a>
          <motion.button
            onClick={() => window.history.back()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 px-8 py-4 bg-transparent border-2 border-cobalt-light text-cobalt-light rounded-full font-semibold hover:bg-cobalt-light hover:text-white transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </motion.button>
        </motion.div>
        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-cobalt-light rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        {/* Matrix-style falling characters */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-cobalt-light text-xs font-mono"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-20px'
              }}
              animate={{
                top: '100vh',
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "linear"
              }}
            >
              {['0', '1', 'AI', '404', 'ERROR', 'NULL', '∞', '∑', 'π'][Math.floor(Math.random() * 9)]}
            </motion.div>
          ))}
        </div>
      </div>
      {/* Glitch Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-cobalt-blue to-transparent opacity-0"
          animate={{
            opacity: [0, 0.1, 0],
            x: ['-100%', '100%']
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 5,
            ease: "easeInOut"
          }}
        />
      </div>
    </div>
  )
} 