'use client'

import { motion } from 'framer-motion'
import NeuralBackground from '@/components/ui/flow-field-background'

const pillars = [
  {
    title: 'Nucleation',
    description: 'Every development begins in an uncertain state, we operate first in the space before consensus exists.',
    accent: '#136fd7',
  },
  {
    title: 'Crystallization',
    description: 'This is where exploration becomes structure, emergent ideas are formalized into frameworks and conceptual models.',
    accent: '#10b981',
  },
  {
    title: 'Solidification',
    description: 'This is where abstraction takes form, and translates into outcomes that inform fields, enable systems, and redefine what is possible.',
    accent: '#a855f7',
  },
]

const values = [
  {
    title: 'Humility',
    description: 'Knowledge begins with recognizing the limits of what we know.',
  },
  {
    title: 'Responsibility',
    description: 'Precision is not a preference, it\'s an obligation.',
  },
  {
    title: 'Curiosity',
    description: 'Every point of certainty exists within a wider field of possibility.',
  },
  {
    title: 'Consequence',
    description: 'The value of an idea is inseparable from the consequences it creates.',
  },
]

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-[#050508] text-white overflow-hidden">
      <NeuralBackground className="z-0 opacity-35" color="#6366f1" trailOpacity={0.12} particleCount={500} />
      <div className="relative z-10 pt-24 pb-24">
        <div className="container mx-auto px-4 max-w-4xl">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-20"
          >
            <p className="font-sans text-[10px] tracking-[0.5em] uppercase text-cobalt-light mb-5">
              Who We Are
            </p>
            <h1 className="font-sans font-light text-5xl md:text-7xl text-white leading-none tracking-tight mb-6">
              Freezing Point
            </h1>
            <p className="font-body text-gray-500 max-w-xl text-sm leading-relaxed">
              Crystallizing Innovation.
            </p>
          </motion.div>

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="border-t border-white/5 pt-16 mb-20"
          >
            <p className="font-sans text-[10px] tracking-[0.5em] uppercase text-cobalt-light mb-8">
              Our Mission
            </p>
            <p className="font-body text-gray-400 text-base leading-relaxed max-w-3xl">
              Freezing Point is a multi-domain research platform focused on the ideas that precede breakthroughs. It explores the conceptual work that emerges before a field has the language to define its needs. We move beyond the present to explore what the future demands and translate uncertainty into possibility spaces, shaping conceptual architectures for systems that have not yet entered reality.
            </p>
          </motion.div>

          {/* Our Method */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="border-t border-white/5 pt-16 mb-20"
          >
            <p className="font-sans text-[10px] tracking-[0.5em] uppercase text-cobalt-light mb-12">
              Our Method
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pillars.map((pillar, i) => (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                  className="border border-white/8 rounded-xl p-6"
                >
                  <div
                    className="w-0.5 h-8 rounded-full mb-5"
                    style={{ background: `linear-gradient(to bottom, ${pillar.accent}, transparent)` }}
                  />
                  <h3 className="font-sans text-sm font-medium text-white mb-3">{pillar.title}</h3>
                  <p className="font-body text-gray-500 text-sm leading-relaxed">{pillar.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Our Virtues */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="border-t border-white/5 pt-16 mb-20"
          >
            <p className="font-sans text-[10px] tracking-[0.5em] uppercase text-cobalt-light mb-12">
              Our Virtues
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, i) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.08 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-px h-12 bg-gradient-to-b from-cobalt-blue/60 to-transparent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-sans text-sm font-medium text-white mb-2">{value.title}</h4>
                    <p className="font-body text-gray-500 text-sm leading-relaxed">{value.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Founder Quote */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="border-t border-white/5 pt-16"
          >
            <blockquote className="max-w-2xl">
              <p className="font-display text-2xl md:text-3xl font-light text-white/80 leading-snug tracking-tight mb-6">
                &ldquo;Every idea we pursue exists to change something that matters.&rdquo;
              </p>
              <cite className="font-sans text-[10px] tracking-[0.4em] uppercase text-cobalt-light not-italic">
                Founder, Freezing Point
              </cite>
            </blockquote>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
