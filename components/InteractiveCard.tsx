'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface InteractiveCardProps {
  icon: LucideIcon
  title: string
  description: string
  link: string
  color: string
  onClick?: () => void
}

const InteractiveCard = ({ icon: Icon, title, description, color, onClick }: InteractiveCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      setMousePosition({ x, y })
      
      cardRef.current.style.setProperty('--mouse-x', `${x}%`)
      cardRef.current.style.setProperty('--mouse-y', `${y}%`)
    }
  }

  const handleMouseLeave = () => {
    setMousePosition({ x: 50, y: 50 })
    if (cardRef.current) {
      cardRef.current.style.setProperty('--mouse-x', '50%')
      cardRef.current.style.setProperty('--mouse-y', '50%')
    }
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="interactive-card rounded-2xl p-8 hover:shadow-xl transition-all duration-300 group relative overflow-hidden cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={{ 
        scale: 1.02,
        rotateX: (mousePosition.y - 50) * 0.1,
        rotateY: (mousePosition.x - 50) * 0.1
      }}
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      {/* Mouse light effect */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 255, 255, 0.15) 0%, transparent 50%)`,
        }}
      />

      {/* Icon */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-2xl font-bold text-white mb-4 font-montserrat group-hover:text-cobalt-light transition-colors">
          {title}
        </h3>
        <p className="text-gray-300 leading-relaxed text-sm font-montserrat">
          {description}
        </p>
      </div>

      <style jsx>{`
        .interactive-card {
          --mouse-x: 50%;
          --mouse-y: 50%;
        }
      `}</style>
    </motion.div>
  )
}

export default InteractiveCard 