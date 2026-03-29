'use client'

import React, { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface NeuralBackgroundProps {
  className?: string
  color?: string
  trailOpacity?: number
  particleCount?: number
  speed?: number
}

export default function NeuralBackground({
  className,
  color = '#6366f1',
  trailOpacity = 0.15,
  particleCount = 600,
  speed = 1,
}: NeuralBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = container.clientWidth
    let height = container.clientHeight
    let particles: Particle[] = []
    let animationFrameId: number

    class Particle {
      x: number
      y: number
      vx: number
      vy: number
      age: number
      life: number

      constructor() {
        this.x = Math.random() * width
        this.y = Math.random() * height
        this.vx = 0
        this.vy = 0
        this.age = 0
        this.life = Math.random() * 200 + 100
      }

      update() {
        const angle = (Math.cos(this.x * 0.005) + Math.sin(this.y * 0.005)) * Math.PI

        this.vx += Math.cos(angle) * 0.2 * speed
        this.vy += Math.sin(angle) * 0.2 * speed

        this.x += this.vx
        this.y += this.vy
        this.vx *= 0.95
        this.vy *= 0.95

        this.age++
        if (this.age > this.life) {
          this.reset()
        }

        if (this.x < 0) this.x = width
        if (this.x > width) this.x = 0
        if (this.y < 0) this.y = height
        if (this.y > height) this.y = 0
      }

      reset() {
        this.x = Math.random() * width
        this.y = Math.random() * height
        this.vx = 0
        this.vy = 0
        this.age = 0
        this.life = Math.random() * 200 + 100
      }

      draw(context: CanvasRenderingContext2D) {
        context.fillStyle = color
        const alpha = 1 - Math.abs(this.age / this.life - 0.5) * 2
        context.globalAlpha = alpha
        context.fillRect(this.x, this.y, 1.5, 1.5)
      }
    }

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
    }

    const init = () => {
      resizeCanvas()
      particles = []
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle())
      }
    }

    const animate = () => {
      ctx.fillStyle = `rgba(5, 5, 8, ${trailOpacity})`
      ctx.globalAlpha = 1
      ctx.fillRect(0, 0, width, height)

      particles.forEach((p) => {
        p.update()
        p.draw(ctx)
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    const handleResize = () => {
      width = container.clientWidth
      height = container.clientHeight
      resizeCanvas()
    }

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container)

    init()
    animate()

    return () => {
      resizeObserver.disconnect()
      cancelAnimationFrame(animationFrameId)
    }
  }, [color, trailOpacity, particleCount, speed])

  return (
    <div ref={containerRef} className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  )
}
