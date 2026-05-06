'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Filter, ChevronDown } from 'lucide-react'
import { ExpandingSearchDock } from '@/components/ui/expanding-search-dock'
import { getResearchPosts } from '@/lib/firebase'
import { getTagById } from '@/lib/dataService'
import Image from 'next/image'
import { DottedSurface } from '@/components/ui/dotted-surface'

export default function ResearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'author'>('date')
  const [showFilters, setShowFilters] = useState(false)
  const [researchPosts, setResearchPosts] = useState<any[]>([])
  const [allTags, setAllTags] = useState<{ id: string; name: string; color: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const posts = await getResearchPosts()
        setResearchPosts(posts)
        // Derive unique tags from posts
        const tagMap = new Map<string, { id: string; name: string; color: string }>()
        posts.forEach((post) => {
          post.tags.forEach((tagId: string) => {
            const tag = getTagById(tagId)
            if (tag && !tagMap.has(tagId)) tagMap.set(tagId, { id: tagId, ...tag })
          })
        })
        setAllTags(Array.from(tagMap.values()))
      } catch (error) {
        console.error('Error loading research posts:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const filteredPosts = researchPosts.filter((post) => {
    const q = searchQuery.toLowerCase()
    const matchesSearch =
      post.title.toLowerCase().includes(q) ||
      post.author.toLowerCase().includes(q) ||
      post.excerpt?.toLowerCase().includes(q)
    const matchesTags =
      selectedTags.length === 0 || selectedTags.some((id) => post.tags.includes(id))
    return matchesSearch && matchesTags
  })

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime()
    if (sortBy === 'title') return a.title.localeCompare(b.title)
    if (sortBy === 'author') return a.author.localeCompare(b.author)
    return 0
  })

  const toggleTag = (id: string) =>
    setSelectedTags((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]))

  return (
    <div className="relative min-h-screen bg-[#050508] text-white overflow-hidden">
      <DottedSurface className="absolute inset-0 z-0 opacity-35" />
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
              Publications
            </p>
            <h1 className="font-sans font-light text-5xl md:text-7xl text-white leading-none tracking-tight mb-4">
              Research
            </h1>
            <p className="font-body text-gray-500 max-w-xl text-sm">
              Charting the unknown through research directions and conceptual frameworks.
            </p>
          </motion.div>

          {/* Search + Sort + Filter */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mb-8 flex items-center justify-center gap-3 flex-wrap"
          >
            {/* Expanding search */}
            <ExpandingSearchDock
              placeholder="Search papers, authors, topics…"
              value={searchQuery}
              onChange={setSearchQuery}
            />

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'title' | 'author')}
                className="appearance-none pl-4 pr-9 py-3 bg-white/5 border border-white/10 rounded-full text-gray-400 font-sans text-sm focus:outline-none focus:border-cobalt-blue/50 transition-colors cursor-pointer h-12"
              >
                <option value="date" className="bg-[#0e0e12]">Sort: Date</option>
                <option value="title" className="bg-[#0e0e12]">Sort: Title</option>
                <option value="author" className="bg-[#0e0e12]">Sort: Author</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600 pointer-events-none" />
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-5 h-12 border rounded-full font-sans text-sm transition-colors ${
                showFilters || selectedTags.length > 0
                  ? 'border-cobalt-blue/50 text-cobalt-light bg-cobalt-blue/10'
                  : 'border-white/10 text-gray-500 bg-white/5 hover:border-white/20 hover:text-gray-300'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filter{selectedTags.length > 0 ? ` (${selectedTags.length})` : ''}</span>
            </button>
          </motion.div>

          {/* Tag filter pills */}
          {showFilters && allTags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 flex flex-wrap gap-2 justify-center"
            >
              {allTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className="px-3 py-1.5 rounded-full font-sans text-xs transition-all duration-200"
                  style={{
                    backgroundColor: selectedTags.includes(tag.id) ? tag.color + '33' : 'transparent',
                    border: `1px solid ${selectedTags.includes(tag.id) ? tag.color + '88' : 'rgba(255,255,255,0.08)'}`,
                    color: selectedTags.includes(tag.id) ? tag.color : '#6b7280',
                  }}
                >
                  {tag.name}
                </button>
              ))}
              {selectedTags.length > 0 && (
                <button
                  onClick={() => setSelectedTags([])}
                  className="px-3 py-1.5 rounded-full font-sans text-xs text-gray-600 border border-white/8 hover:text-gray-400 transition-colors"
                >
                  Clear all
                </button>
              )}
            </motion.div>
          )}

          {/* Results count */}
          {!loading && (
            <div className="mb-6 text-center font-sans text-[11px] tracking-widest uppercase text-gray-700">
              {sortedPosts.length} {sortedPosts.length === 1 ? 'paper' : 'papers'}
            </div>
          )}

          {/* Grid */}
          {!loading && (
          <motion.div
            key={`${searchQuery}-${selectedTags.join(',')}-${sortBy}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
          >
            {sortedPosts.map((post, index) => (
              <motion.a
                key={post.id || `research-${index}`}
                href={`/research/${post.id}`}
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
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

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
              </motion.a>
            ))}
          </motion.div>
          )}

          {/* Empty state */}
          {!loading && sortedPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <p className="font-sans text-gray-600 text-sm mb-4">No papers found matching your criteria</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedTags([]) }}
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
