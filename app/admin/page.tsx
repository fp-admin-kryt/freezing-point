'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import AdminLogin from '@/components/admin/AdminLogin'
import AdminDashboard from '@/components/admin/AdminDashboard'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if admin is already authenticated
    const token = localStorage.getItem('admin-token')
    if (token) {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-space-black">
        <div className="text-cobalt-light font-montserrat">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-space-black">
      {!isAuthenticated ? (
        <AdminLogin onLogin={() => setIsAuthenticated(true)} />
      ) : (
        <AdminDashboard />
      )}
    </div>
  )
} 