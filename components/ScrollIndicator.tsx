'use client'

import { motion } from 'framer-motion'

interface ScrollIndicatorProps {
  variant?: 'default' | 'logo' | 'new'
}

const ScrollIndicator = ({ variant = 'default' }: ScrollIndicatorProps) => {
  if (variant === 'new') {
    // New design: two stacked circles with smooth animation
    return (
      <div className="flex flex-col items-center space-y-2">
        {/* Top circle - filled white with white stroke */}
        <motion.div
          animate={{ 
            y: [0, 20, 0],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-4 h-4 bg-white border-2 border-white rounded-full relative z-10"
        />
        {/* Bottom circle - stroke only with small dot inside */}
        <div className="w-4 h-4 border-2 border-white rounded-full relative flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-white rounded-full" />
        </div>
      </div>
    )
  }
  
  if (variant === 'logo') {
    // Use logo variation: full circle moving to stroked circle
    return (
      <div className="flex items-center space-x-4">
        {/* Animated full circle */}
        <motion.div
          animate={{ x: [0, 32, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width={32} height={32} viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" fill="#136fd7" />
          </svg>
        </motion.div>
        {/* Stroked circle with small filled circle inside */}
        <svg width={32} height={32} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="14" stroke="#136fd7" strokeWidth="2.5" fill="none" />
          <circle cx="16" cy="16" r="5" fill="#136fd7" />
        </svg>
      </div>
    )
  }
  
  // Default scroll indicator
  return (
    <div className="flex flex-col items-center space-y-2">
      {/* Target Circle */}
      <div className="relative w-6 h-6">
        {/* Outer circle with stroke */}
        <div className="absolute inset-0 rounded-full border-2 border-cobalt-light"></div>
        {/* Inner filled dot */}
        <div className="absolute inset-2 rounded-full bg-cobalt-light"></div>
      </div>
      {/* Moving dot */}
      <motion.div
        animate={{ 
          y: [0, 20, 0],
          opacity: [0, 1, 0]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-2 h-2 bg-cobalt-light rounded-full"
      />
    </div>
  )
}

export default ScrollIndicator 