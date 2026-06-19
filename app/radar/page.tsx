'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Filter, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { ExpandingSearchDock } from '@/components/ui/expanding-search-dock'
import { getSignalPosts, getObserverPosts, getRadarPosts } from '@/lib/firebase'
import { getTagById, getDomainById } from '@/lib/dataService'

type RadarPost = {
  id?: string
  heading: string
  content: string
  date: string
  tags: string[]
  domain?: string
  imageUrl?: string
}

export default function RadarPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDomain, setSelectedDomain] = useState('all')
  const [showDomainFilter, setShowDomainFilter] = useState(false)
  const [allPosts, setAllPosts] = useState<RadarPost[]>([])
  const [domains, setDomains] = useState<{ id: string; name: string; color: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [signals, observers, radar] = await Promise.all([getSignalPosts(), getObserverPosts(), getRadarPosts()])
        const merged: RadarPost[] = [...radar, ...signals, ...observers]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        setAllPosts(merged)
        const domainMap = new Map<string, { id: string; name: string; color: string }>()
        merged.forEach((post) => {
          if (post.domain) {
            const d = getDomainById(post.domain)
            if (d && !domainMap.has(post.domain)) domainMap.set(post.domain, { id: post.domain, ...d })
          }
        })
        setDomains(Array.from(domainMap.values()))
      } catch (error) {
        console.error('Error loading radar data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const filteredPosts = allPosts.filter((post) => {
    const q = searchQuery.toLowerCase()
    const matchesSearch =
      post.heading.toLowerCase().includes(q) || post.content.toLowerCase().includes(q)
    const matchesDomain = selectedDomain === 'all' || post.domain === selectedDomain
    return matchesSearch && matchesDomain
  })

  return (
    <div className="relative min-h-screen bg-[#050508] text-white overflow-hidden">
      {/* Dot-grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(19,111,215,0.35) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
        }}
      />
      <div className="relative z-10 pt-24 pb-24">
        <div className="container mx-auto px-4 max-w-7xl">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <p className="font-sans text-[10px] tracking-[0.5em] uppercase text-cobalt-light mb-5">
              Intelligence
            </p>
            <h1 className="font-sans font-light text-5xl md:text-7xl text-white leading-none tracking-tight mb-4">
              Radar
            </h1>
            <p className="font-body text-gray-500 max-w-xl text-sm">
              Signals shaping the next era of intelligent systems.
            </p>
          </motion.div>

          {/* Search + filters row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mb-6 flex items-center justify-center gap-3 flex-wrap"
          >
            {/* Expanding search */}
            <ExpandingSearchDock
              placeholder="Search signals and insights…"
              value={searchQuery}
              onChange={setSearchQuery}
            />

            {/* Domain filter */}
            <div className="relative">
              <button
                onClick={() => setShowDomainFilter(!showDomainFilter)}
                className={`flex items-center gap-2 px-5 h-12 border rounded-full font-sans text-sm transition-colors whitespace-nowrap ${
                  selectedDomain !== 'all'
                    ? 'border-cobalt-blue/50 text-cobalt-light bg-cobalt-blue/10'
                    : 'border-white/10 text-gray-500 bg-white/5 hover:border-white/20 hover:text-gray-300'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>
                  {selectedDomain === 'all'
                    ? 'Domain'
                    : getDomainById(selectedDomain)?.name || 'Domain'}
                </span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {showDomainFilter && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 mt-2 w-52 bg-[#0e0e12] border border-white/8 rounded-xl p-2 z-50 shadow-2xl"
                >
                  <button
                    onClick={() => { setSelectedDomain('all'); setShowDomainFilter(false) }}
                    className={`w-full text-left px-3 py-2 rounded-lg font-sans text-sm transition-colors ${
                      selectedDomain === 'all'
                        ? 'bg-cobalt-blue/20 text-cobalt-light'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    All Domains
                  </button>
                  {domains.map((domain) => (
                    <button
                      key={domain.id}
                      onClick={() => { setSelectedDomain(domain.id); setShowDomainFilter(false) }}
                      className={`w-full text-left px-3 py-2 rounded-lg font-sans text-sm transition-colors flex items-center gap-2 ${
                        selectedDomain === domain.id
                          ? 'bg-cobalt-blue/20 text-cobalt-light'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: domain.color }} />
                      {domain.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Results count */}
          {!loading && (
            <div className="mb-8 text-center font-sans text-[11px] tracking-widest uppercase text-gray-700">
              {filteredPosts.length} {filteredPosts.length === 1 ? 'result' : 'results'}
            </div>
          )}

          {/* Grid */}
          {!loading && (
          <motion.div
            key={`${searchQuery}-${selectedDomain}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
          >
            {filteredPosts.map((post, index) => {
              const domainData = post.domain ? getDomainById(post.domain) : null
              const accentColor = domainData?.color || '#136fd7'
              return (
                <motion.a
                  key={post.id || `radar-${index}`}
                  href={`/radar/${post.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.04 }}
                  className="img-card group relative block overflow-hidden rounded-2xl cursor-pointer"
                  style={{ aspectRatio: '16/9' }}
                >
                  {post.imageUrl ? (
                    <Image
                      src={post.imageUrl}
                      alt={post.heading}
                      fill
                      className="object-cover transition-transform duration-700 max-sm:scale-105 sm:group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0" style={{
                      background: `linear-gradient(160deg, #050a14 0%, #0c1a2e 40%, #0a2040 70%, #081830 100%)`
                    }}>
                      <div className="absolute inset-0 opacity-25"
                        style={{ background: `radial-gradient(ellipse 80% 60% at 50% 80%, ${accentColor} 0%, transparent 70%)` }} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent max-sm:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Tags + domain badge */}
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
                    {domainData && (
                      <span className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: accentColor }} />
                        <span className="font-sans text-[8px] text-gray-400">{domainData.name}</span>
                      </span>
                    )}
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
                </motion.a>
              )
            })}
          </motion.div>
          )}

          {/* Empty state */}
          {!loading && filteredPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <p className="font-sans text-gray-600 text-sm mb-4">No results matching your criteria</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedDomain('all') }}
                className="font-sans text-[10px] tracking-[0.4em] uppercase text-cobalt-light hover:text-white transition-colors"
              >
                Clear filters
              </button>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  )
}
