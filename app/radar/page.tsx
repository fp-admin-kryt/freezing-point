'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Calendar, Tag, ArrowRight } from 'lucide-react'
import { getSignalPosts, getObserverPosts } from '@/lib/firebase'
import { getTagById, getDomainById } from '@/lib/dataService'
import Navigation from '@/components/Navigation'

export default function RadarPage() {
  const [activeTab, setActiveTab] = useState<'signals' | 'observer'>('signals')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDomain, setSelectedDomain] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  const [signalPosts, setSignalPosts] = useState<any[]>([])
  const [observerPosts, setObserverPosts] = useState<any[]>([])
  const [domains, setDomains] = useState<any[]>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const [signals, observers] = await Promise.all([
          getSignalPosts(),
          getObserverPosts()
        ])
        setSignalPosts(signals)
        setObserverPosts(observers)
        // For now, we'll get domains from the dataService
        // In a real app, you might want to load them separately
      } catch (error) {
        console.error('Error loading radar data:', error)
      }
    }
    loadData()
  }, [])

  const filteredSignalPosts = signalPosts.filter(post => {
    const matchesSearch = post.heading.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDomain = selectedDomain === 'all' || post.domain === selectedDomain
    return matchesSearch && matchesDomain
  })

  const filteredObserverPosts = observerPosts.filter(post => {
    const matchesSearch = post.heading.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDomain = selectedDomain === 'all' || post.domain === selectedDomain
    return matchesSearch && matchesDomain
  })

  const currentPosts = activeTab === 'signals' ? filteredSignalPosts : filteredObserverPosts

  return (
    <div className="min-h-screen bg-space-black text-white">
      <Navigation />
      <div className="pt-24">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-montserrat">
              Radar
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-montserrat">
              Real-time signals and deep insights from the AI frontier
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto mb-12"
          >
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search signals and insights..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-space-gray border border-gray-700 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-cobalt-blue focus:ring-2 focus:ring-cobalt-blue/20 transition-all duration-300 font-montserrat"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center justify-center">
              {/* Domain Filter */}
              <div className="relative group">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-6 py-3 bg-space-gray border border-gray-700 rounded-full text-white hover:border-cobalt-blue transition-all duration-300 font-montserrat"
                >
                  <Filter className="w-4 h-4" />
                  <span>Domain: {selectedDomain === 'all' ? 'All' : getDomainById(selectedDomain)?.name || 'All'}</span>
                </button>
                
                {/* Futuristic Dropdown */}
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute top-full left-0 mt-2 w-64 glass-morphism rounded-2xl p-4 z-50 border border-gray-700"
                  >
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          setSelectedDomain('all')
                          setShowFilters(false)
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 font-montserrat ${
                          selectedDomain === 'all'
                            ? 'bg-cobalt-blue text-white'
                            : 'text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        All Domains
                      </button>
                      {domains.map((domain) => (
                        <button
                          key={domain.id}
                          onClick={() => {
                            setSelectedDomain(domain.id)
                            setShowFilters(false)
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 font-montserrat flex items-center gap-2 ${
                            selectedDomain === domain.id
                              ? 'bg-cobalt-blue text-white'
                              : 'text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: domain.color }}
                          />
                          {domain.name}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Results Count */}
              <div className="text-gray-400 font-montserrat">
                {currentPosts.length} {currentPosts.length === 1 ? 'result' : 'results'}
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center mb-12"
          >
            <div className="glass-morphism rounded-full p-2">
              <button
                onClick={() => setActiveTab('signals')}
                className={`px-8 py-3 rounded-full font-montserrat-alternates transition-all duration-300 ${
                  activeTab === 'signals'
                    ? 'bg-cobalt-blue text-white shadow-lg'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Signals
              </button>
              <button
                onClick={() => setActiveTab('observer')}
                className={`px-8 py-3 rounded-full font-montserrat-alternates transition-all duration-300 ${
                  activeTab === 'observer'
                    ? 'bg-cobalt-blue text-white shadow-lg'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                The Observer
              </button>
            </div>
          </motion.div>

          {/* Posts Grid */}
          <motion.div
            key={`${activeTab}-${selectedDomain}-${searchQuery}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
          >
            {currentPosts.map((post, index) => (
              <motion.a
                key={post.id || `${activeTab}-${index}`}
                href={`/radar/${post.id}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-morphism rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group relative block cursor-pointer"
              >
                {/* Tag image in top right */}
                {post.tags.length > 0 && (
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-lg overflow-hidden">
                    <div 
                      className="w-full h-full flex items-center justify-center text-sm text-white font-bold"
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
                
                <h3 className="text-xl font-bold text-white mb-3 font-montserrat group-hover:text-cobalt-light transition-colors line-clamp-2">
                  {post.heading}
                </h3>
                
                <p className="text-gray-400 text-sm line-clamp-4 mb-4 leading-relaxed">
                  {post.content}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.date).toLocaleDateString()}
                  </span>
                  {getDomainById(post.domain) && (
                    <span className="px-2 py-1 rounded-full bg-gray-700 flex items-center gap-1">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: getDomainById(post.domain)?.color }}
                      />
                      {getDomainById(post.domain)?.name}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-cobalt-light text-sm font-montserrat">
                    {activeTab === 'signals' ? 'Signal' : 'Observer'}
                  </span>
                  <div className="flex items-center gap-2 text-cobalt-light">
                    <span className="text-sm">Read More</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.a>
            ))}
          </motion.div>

          {/* No Results */}
          {currentPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-gray-400 text-lg font-montserrat mb-4">
                No {activeTab} found matching your criteria
              </div>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedDomain('all')
                }}
                className="text-cobalt-light hover:text-cobalt-blue transition-colors font-montserrat"
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