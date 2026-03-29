'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CanvasRevealEffect } from '@/components/ui/sign-in-flow-1'

interface AdminLoginProps {
  onLogin: () => void
}

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (password === 'freezingpoint2024') {
      localStorage.setItem('admin-token', 'authenticated')
      onLogin()
    } else {
      setError('Invalid password')
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Animated dot matrix background */}
      <div className="absolute inset-0 z-0">
        <CanvasRevealEffect
          animationSpeed={3}
          containerClassName="bg-black"
          colors={[
            [255, 255, 255],
            [255, 255, 255],
          ]}
          dotSize={6}
          showGradient={false}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.85)_0%,_transparent_100%)]" />
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-black to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black to-transparent" />
      </div>

      {/* Login form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-sm px-4"
      >
        <div className="border border-white/10 rounded-2xl p-8 bg-black/40 backdrop-blur-md">
          <div className="mb-8 text-center">
            <p className="font-sans text-[10px] tracking-[0.5em] uppercase text-cobalt-light mb-4">
              Admin
            </p>
            <h1 className="font-sans font-light text-3xl text-white mb-2">
              Access Panel
            </h1>
            <p className="font-body text-gray-500 text-sm">
              Enter your password to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-full text-white placeholder-gray-600 font-sans text-sm focus:outline-none focus:border-white/30 transition-colors text-center"
              required
            />

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-sans text-xs text-red-400 text-center"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full bg-white text-black font-medium py-3 hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
            >
              {isLoading ? 'Authenticating…' : 'Login'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminLogin
