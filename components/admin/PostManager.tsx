'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Edit, Trash2, Plus, Eye, Download } from 'lucide-react'

interface Post {
  id: string
  title: string
  author?: string
  date: string
  excerpt?: string
  content?: string
  tags: string[]
  imageUrl?: string
  whitepaperUrl?: string
  type: 'research' | 'signals' | 'observer'
}

interface PostManagerProps {
  type: 'research' | 'signals' | 'observer'
  posts: Post[]
  onEdit: (post: Post) => void
  onDelete: (id: string) => void
  onCreateNew: () => void
}

export default function PostManager({ 
  type, 
  posts, 
  onEdit, 
  onDelete, 
  onCreateNew 
}: PostManagerProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState('')

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (post.author && post.author.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (post.content && post.content.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesTag = !selectedTag || post.tags.includes(selectedTag)
    
    return matchesSearch && matchesTag
  })

  const allTags = Array.from(new Set(posts.flatMap(post => post.tags)))

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'research': return 'Research'
      case 'signals': return 'Signal'
      case 'observer': return 'Observer'
      default: return type
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white font-montserrat">
          {getTypeLabel(type)} Management
        </h2>
        <button
          onClick={onCreateNew}
          className="bg-cobalt-blue text-white px-4 py-2 rounded-lg font-montserrat hover:bg-cobalt-light transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create New {getTypeLabel(type)}</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="glass-morphism rounded-xl p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white font-montserrat mb-2">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search ${type} posts...`}
              className="w-full px-4 py-3 bg-space-gray border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cobalt-blue transition-colors font-montserrat"
            />
          </div>
          <div>
            <label className="block text-white font-montserrat mb-2">Filter by Tag</label>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full px-4 py-3 bg-space-gray border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cobalt-blue transition-colors font-montserrat"
            >
              <option value="">All Tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="glass-morphism rounded-xl p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-3">
                  <h3 className="text-xl font-semibold text-white font-montserrat">
                    {post.title}
                  </h3>
                  <span className="px-2 py-1 bg-cobalt-blue text-white text-xs rounded-full font-montserrat">
                    {getTypeLabel(post.type)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 mb-3 text-sm text-gray-400 font-montserrat">
                  {post.author && <span>By {post.author}</span>}
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                </div>
                
                {(post.excerpt || post.content) && (
                  <p className="text-gray-300 font-montserrat mb-4 line-clamp-2">
                    {post.excerpt || post.content}
                  </p>
                )}
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-space-gray text-cobalt-light text-xs rounded-full font-montserrat"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-400 font-montserrat">
                  {post.imageUrl && (
                    <span className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>Has Image</span>
                    </span>
                  )}
                  {post.whitepaperUrl && (
                    <span className="flex items-center space-x-1">
                      <Download className="w-4 h-4" />
                      <span>Has Whitepaper</span>
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => onEdit(post)}
                  className="p-2 bg-cobalt-blue text-white rounded-lg hover:bg-cobalt-light transition-colors"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(post.id)}
                  className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 font-montserrat text-lg">
              No {type} posts found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 