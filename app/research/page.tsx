'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Calendar, Tag, Download, ArrowRight } from 'lucide-react'
import { getResearchPosts } from '@/lib/firebase'
import { getTagById } from '@/lib/dataService'
import Navigation from '@/components/Navigation'

export default function ResearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'author'>('date')
  const [showFilters, setShowFilters] = useState(false)

  const [researchPosts, setResearchPosts] = useState<any[]>([])
  const [tags, setTags] = useState<any[]>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const posts = await getResearchPosts()
        setResearchPosts(posts)
        // For now, we'll get tags from the dataService
        // In a real app, you might want to load them separately
      } catch (error) {
        console.error('Error loading research posts:', error)
      }
    }
    loadData()
  }, [])

  const filteredPosts = researchPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tagId => post.tags.includes(tagId))
    
    return matchesSearch && matchesTags
  })

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case 'title':
        return a.title.localeCompare(b.title)
      case 'author':
        return a.author.localeCompare(b.author)
      default:
        return 0
    }
  })

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    )
  }

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
              Research
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-montserrat">
              Cutting-edge research papers and whitepapers from leading AI researchers and institutions
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-6xl mx-auto mb-12"
          >
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search research papers, authors, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-space-gray border border-gray-700 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-cobalt-blue focus:ring-2 focus:ring-cobalt-blue/20 transition-all duration-300 font-montserrat"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center justify-center mb-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-6 py-3 bg-space-gray border border-gray-700 rounded-full text-white hover:border-cobalt-blue transition-all duration-300 font-montserrat"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'title' | 'author')}
                className="px-6 py-3 bg-space-gray border border-gray-700 rounded-full text-white focus:outline-none focus:border-cobalt-blue transition-all duration-300 font-montserrat"
              >
                <option value="date">Sort by Date</option>
                <option value="title">Sort by Title</option>
                <option value="author">Sort by Author</option>
              </select>

              {/* Results Count */}
              <div className="text-gray-400 font-montserrat">
                {sortedPosts.length} {sortedPosts.length === 1 ? 'paper' : 'papers'}
              </div>
            </div>

            {/* Tag Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="glass-morphism rounded-2xl p-6 mb-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4 font-montserrat">Filter by Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => toggleTag(tag.id)}
                      className={`px-3 py-2 rounded-full text-sm font-montserrat transition-all duration-200 ${
                        selectedTags.includes(tag.id)
                          ? 'text-white shadow-lg'
                          : 'text-gray-300 hover:text-white'
                      }`}
                      style={{
                        backgroundColor: selectedTags.includes(tag.id) ? tag.color : 'transparent',
                        border: `1px solid ${selectedTags.includes(tag.id) ? tag.color : '#374151'}`
                      }}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
                {selectedTags.length > 0 && (
                  <button
                    onClick={() => setSelectedTags([])}
                    className="mt-4 text-cobalt-light hover:text-cobalt-blue transition-colors font-montserrat text-sm"
                  >
                    Clear all tags
                  </button>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Research Papers Grid */}
          <motion.div
            key={`${searchQuery}-${selectedTags.join(',')}-${sortBy}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
          >
            {sortedPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-morphism rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group"
              >
                {post.image && (
                  <div className="w-full h-48 bg-gray-700 rounded-lg mb-4 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                      <span className="text-gray-400">Image Placeholder</span>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-2 mb-3">
                  {post.tags.map(tagId => {
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
                
                <h3 className="text-xl font-bold text-white mb-2 font-montserrat group-hover:text-cobalt-light transition-colors line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-gray-300 mb-3 text-sm">
                  By {post.author} • {new Date(post.date).toLocaleDateString()}
                </p>
                
                <p className="text-gray-400 mb-4 text-sm line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <a
                    href={post.whitepaper || '#'}
                    className="flex items-center gap-2 text-cobalt-light hover:text-cobalt-blue transition-colors text-sm font-montserrat"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </a>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-cobalt-light transition-colors" />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* No Results */}
          {sortedPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-gray-400 text-lg font-montserrat mb-4">
                No research papers found matching your criteria
              </div>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedTags([])
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