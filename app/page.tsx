'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navigation from '@/components/Navigation'
import InteractiveCard from '@/components/InteractiveCard'
import ScrollIndicator from '@/components/ScrollIndicator'
import { Target, PlusCircle, Radar, Eye, Download, ArrowRight } from 'lucide-react'
import { getResearchPosts, getSignalPosts, getObserverPosts } from '@/lib/firebase'
import { getTagById, getDomainById } from '@/lib/dataService'
import Image from 'next/image'

export default function Home() {
  const [researchPosts, setResearchPosts] = useState<any[]>([])
  const [signalPosts, setSignalPosts] = useState<any[]>([])
  const [observerPosts, setObserverPosts] = useState<any[]>([])
  const [hasScrolled, setHasScrolled] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  // Load data from Firebase
  useEffect(() => {
    const loadData = async () => {
      try {
        const [research, signals, observers] = await Promise.all([
          getResearchPosts(),
          getSignalPosts(),
          getObserverPosts()
        ])
        setResearchPosts(research)
        setSignalPosts(signals)
        setObserverPosts(observers)
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }
    loadData()
  }, [])

  const heroCards = [
    {
      icon: Target,
      title: 'Impact',
      description: 'At FreezingPoint.Ai, every breakthrough begins as an idea in a fluid state, shaped by research, exploration and raw data. The freezing point marks the critical moment when abstract insights solidify into real solutions. The mission is to crystallize innovation, transforming research into tangible outcomes that shape the future of healthcare. This begins with publishing white papers and conceptual frameworks that will evolve into real-word applications and products.',
      link: '#research',
      color: 'from-cobalt-blue to-cobalt-light'
    },
    {
      icon: PlusCircle,
      title: 'Health',
      description: 'Positioned at the crossroads of medicine and machine learning, Health at FreezingPoint.Ai delves into how artificial intelligence, systems thinking, and data-driven approaches are reshaping care delivery. From predictive diagnostics to patient-centered innovations, this section showcases cutting-edge research, actionable methodologies, and forward-looking solutions aimed at improving outcomes and fundamentally redefining healthcare.',
      link: '#research',
      color: 'from-green-500 to-emerald-400'
    },
    {
      icon: Radar,
      title: 'Signals',
      description: 'A curated stream of early indicators, emerging patterns, and subtle shifts shaping the future of healthcare and artificial intelligence. Signals highlight emerging patterns and weak signals that often go unnoticed but hold the potential to redefine the landscape. This section invites curiosity and foresight, providing a front-row seat to innovation before it reaches the mainstream.',
      link: '#radar',
      color: 'from-purple-500 to-pink-400'
    },
    {
      icon: Eye,
      title: 'The Observer',
      description: 'The Observer offers a curated lens on the evolving landscape of AI, systems innovation, and healthcare transformation. Expect in-depth analysis, ideas, critical commentary, and comprehensive trend reviews that cut through the noise. Whether it\'s a deep dive into policy shifts or reflections on paradigm-changing research, this space invites critical thought and continuous learning.',
      link: '#radar',
      color: 'from-orange-500 to-red-400'
    }
  ]

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      // Direct smooth scroll without delay
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  // Track viewport size to switch between mobile and desktop behavior
  useEffect(() => {
    const updateIsDesktop = () => {
      if (typeof window === 'undefined') return
      setIsDesktop(window.innerWidth >= 768)
    }
    updateIsDesktop()
    window.addEventListener('resize', updateIsDesktop)
    return () => window.removeEventListener('resize', updateIsDesktop)
  }, [])

  // Track scroll (desktop only) to adjust hero layout / hide scroll indicator after first scroll
  useEffect(() => {
    if (!isDesktop) {
      setHasScrolled(false)
      return
    }

    const onScroll = () => {
      // Require a bit more scroll (~200px) before switching layout
      setHasScrolled(window.scrollY > 200)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isDesktop])

  return (
    <main className="min-h-screen relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10"
      >
        {/* Navigation */}
        <Navigation />

        {/* Hero + Explore Section */}
        <section id="explore">
          {/* Mobile: simple centered hero with stacked cards, no scroll logic */}
          {!isDesktop && (
            <div className="section-padding">
              <div className="container mx-auto px-4">
                <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6">
                  <h1 className="text-5xl font-bold text-white font-montserrat text-center mb-2">
                    FREEZING POINT
                  </h1>
                  <div className="relative inline-flex">
                    <div
                      className="relative px-6 py-2 rounded-full border-2 border-transparent bg-space-gray shadow-lg overflow-hidden"
                      style={{ minWidth: 180 }}
                    >
                      <span className="relative z-10 text-base md:text-lg font-semibold text-white font-montserrat">
                        Explore Infinitely
                      </span>
                    </div>
                  </div>
                  <ScrollIndicator variant="new" />
                </div>

                <div className="space-y-6 mt-4">
                  {heroCards.map((card) => {
                    const Icon = card.icon
                    return (
                      <button
                        key={card.title}
                        type="button"
                        onClick={() => scrollToSection(card.link.replace('#', ''))}
                        className="relative w-full text-left glass-morphism rounded-2xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
                      >
                        <div className="pr-12">
                          <h3 className="text-xl font-bold text-white mb-2 font-montserrat">
                            {card.title}
                          </h3>
                          <p className="text-sm text-gray-300 leading-relaxed">
                            {card.description}
                          </p>
                        </div>
                        <div className="absolute top-4 right-4 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Desktop: hero full-center first, then sticky on left with cards on right */}
          {isDesktop && (
            <div
              className={
                hasScrolled
                  ? 'section-padding'
                  : 'min-h-screen flex items-center justify-center px-4'
              }
            >
              <div className="container mx-auto px-4">
                <div
                  className={`max-w-6xl mx-auto items-start ${
                    hasScrolled
                      ? 'grid grid-cols-2 gap-10'
                      : 'flex flex-col items-center'
                  }`}
                >
                  {/* Left: hero, becomes sticky after scroll */}
                  <div
                    className={`space-y-6 flex flex-col items-center md:items-start ${
                      hasScrolled ? 'sticky top-1/2 -translate-y-1/2' : ''
                    }`}
                  >
                    <motion.h1
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className={`text-6xl md:text-7xl font-bold text-white font-montserrat mb-4 ${
                        hasScrolled ? 'text-left self-start' : 'text-center'
                      }`}
                    >
                      FREEZING POINT
                    </motion.h1>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                      className={`relative inline-flex ${
                        hasScrolled ? 'self-start' : 'self-center'
                      }`}
                    >
                      <div
                        className="relative px-6 py-2 rounded-full border-2 border-transparent bg-space-gray shadow-lg overflow-hidden"
                        style={{ minWidth: 180 }}
                      >
                        <span className="relative z-10 text-base md:text-lg font-semibold text-white font-montserrat">
                          Explore Infinitely
                        </span>
                      </div>
                    </motion.div>

                    {!hasScrolled && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 1 }}
                        className="flex flex-col items-center space-y-4 mt-8"
                      >
                        <ScrollIndicator variant="new" />
                      </motion.div>
                    )}
                  </div>

                  {/* Right: stacked cards (only appear after some scroll) */}
                  <div
                    className={`space-y-6 mt-10 md:mt-0 w-full ${
                      hasScrolled ? 'block' : 'opacity-0 pointer-events-none'
                    }`}
                  >
                    {heroCards.map((card, index) => {
                      const Icon = card.icon
                      return (
                        <motion.button
                          key={card.title}
                          type="button"
                          onClick={() => scrollToSection(card.link.replace('#', ''))}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="relative w-full text-left glass-morphism rounded-2xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
                        >
                          <div className="pr-12">
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-2 font-montserrat">
                              {card.title}
                            </h3>
                            <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                              {card.description}
                            </p>
                          </div>
                          <div className="absolute top-4 right-4 flex items-center justify-center">
                            <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                          </div>
                        </motion.button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Research Section */}
        <section id="research" className="section-padding">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-montserrat">
                Research
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto font-montserrat">
                Cutting-edge research papers and whitepapers from leading AI researchers and
                institutions
              </p>
            </motion.div>

            <div
              className="overflow-x-auto horizontal-scroll"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div className="flex gap-8 pb-4" style={{ minWidth: 'max-content' }}>
                {researchPosts.slice(0, 6).map((post, index) => (
                  <motion.a
                    key={post.id || `research-${index}`}
                    href={`/research/${post.id}`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="glass-morphism rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group flex-shrink-0 cursor-pointer block"
                    style={{ width: '400px', maxWidth: '400px' }}
                  >
                    {post.imageUrl && (
                      <div className="w-full h-48 rounded-lg mb-4 overflow-hidden relative">
                        <Image
                          src={post.imageUrl}
                          alt={post.title}
                          fill
                          className="object-cover"
                          sizes="400px"
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-2 mb-3">
                      {post.tags.map((tagId: string) => {
                        const tag = getTagById(tagId)
                        return tag ? (
                          <span
                            key={tagId}
                            className="px-2 py-1 text-xs rounded-full text-white"
                            style={{ backgroundColor: tag.color }}
                          >
                            {tag.name}
                          </span>
                        ) : null
                      })}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 font-montserrat group-hover:text-cobalt-light transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-300 mb-4 text-sm">
                      By {post.author} • {new Date(post.date).toLocaleDateString()}
                    </p>
                    <p className="text-gray-400 mb-4 text-sm line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      {post.whitepaperUrl && (
                        <a
                          href={post.whitepaperUrl}
                          onClick={(e) => {
                            e.stopPropagation()
                            e.preventDefault()
                            const url = post.whitepaperUrl
                            if (!url) return
                            const link = document.createElement('a')
                            link.href = url
                            link.download = `${post.title || 'whitepaper'}.pdf`
                            link.target = '_blank'
                            document.body.appendChild(link)
                            link.click()
                            document.body.removeChild(link)
                          }}
                          className="flex items-center gap-2 text-cobalt-light hover:text-cobalt-blue transition-colors text-sm"
                        >
                          <Download className="w-4 h-4" />
                          Download PDF
                        </a>
                      )}
                      <div className="flex items-center gap-2 text-cobalt-light text-sm">
                        <span>Read More</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-center mt-12"
            >
              <a
                href="/research"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cobalt-blue to-cobalt-light text-white rounded-full font-semibold hover:shadow-lg hover:shadow-cobalt-blue/25 transition-all duration-300"
              >
                View All Research
                <ArrowRight className="w-5 h-5" />
              </a>
            </motion.div>
          </div>
        </section>

        {/* Radar Section */}
        <section id="radar" className="section-padding">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-montserrat">
                Radar
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto font-montserrat">
                Real-time signals and deep insights from the AI frontier
              </p>
            </motion.div>

            {/* Signals */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-16"
            >
              <h3 className="text-2xl font-bold text-white mb-8 text-center font-montserrat">
                Signals
              </h3>
              <div
                className="overflow-x-auto horizontal-scroll"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <div className="flex gap-6 pb-4" style={{ minWidth: 'max-content' }}>
                  {signalPosts.slice(0, 6).map((post, index) => (
                    <motion.a
                      key={post.id || `signal-${index}`}
                      href={`/radar/${post.id}`}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="glass-morphism rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group relative flex-shrink-0 cursor-pointer block"
                      style={{ width: '380px', maxWidth: '380px' }}
                    >
                      {post.tags.length > 0 && (
                        <div className="absolute top-4 right-4 w-8 h-8 rounded-lg overflow-hidden">
                          <div
                            className="w-full h-full flex items-center justify-center text-xs text-white font-bold"
                            style={{
                              backgroundColor:
                                getTagById(post.tags[0])?.color || '#136fd7'
                            }}
                          >
                            {getTagById(post.tags[0])?.name.charAt(0) || 'T'}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2 mb-3">
                        {post.tags.map((tagId: string) => {
                          const tag = getTagById(tagId)
                          return tag ? (
                            <span
                              key={tagId}
                              className="px-2 py-1 text-xs rounded-full text-white"
                              style={{ backgroundColor: tag.color }}
                            >
                              {tag.name}
                            </span>
                          ) : null
                        })}
                      </div>
                      <h4 className="text-lg font-bold text-white mb-3 font-montserrat group-hover:text-cobalt-light transition-colors">
                        {post.heading}
                      </h4>
                      <p className="text-gray-400 text-sm line-clamp-4 mb-4">
                        {post.content}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                        <div className="flex items-center gap-1 text-cobalt-light">
                          <span>Read More</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* The Observer */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h3 className="text-2xl font-bold text-white mb-8 text-center font-montserrat">
                The Observer
              </h3>
              <div
                className="overflow-x-auto horizontal-scroll"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <div className="flex gap-6 pb-4" style={{ minWidth: 'max-content' }}>
                  {observerPosts.slice(0, 6).map((post, index) => (
                    <motion.a
                      key={post.id || `observer-${index}`}
                      href={`/radar/${post.id}`}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="glass-morphism rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group relative flex-shrink-0 cursor-pointer block"
                      style={{ width: '380px', maxWidth: '380px' }}
                    >
                      {post.tags.length > 0 && (
                        <div className="absolute top-4 right-4 w-8 h-8 rounded-lg overflow-hidden">
                          <div
                            className="w-full h-full flex items-center justify-center text-xs text-white font-bold"
                            style={{
                              backgroundColor:
                                getTagById(post.tags[0])?.color || '#136fd7'
                            }}
                          >
                            {getTagById(post.tags[0])?.name.charAt(0) || 'T'}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2 mb-3">
                        {post.tags.map((tagId: string) => {
                          const tag = getTagById(tagId)
                          return tag ? (
                            <span
                              key={tagId}
                              className="px-2 py-1 text-xs rounded-full text-white"
                              style={{ backgroundColor: tag.color }}
                            >
                              {tag.name}
                            </span>
                          ) : null
                        })}
                      </div>
                      <h4 className="text-lg font-bold text-white mb-3 font-montserrat group-hover:text-cobalt-light transition-colors">
                        {post.heading}
                      </h4>
                      <p className="text-gray-400 text-sm line-clamp-4 mb-4">
                        {post.content}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                        <div className="flex items-center gap-1 text-cobalt-light">
                          <span>Read More</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-center mt-12"
            >
              <a
                href="/radar"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cobalt-blue to-cobalt-light text-white rounded-full font-semibold hover:shadow-lg hover:shadow-cobalt-blue/25 transition-all duration-300"
              >
                View All Radar
                <ArrowRight className="w-5 h-5" />
              </a>
            </motion.div>
          </div>
        </section>
      </motion.div>
    </main>
  )
}