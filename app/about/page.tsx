'use client'

import { motion } from 'framer-motion'

const pillars = [
  {
    title: 'Research Analysis',
    description: 'Deep dives into groundbreaking AI research papers and their real-world implications.',
    accent: '#136fd7',
  },
  {
    title: 'Industry Signals',
    description: 'Tracking emerging trends and signals that shape the future of AI technology.',
    accent: '#10b981',
  },
  {
    title: 'The Observer',
    description: 'Thoughtful commentary and analysis on the broader AI ecosystem and its impact.',
    accent: '#a855f7',
  },
]

const values = [
  {
    title: 'Accuracy First',
    description: 'We prioritize factual accuracy and thorough research in everything we publish.',
  },
  {
    title: 'Accessibility',
    description: 'Making complex AI concepts understandable without oversimplification.',
  },
  {
    title: 'Forward Thinking',
    description: 'Focusing on emerging technologies and their potential future impact.',
  },
  {
    title: 'Ethical Awareness',
    description: 'Considering the ethical implications and societal impact of AI developments.',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050508] text-white">
      <div className="pt-24 pb-24">
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
              Exploring the frontiers of artificial intelligence, where innovation meets insight.
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
            <p className="font-body text-gray-400 text-base leading-relaxed mb-5 max-w-3xl">
              At Freezing Point AI, every breakthrough begins as an idea in a fluid state, shaped by
              research, exploration, and raw data. The freezing point marks the critical moment when
              abstract insights solidify into real solutions.
            </p>
            <p className="font-body text-gray-500 text-base leading-relaxed max-w-3xl">
              We curate and analyze the latest developments in machine learning, computer vision,
              natural language processing, robotics, and beyond — providing you with insights that
              matter in an ever-evolving technological landscape.
            </p>
          </motion.div>

          {/* What We Do */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="border-t border-white/5 pt-16 mb-20"
          >
            <p className="font-sans text-[10px] tracking-[0.5em] uppercase text-cobalt-light mb-12">
              What We Do
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

          {/* Values */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="border-t border-white/5 pt-16"
          >
            <p className="font-sans text-[10px] tracking-[0.5em] uppercase text-cobalt-light mb-12">
              Our Values
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

        </div>
      </div>
    </div>
  )
}
