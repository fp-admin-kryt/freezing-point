'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navigation from '@/components/Navigation'
import InteractiveCard from '@/components/InteractiveCard'
import ScrollIndicator from '@/components/ScrollIndicator'
import { Target, Zap, Eye, TrendingUp, Download, ArrowRight } from 'lucide-react'
import { getResearchPosts, getSignalPosts, getObserverPosts } from '@/lib/firebase'
import { getTagById, getDomainById } from '@/lib/dataService'
import Image from 'next/image'

export default function Home() {
  const [showContent, setShowContent] = useState(false)
  const [researchPosts, setResearchPosts] = useState<any[]>([])
  const [signalPosts, setSignalPosts] = useState<any[]>([])
  const [observerPosts, setObserverPosts] = useState<any[]>([])

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true)
    }, 4000) // Increased delay for new animation
    return () => clearTimeout(timer)
  }, [])

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
      icon: TrendingUp,
      title: 'Health',
      description: 'Positioned at the crossroads of medicine and machine learning, Health at FreezingPoint.Ai delves into how artificial intelligence, systems thinking, and data-driven approaches are reshaping care delivery. From predictive diagnostics to patient-centered innovations, this section showcases cutting-edge research, actionable methodologies, and forward-looking solutions aimed at improving outcomes and fundamentally redefining healthcare.',
      link: '#research',
      color: 'from-green-500 to-emerald-400'
    },
    {
      icon: Eye,
      title: 'Signals',
      description: 'A curated stream of early indicators, emerging patterns, and subtle shifts shaping the future of healthcare and artificial intelligence. Signals highlight emerging patterns and weak signals that often go unnoticed but hold the potential to redefine the landscape. This section invites curiosity and foresight, providing a front-row seat to innovation before it reaches the mainstream.',
      link: '#radar',
      color: 'from-purple-500 to-pink-400'
    },
    {
      icon: Zap,
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

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* New Entrance Animation */}
      {!showContent && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-space-black">
          {/* White dot in center */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-4 h-4 bg-white rounded-full relative"
          >
            {/* Pulsing waves */}
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 20, opacity: 0 }}
                transition={{ 
                  duration: 1.5, 
                  delay: i * 0.3,
                  ease: "easeOut"
                }}
                className="absolute inset-0 border border-white rounded-full"
                style={{ transformOrigin: 'center' }}
              />
            ))}
          </motion.div>

          {/* Logo reveal after waves */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 2.5, ease: "easeOutBack" }}
            className="absolute"
          >
            <Image
              src="/assets/logos/fp-logo.png"
              alt="Freezing Point AI"
              width={120}
              height={120}
              className="drop-shadow-2xl"
            />
          </motion.div>
        </div>
      )}

      {/* Horizontal Cut Reveal */}
      {showContent && (
        <motion.div
          initial={{ clipPath: 'inset(50% 0 50% 0)' }}
          animate={{ clipPath: 'inset(0% 0 0% 0)' }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="relative z-20"
        >
          {/* Navigation */}
          <Navigation />

          {/* Hero Section */}
          <section className="min-h-screen flex flex-col items-center justify-center px-4 relative">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-6xl md:text-8xl font-bold text-white font-montserrat text-center mb-8"
            >
              FREEZING POINT
            </motion.h1>

            {/* Explore Infinitely Capsule - updated */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="relative mb-10"
            >
              <div className="relative px-6 py-2 rounded-full border-2 border-transparent bg-space-gray shadow-lg overflow-hidden" style={{ minWidth: 180 }}>
                <motion.div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  animate={{
                    background: [
                      'radial-gradient(circle at 0% 50%, #136fd7 0%, transparent 70%)',
                      'radial-gradient(circle at 100% 50%, #4da6ff 0%, transparent 70%)',
                      'radial-gradient(circle at 0% 50%, #136fd7 0%, transparent 70%)'
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{ zIndex: 1, opacity: 0.4 }}
                />
                <span className="relative z-10 text-base md:text-lg font-semibold text-white font-montserrat">
                  Explore Infinitely
                </span>
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-cobalt-blue pointer-events-none"
                  animate={{
                    boxShadow: [
                      '0 0 8px 2px #136fd7',
                      '0 0 16px 4px #4da6ff',
                      '0 0 8px 2px #136fd7'
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{ zIndex: 2 }}
                />
              </div>
            </motion.div>

            {/* New Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="flex flex-col items-center space-y-4"
            >
              <ScrollIndicator variant="new" />
            </motion.div>
          </section>

          {/* Interactive Cards Section */}
          <section id="explore" className="section-padding">
            <div className="container mx-auto px-4">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-4xl md:text-5xl font-bold text-white text-center mb-16 font-montserrat"
              >
                Explore Our World
              </motion.h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {heroCards.map((card, index) => (
                  <InteractiveCard
                    key={index}
                    icon={card.icon}
                    title={card.title}
                    description={card.description}
                    link={card.link}
                    color={card.color}
                    onClick={() => scrollToSection(card.link.replace('#', ''))}
                  />
                ))}
              </div>
            </div>
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
                  Cutting-edge research papers and whitepapers from leading AI researchers and institutions
                </p>
              </motion.div>

              <div className="overflow-x-auto horizontal-scroll">
                <div className="flex gap-8 pb-4" style={{ minWidth: 'max-content' }}>
                  {researchPosts.slice(0, 6).map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="glass-morphism rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group flex-shrink-0"
                      style={{ width: '400px', maxWidth: '400px' }}
                    >
                      {post.image && (
                        <div className="w-full h-48 bg-gray-700 rounded-lg mb-4 overflow-hidden">
                          <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                            <span className="text-gray-400">Image Placeholder</span>
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
                        <a
                          href={post.whitepaper || '#'}
                          className="flex items-center gap-2 text-cobalt-light hover:text-cobalt-blue transition-colors text-sm"
                        >
                          <Download className="w-4 h-4" />
                          Download PDF
                        </a>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-cobalt-light transition-colors" />
                      </div>
                    </motion.div>
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
                <div className="overflow-x-auto horizontal-scroll">
                  <div className="flex gap-6 pb-4" style={{ minWidth: 'max-content' }}>
                    {signalPosts.slice(0, 6).map((post, index) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="glass-morphism rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group relative flex-shrink-0"
                        style={{ width: '380px', maxWidth: '380px' }}
                      >
                        {/* Tag image in top right */}
                        {post.tags.length > 0 && (
                          <div className="absolute top-4 right-4 w-8 h-8 rounded-lg overflow-hidden">
                            <div 
                              className="w-full h-full flex items-center justify-center text-xs text-white font-bold"
                              style={{ backgroundColor: getTagById(post.tags[0])?.color || '#136fd7' }}
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
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                          {getDomainById(post.domain) && (
                            <span className="px-2 py-1 rounded-full bg-gray-700">
                              {getDomainById(post.domain)?.name}
                            </span>
                          )}
                        </div>
                      </motion.div>
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
                <div className="overflow-x-auto horizontal-scroll">
                  <div className="flex gap-6 pb-4" style={{ minWidth: 'max-content' }}>
                    {observerPosts.slice(0, 6).map((post, index) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="glass-morphism rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group relative flex-shrink-0"
                        style={{ width: '380px', maxWidth: '380px' }}
                      >
                        {/* Tag image in top right */}
                        {post.tags.length > 0 && (
                          <div className="absolute top-4 right-4 w-8 h-8 rounded-lg overflow-hidden">
                            <div 
                              className="w-full h-full flex items-center justify-center text-xs text-white font-bold"
                              style={{ backgroundColor: getTagById(post.tags[0])?.color || '#136fd7' }}
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
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                          {getDomainById(post.domain) && (
                            <span className="px-2 py-1 rounded-full bg-gray-700">
                              {getDomainById(post.domain)?.name}
                            </span>
                          )}
                        </div>
                      </motion.div>
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
      )}
    </main>
  )
} 