'use client'

export default function SpaceScene() {
  return (
    <div className="three-canvas">
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated stars */}
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute w-2 h-2 bg-cobalt-light rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${4 + Math.random() * 4}s`
            }}
          />
        ))}
        
        {/* Nebula effect */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-cobalt-blue opacity-10 animate-pulse-slow" />
        
        {/* Moving light effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cobalt-light to-transparent opacity-5 animate-gradient-x" />
      </div>
    </div>
  )
} 