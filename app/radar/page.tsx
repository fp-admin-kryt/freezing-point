'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, ArrowRight, Filter, ChevronDown } from 'lucide-react'
import { getSignalPosts, getObserverPosts } from '@/lib/firebase'
import { getTagById, getDomainById } from '@/lib/dataService'

type RadarPost = {
  id?: string
  heading: string
  content: string
  date: string
  tags: string[]
  domain?: string
  _type: 'Signal' | 'Observer'
}

export default function RadarPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDomain, setSelectedDomain] = useState('all')
  const [activeType, setActiveType] = useState<'all' | 'signal' | 'observer'>('all')
  const [showDomainFilter, setShowDomainFilter] = useState(false)
  const [signalPosts, setSignalPosts] = useState<any[]>([])
  const [observerPosts, setObserverPosts] = useState<any[]>([])
  const [domains, setDomains] = useState<{ id: string; name: string; color: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [signals, observers] = await Promise.all([getSignalPosts(), getObserverPosts()])
        setSignalPosts(signals)
        setObserverPosts(observers)
        // Derive unique domains
        const domainMap = new Map<string, { id: string; name: string; color: string }>()
        ;[...signals, ...observers].forEach((post) => {
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

  const allPosts: RadarPost[] = [
    ...signalPosts.map((p) => ({ ...p, _type: 'Signal' as const })),
    ...observerPosts.map((p) => ({ ...p, _type: 'Observer' as const })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const filteredPosts = allPosts.filter((post) => {
    const q = searchQuery.toLowerCase()
    const matchesSearch =
      post.heading.toLowerCase().includes(q) || post.content.toLowerCase().includes(q)
    const matchesDomain = selectedDomain === 'all' || post.domain === selectedDomain
    const matchesType =
      activeType === 'all' ||
      (activeType === 'signal' && post._type === 'Signal') ||
      (activeType === 'observer' && post._type === 'Observer')
    return matchesSearch && matchesDomain && matchesType
  })

  return (
    <div className="min-h-screen bg-[#050508] text-white">
      <div className="pt-24 pb-24">
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
              Real-time signals and deep insights from the AI frontier
            </p>
          </motion.div>

          {/* Search + filters row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mb-6 flex flex-col sm:flex-row gap-3"
          >
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
              <input
                type="text"
                placeholder="Search signals and insights…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-transparent border border-white/8 rounded-xl text-white placeholder-gray-700 font-sans text-sm focus:outline-none focus:border-cobalt-blue/50 transition-colors"
              />
            </div>

            {/* Domain filter */}
            <div className="relative">
              <button
                onClick={() => setShowDomainFilter(!showDomainFilter)}
                className={`flex items-center gap-2 px-4 py-3 border rounded-xl font-sans text-sm transition-colors whitespace-nowrap ${
                  selectedDomain !== 'all'
                    ? 'border-cobalt-blue/50 text-cobalt-light'
                    : 'border-white/8 text-gray-500 hover:border-white/15 hover:text-gray-300'
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

          {/* Type tabs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mb-8 flex items-center gap-1"
          >
            {(['all', 'signal', 'observer'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`px-4 py-2 rounded-lg font-sans text-xs tracking-wider uppercase transition-colors ${
                  activeType === type
                    ? 'bg-cobalt-blue/20 text-cobalt-light border border-cobalt-blue/30'
                    : 'text-gray-600 border border-transparent hover:text-gray-400 hover:border-white/8'
                }`}
              >
                {type === 'all' ? 'All' : type === 'signal' ? 'Signals' : 'The Observer'}
              </button>
            ))}
            {!loading && (
              <span className="ml-auto font-sans text-[11px] tracking-widest uppercase text-gray-700">
                {filteredPosts.length} {filteredPosts.length === 1 ? 'result' : 'results'}
              </span>
            )}
          </motion.div>

          {/* Skeleton grid */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="border border-white/8 rounded-xl p-5 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex gap-1.5">
                      <div className="h-4 w-14 rounded-full animate-pulse bg-white/6" />
                      <div className="h-4 w-10 rounded-full animate-pulse bg-white/6" />
                    </div>
                    <div className="h-4 w-16 rounded-full animate-pulse bg-white/6 flex-shrink-0" />
                  </div>
                  <div className="h-4 w-full animate-pulse bg-white/6 rounded" />
                  <div className="h-4 w-5/6 animate-pulse bg-white/6 rounded" />
                  <div className="space-y-2 mt-1">
                    <div className="h-3 w-full animate-pulse bg-white/6 rounded" />
                    <div className="h-3 w-4/5 animate-pulse bg-white/6 rounded" />
                    <div className="h-3 w-3/5 animate-pulse bg-white/6 rounded" />
                  </div>
                  <div className="flex justify-between mt-2">
                    <div className="h-3 w-20 animate-pulse bg-white/6 rounded" />
                    <div className="h-3 w-12 animate-pulse bg-white/6 rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Grid */}
          {!loading && (
          <motion.div
            key={`${searchQuery}-${selectedDomain}-${activeType}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filteredPosts.map((post, index) => (
              <motion.a
                key={post.id || `radar-${index}`}
                href={`/radar/${post.id}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group border border-white/8 rounded-xl p-5 hover:border-cobalt-blue/40 hover:bg-cobalt-blue/[0.03] transition-all duration-300 flex flex-col cursor-pointer"
              >
                {/* Top row: tags + type badge */}
                <div className="flex items-start justify-between mb-4 gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((tagId: string) => {
                      const tag = getTagById(tagId)
                      return tag ? (
                        <span
                          key={tagId}
                          className="px-2 py-0.5 font-sans text-[9px] tracking-wider rounded-full"
                          style={{
                            backgroundColor: tag.color + '22',
                            border: `1px solid ${tag.color}44`,
                            color: tag.color,
                          }}
                        >
                          {tag.name}
                        </span>
                      ) : null
                    })}
                  </div>
                  <span
                    className={`flex-shrink-0 px-2 py-0.5 font-sans text-[9px] tracking-widest uppercase rounded-full ${
                      post._type === 'Signal'
                        ? 'bg-cobalt-blue/15 text-cobalt-light border border-cobalt-blue/25'
                        : 'bg-purple-700/15 text-purple-400 border border-purple-700/25'
                    }`}
                  >
                    {post._type}
                  </span>
                </div>

                <h3 className="font-sans text-sm font-medium text-white mb-3 group-hover:text-cobalt-light transition-colors line-clamp-2 leading-snug flex-1">
                  {post.heading}
                </h3>

                <p className="font-body text-gray-500 text-xs line-clamp-3 mb-4 leading-relaxed">
                  {post.content}
                </p>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2">
                    <span className="font-body text-[11px] text-gray-700">
                      {new Date(post.date).toLocaleDateString()}
                    </span>
                    {post.domain && getDomainById(post.domain) && (
                      <span className="flex items-center gap-1">
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: getDomainById(post.domain)?.color }}
                        />
                        <span className="font-sans text-[10px] text-gray-700">
                          {getDomainById(post.domain)?.name}
                        </span>
                      </span>
                    )}
                  </div>
                  <span className="font-sans text-[10px] tracking-widest uppercase text-cobalt-light/60 group-hover:text-cobalt-light transition-colors flex items-center gap-1.5">
                    Read <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </motion.a>
            ))}
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
                onClick={() => { setSearchQuery(''); setSelectedDomain('all'); setActiveType('all') }}
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
