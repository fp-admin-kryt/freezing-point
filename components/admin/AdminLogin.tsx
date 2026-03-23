'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { GradientButton } from '@/components/ui/gradient-button'

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
    <div className="min-h-screen flex items-center justify-center bg-[#050508]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm px-4"
      >
        <div className="border border-white/8 rounded-2xl p-8">
          <div className="mb-8">
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
              className="w-full px-4 py-3 bg-transparent border border-white/8 rounded-lg text-white placeholder-gray-700 font-sans text-sm focus:outline-none focus:border-cobalt-blue/50 transition-colors"
              required
            />

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-sans text-xs text-red-400"
              >
                {error}
              </motion.p>
            )}

            <GradientButton
              type="submit"
              disabled={isLoading}
              className="w-full !min-w-0 !px-6 !py-3 !text-sm !rounded-lg !font-light"
            >
              {isLoading ? 'Authenticating…' : 'Login'}
            </GradientButton>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminLogin
