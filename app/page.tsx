'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { Target, PlusCircle, Radar, Eye, ArrowRight, ChevronDown, Plus } from 'lucide-react'
import { getResearchPosts, getSignalPosts, getObserverPosts, getRadarPosts, incrementHomepageViews } from '@/lib/firebase'
import { getTagById } from '@/lib/dataService'
import Image from 'next/image'
import { SparklesCore } from '@/components/ui/sparkles'
import { DottedSurface } from '@/components/ui/dotted-surface'
import NeuralBackground from '@/components/ui/flow-field-background'

function CtaCard({ href, title, subtitle, delay = 0.3 }: { href: string; title: string; subtitle: string; delay?: number }) {
  const controls = useAnimation()
  return (
    <motion.a
      href={href}
      onHoverStart={() => controls.start({ rotate: 360, transition: { duration: 2.5, repeat: Infinity, ease: 'linear' } })}
      onHoverEnd={() => controls.stop()}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="flex-shrink-0 flex flex-col items-center justify-center cursor-pointer gap-3 self-center"
      style={{ width: '160px', maxWidth: '80vw' }}
    >
      <div className="relative w-9 h-9 flex items-center justify-center">
        <motion.div animate={controls} className="absolute inset-0 rounded-full border border-white/20" />
        <ArrowRight className="w-4 h-4 text-white/35" />
      </div>
      <div className="text-center">
        <p className="font-sans text-xs font-light text-white/35">{title}</p>
        <p className="font-sans text-[9px] tracking-[0.35em] uppercase text-white/20 mt-0.5">{subtitle}</p>
      </div>
    </motion.a>
  )
}

export default function Home() {
  const [researchPosts, setResearchPosts] = useState<any[]>([])
  const [signalPosts, setSignalPosts] = useState<any[]>([])
  const [observerPosts, setObserverPosts] = useState<any[]>([])
  const [radarPosts, setRadarPosts] = useState<any[]>([])
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null)

  useEffect(() => {
    incrementHomepageViews()
    const loadData = async () => {
      try {
        const [research, signals, observers, radar] = await Promise.all([
          getResearchPosts(),
          getSignalPosts(),
          getObserverPosts(),
          getRadarPosts(),
        ])
        setResearchPosts(research)
        setSignalPosts(signals)
        setObserverPosts(observers)
        setRadarPosts(radar)
      } catch (error) {
        console.error('Error loading home data:', error)
      }
    }
    loadData()
  }, [])

  const heroCards = [
    {
      icon: Target,
      title: 'Impact',
      description: 'Every breakthrough begins as an idea in flux, unstable, unformed, and boundless in its possibility. Freezing Point is the threshold of change, where abstract thinking solidifies into tangible outcomes that redefine what is possible.',
      link: '/research',
      accent: '#136fd7',
    },
    {
      icon: PlusCircle,
      title: 'Research',
      description: 'Charting the unknown through research directions and conceptual frameworks.',
      link: '/research',
      accent: '#10b981',
    },
    {
      icon: Radar,
      title: 'Radar',
      description: 'Signals shaping the next era of intelligent systems.',
      link: '/radar',
      accent: '#a855f7',
    },
    {
      icon: Eye,
      title: 'Health',
      description: 'Health represents one of our key domains of exploration, where AI holds the potential to drive transformative impact. The convergence of artificial intelligence, healthcare data, and computational power has created possibilities that existing frameworks are not yet fully equipped to address, opening new pathways for care and systems-level transformation.',
      link: '/radar',
      accent: '#f97316',
    },
  ]

  return (
    <main className="min-h-screen bg-[#050508] text-white">

      {/* ── Hero ── */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Sparkles layer */}
        <div className="absolute inset-0 w-full h-full">
          <SparklesCore
            background="transparent"
            minSize={0.3}
            maxSize={1.1}
            particleDensity={65}
            className="w-full h-full"
            particleColor="#FFFFFF"
            speed={0.5}
          />
        </div>

        {/* Vignette — darkens perimeter, keeps center readable */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,transparent_20%,#050508_90%)]" />

        {/* Content */}
        <div className="relative z-10 text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
            className="font-sans font-light text-white leading-none tracking-tight"
            style={{ fontSize: 'clamp(3.5rem, 12vw, 11rem)' }}
          >
            Freezing Point
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="mt-6 flex items-center justify-center gap-5"
          >
            <div className="h-px w-6 sm:w-14 bg-gradient-to-r from-transparent to-cobalt-light/50" />
            <p className="font-sans text-[10px] tracking-[0.3em] sm:tracking-[0.65em] uppercase text-gray-500 whitespace-nowrap">
              AI &nbsp;&middot;&nbsp; Research &nbsp;&middot;&nbsp; Health
            </p>
            <div className="h-px w-6 sm:w-14 bg-gradient-to-l from-transparent to-cobalt-light/50" />
          </motion.div>

          {/* Gradient accent lines */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1.2, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative mt-10 mx-auto"
            style={{ width: 'min(38rem, 88vw)', height: '6px' }}
          >
            {/* Wide cobalt base — gentle opacity pulse */}
            <motion.div
              className="absolute inset-x-16 top-0 w-3/4"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
            >
              <div className="bg-gradient-to-r from-transparent via-cobalt-blue to-transparent h-[2px] blur-sm" />
              <div className="bg-gradient-to-r from-transparent via-cobalt-blue to-transparent h-px" />
            </motion.div>

            {/* Bright core — drifts left / right */}
            <motion.div
              className="absolute top-0 w-1/4"
              style={{ left: '50%', x: '-50%' }}
              animate={{ x: ['-60%', '-40%', '-60%'] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            >
              <div className="bg-gradient-to-r from-transparent via-cobalt-light to-transparent h-[5px] blur-md" />
              <div className="bg-gradient-to-r from-transparent via-cobalt-light to-transparent h-px" />
            </motion.div>

            <div className="absolute inset-0 [mask-image:radial-gradient(280px_30px_at_center,transparent_40%,white)]" style={{ background: '#050508' }} />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="font-sans text-[9px] tracking-[0.5em] uppercase text-gray-600">Scroll</span>
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-4 h-4 text-gray-700" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Mission / Pillars ── */}
      <section id="explore" className="relative py-28 px-4 border-t border-white/5">
        <NeuralBackground className="z-0 opacity-40" color="#6366f1" trailOpacity={0.12} particleCount={500} />
        <div className="relative z-10 container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <p className="font-sans text-[10px] tracking-[0.5em] uppercase text-cobalt-light mb-5">
              Our Pillars
            </p>
            <h2 className="font-display text-5xl md:text-6xl font-bold text-white leading-tight">
              What We Do
            </h2>
          </motion.div>

          <div>
            {heroCards.map((card, index) => {
              const Icon = card.icon
              const isOpen = activeAccordion === card.title

              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                  className="border-b border-white/8 last:border-0"
                >
                  <button
                    onClick={() => setActiveAccordion(isOpen ? null : card.title)}
                    className="w-full flex items-center justify-between py-8 text-left group"
                  >
                    <div className="flex items-center gap-5">
                      <div
                        className="w-0.5 h-9 rounded-full flex-shrink-0 transition-opacity duration-300"
                        style={{
                          background: `linear-gradient(to bottom, ${card.accent}, transparent)`,
                          opacity: isOpen ? 1 : 0.4,
                        }}
                      />
                      <span
                        className="font-sans text-3xl md:text-4xl font-light text-white/80 group-hover:text-white transition-colors duration-300"
                        style={{ color: isOpen ? 'white' : undefined }}
                      >
                        {card.title}
                      </span>
                    </div>
                    <div
                      className={`w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                        isOpen
                          ? 'border-white/20 rotate-45'
                          : 'border-white/10 group-hover:border-white/20'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5 text-white/40" />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pb-10 pl-7">
                          <p className="font-body text-gray-400 leading-relaxed mb-6 max-w-2xl text-sm md:text-base">
                            {card.description}
                          </p>
                          <a
                            href={card.link}
                            className="inline-flex items-center gap-2 font-sans text-[10px] tracking-[0.4em] uppercase text-cobalt-light hover:text-white transition-colors duration-200"
                          >
                            Explore <ArrowRight className="w-3 h-3" />
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Research ── */}
      <section id="research" className="relative py-28 px-4 border-t border-white/5 overflow-hidden">
        <DottedSurface className="absolute inset-0 z-0 opacity-30" />
        <div className="relative z-10 container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <p className="font-sans text-[10px] tracking-[0.5em] uppercase text-cobalt-light mb-5">
              Publications
            </p>
            <div className="flex items-baseline gap-6 mb-4">
              <h2 className="font-display text-5xl md:text-6xl font-bold text-white">Research</h2>
              <a
                href="/research"
                className="font-sans text-[10px] tracking-[0.4em] uppercase text-gray-500 hover:text-cobalt-light transition-colors flex items-center gap-2"
              >
                View All <ArrowRight className="w-3 h-3" />
              </a>
            </div>
            <p className="font-body text-gray-500 max-w-xl text-sm">
              Charting the unknown through research directions and conceptual frameworks.
            </p>
          </motion.div>

          <div
            className="overflow-auto horizontal-scroll"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex gap-4 py-2 pb-4 items-end" style={{ minWidth: 'max-content' }}>
              {(() => {
                const sorted = [...researchPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                return sorted.slice(0, 3).map((post, index) => (
                  <motion.div
                    key={post.id || `research-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.06 }}
                    className="flex-shrink-0"
                  >
                    <a
                      href={`/research/${post.id}`}
                      className="img-card group relative block overflow-hidden rounded-2xl cursor-pointer"
                      style={{ width: '480px', height: '270px', maxWidth: '85vw' }}
                    >
                      {post.imageUrl ? (
                        <Image
                          src={post.imageUrl}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-700 max-sm:scale-105 sm:group-hover:scale-105"
                          sizes="480px"
                          priority={index === 0}
                        />
                      ) : (
                        <div
                          className="absolute inset-0"
                          style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0d2452 50%, #0a1628 100%)' }}
                        >
                          <div className="absolute inset-0 opacity-25"
                            style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 80%, #136fd7 0%, transparent 70%)' }} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent max-sm:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Tags */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1 z-10">
                        {post.tags.slice(0, 1).map((tagId: string) => {
                          const tag = getTagById(tagId)
                          return tag ? (
                            <span key={tagId} className="px-1.5 py-0.5 font-sans text-[8px] tracking-wider rounded-full backdrop-blur-sm"
                              style={{ backgroundColor: tag.color + '33', border: `1px solid ${tag.color}55`, color: tag.color }}>
                              {tag.name}
                            </span>
                          ) : null
                        })}
                      </div>

                      {/* Title + excerpt */}
                      <div className="img-card-title absolute bottom-0 left-0 right-0 px-4 pb-5 z-10">
                        <h3 className="font-sans text-xs font-medium text-white line-clamp-2 leading-snug">
                          {post.title}
                        </h3>
                        <p className="font-body text-gray-500 text-[10px] mt-1">
                          {post.author} · {new Date(post.date).toLocaleDateString()}
                        </p>
                        <div className="img-card-excerpt">
                          <p className="font-body text-gray-300 text-[11px] leading-relaxed line-clamp-2 mt-2.5">
                            {post.excerpt}
                          </p>
                          <span className="font-sans text-[9px] tracking-[0.35em] uppercase text-cobalt-light flex items-center gap-1 mt-2">
                            Read <ArrowRight className="w-2.5 h-2.5" />
                          </span>
                        </div>
                      </div>
                    </a>
                  </motion.div>
                ))
              })()}

              <CtaCard href="/research" title="All Research" subtitle="View all papers" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Radar ── */}
      <section id="radar" className="relative py-28 px-4 border-t border-white/5 overflow-hidden">
        {/* CSS dot-grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(19,111,215,0.35) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
          }}
        />

        <div className="relative z-10 container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <p className="font-sans text-[10px] tracking-[0.5em] uppercase text-cobalt-light mb-5">
              Intelligence
            </p>
            <div className="flex items-baseline gap-6 mb-4">
              <h2 className="font-display text-5xl md:text-6xl font-bold text-white">Radar</h2>
              <a
                href="/radar"
                className="font-sans text-[10px] tracking-[0.4em] uppercase text-gray-500 hover:text-cobalt-light transition-colors flex items-center gap-2"
              >
                View All <ArrowRight className="w-3 h-3" />
              </a>
            </div>
            <p className="font-body text-gray-500 max-w-xl text-sm">
              Signals shaping the next era of intelligent systems.
            </p>
          </motion.div>

          {/* Combined signals + observer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div
              className="overflow-auto horizontal-scroll"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div className="flex gap-4 py-2 pb-4 items-end" style={{ minWidth: 'max-content' }}>
                {[
                  ...radarPosts.map((p) => ({ ...p, _type: 'Radar' as const })),
                  ...signalPosts.map((p) => ({ ...p, _type: 'Signal' as const })),
                  ...observerPosts.map((p) => ({ ...p, _type: 'Observer' as const })),
                ]
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 3)
                  .map((post, index) => (
                    <motion.div
                      key={post.id || `radar-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.06 }}
                      className="flex-shrink-0"
                    >
                      <a
                        href={`/radar/${post.id}`}
                        className="img-card group relative block overflow-hidden rounded-2xl cursor-pointer"
                        style={{ width: '480px', height: '270px', maxWidth: '85vw' }}
                      >
                        {post.imageUrl ? (
                          <Image
                            src={post.imageUrl}
                            alt={post.heading}
                            fill
                            className="object-cover transition-transform duration-700 max-sm:scale-105 sm:group-hover:scale-105"
                            sizes="480px"
                          />
                        ) : (
                          <div
                            className="absolute inset-0"
                            style={{ background: `linear-gradient(160deg, #050a14 0%, #0c1a2e 40%, #0a2040 70%, #081830 100%)` }}
                          >
                            <div className="absolute inset-0 opacity-25"
                              style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 80%, #136fd7 0%, transparent 70%)' }} />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent max-sm:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Tags + type badge */}
                        <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-10">
                          <div className="flex flex-wrap gap-1">
                            {post.tags.slice(0, 1).map((tagId: string) => {
                              const tag = getTagById(tagId)
                              return tag ? (
                                <span key={tagId} className="px-1.5 py-0.5 font-sans text-[8px] tracking-wider rounded-full backdrop-blur-sm"
                                  style={{ backgroundColor: tag.color + '33', border: `1px solid ${tag.color}55`, color: tag.color }}>
                                  {tag.name}
                                </span>
                              ) : null
                            })}
                          </div>
                          <span className="font-sans text-[8px] tracking-[0.3em] uppercase text-gray-500 bg-black/40 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
                            {post._type}
                          </span>
                        </div>

                        {/* Heading + excerpt */}
                        <div className="img-card-title absolute bottom-0 left-0 right-0 px-4 pb-5 z-10">
                          <h3 className="font-sans text-xs font-medium text-white line-clamp-2 leading-snug">
                            {post.heading}
                          </h3>
                          <p className="font-body text-gray-500 text-[10px] mt-1">
                            {new Date(post.date).toLocaleDateString()}
                          </p>
                          <div className="img-card-excerpt">
                            <p className="font-body text-gray-300 text-[11px] leading-relaxed line-clamp-2 mt-2.5">
                              {post.content}
                            </p>
                            <span className="font-sans text-[9px] tracking-[0.35em] uppercase text-cobalt-light flex items-center gap-1 mt-2">
                              Read <ArrowRight className="w-2.5 h-2.5" />
                            </span>
                          </div>
                        </div>
                      </a>
                    </motion.div>
                  ))}

                <CtaCard href="/radar" title="All Radar" subtitle="Signals &amp; insights" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
