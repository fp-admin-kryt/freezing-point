'use client'

import { motion } from 'framer-motion'

const LogoAnimation = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ 
        duration: 2, 
        ease: "easeOut",
        type: "spring",
        stiffness: 100
      }}
      className="relative"
    >
      {/* Main Logo Circle */}
      <div className="w-32 h-32 md:w-48 md:h-48 relative">
        {/* Outer ring with gradient */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent bg-gradient-to-r from-cobalt-blue via-cobalt-light to-cobalt-blue bg-clip-border animate-gradient-x"></div>
        
        {/* Inner circle */}
        <div className="absolute inset-2 rounded-full bg-space-black border-2 border-cobalt-blue"></div>
        
        {/* Central AI symbol */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-cobalt-blue font-bold text-2xl md:text-4xl font-montserrat">
            AI
          </div>
        </div>
        
        {/* Orbiting elements */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        >
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-cobalt-light rounded-full"
              style={{
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${i * 60}deg) translateY(-60px)`,
              }}
            />
          ))}
        </motion.div>
        
        {/* Pulse effect */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full border border-cobalt-light opacity-30"
        />
      </div>
    </motion.div>
  )
}

export default LogoAnimation 