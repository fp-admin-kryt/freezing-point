'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface Domain {
  id: string
  name: string
  description: string
  color: string
  postCount: number
}

const DomainManager = () => {
  const [domains, setDomains] = useState<Domain[]>([
    { id: '1', name: 'Machine Learning', description: 'Core ML algorithms and techniques', color: '#0066cc', postCount: 12 },
    { id: '2', name: 'Computer Vision', description: 'Image and video processing', color: '#4da6ff', postCount: 8 },
    { id: '3', name: 'Natural Language Processing', description: 'Text and language understanding', color: '#ff6b6b', postCount: 15 },
    { id: '4', name: 'Robotics', description: 'Autonomous systems and robotics', color: '#51cf66', postCount: 6 },
    { id: '5', name: 'AI Ethics', description: 'Ethical considerations in AI', color: '#ffd43b', postCount: 9 },
  ])
  const [newDomain, setNewDomain] = useState({
    name: '',
    description: '',
    color: '#0066cc',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Here you would typically send the data to your API
    const domainData = {
      id: Date.now().toString(),
      name: newDomain.name,
      description: newDomain.description,
      color: newDomain.color,
      postCount: 0,
    }

    setDomains(prev => [...prev, domainData])
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
    setNewDomain({ name: '', description: '', color: '#0066cc' })
  }

  const handleDeleteDomain = (id: string) => {
    setDomains(prev => prev.filter(domain => domain.id !== id))
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white font-montserrat mb-6">
        Domain Management
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create New Domain */}
        <div className="glass-morphism rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white font-montserrat mb-4">
            Create New Domain
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white font-montserrat mb-2">Domain Name</label>
              <input
                type="text"
                value={newDomain.name}
                onChange={(e) => setNewDomain(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 bg-space-gray border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cobalt-blue transition-colors font-montserrat"
                placeholder="Enter domain name"
                required
              />
            </div>

            <div>
              <label className="block text-white font-montserrat mb-2">Description</label>
              <textarea
                value={newDomain.description}
                onChange={(e) => setNewDomain(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 bg-space-gray border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cobalt-blue transition-colors font-montserrat resize-none"
                placeholder="Enter domain description"
                required
              />
            </div>

            <div>
              <label className="block text-white font-montserrat mb-2">Color</label>
              <input
                type="color"
                value={newDomain.color}
                onChange={(e) => setNewDomain(prev => ({ ...prev, color: e.target.value }))}
                className="w-full h-12 bg-space-gray border border-gray-600 rounded-lg cursor-pointer"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-cobalt-blue to-cobalt-light text-white py-3 rounded-lg font-semibold font-montserrat hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Domain'}
            </button>
          </form>
        </div>

        {/* Existing Domains */}
        <div className="glass-morphism rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white font-montserrat mb-4">
            Existing Domains
          </h3>

          <div className="space-y-3">
            {domains.map((domain) => (
              <motion.div
                key={domain.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-space-gray rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: domain.color }}
                    />
                    <span className="text-white font-semibold font-montserrat">
                      {domain.name}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteDomain(domain.id)}
                    className="text-red-400 hover:text-red-300 transition-colors font-montserrat text-sm"
                  >
                    Delete
                  </button>
                </div>
                <p className="text-gray-400 font-montserrat text-sm mb-2">
                  {domain.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-cobalt-light font-montserrat text-sm">
                    {domain.postCount} posts
                  </span>
                  <div
                    className="w-16 h-2 rounded-full bg-gray-700"
                    style={{ backgroundColor: `${domain.color}20` }}
                  >
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        backgroundColor: domain.color,
                        width: `${Math.min((domain.postCount / 20) * 100, 100)}%`
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DomainManager 