'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'

interface Tag {
  id: string
  name: string
  image: string | null
  color: string
}

const TagManager = () => {
  const [tags, setTags] = useState<Tag[]>([
    { id: '1', name: 'Machine Learning', image: null, color: '#0066cc' },
    { id: '2', name: 'Deep Learning', image: null, color: '#4da6ff' },
    { id: '3', name: 'Computer Vision', image: null, color: '#ff6b6b' },
  ])
  const [newTag, setNewTag] = useState({
    name: '',
    color: '#0066cc',
    image: null as File | null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setNewTag(prev => ({ ...prev, image: acceptedFiles[0] }))
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Here you would typically send the data to your API
    const tagData = {
      id: Date.now().toString(),
      name: newTag.name,
      color: newTag.color,
      image: newTag.image ? URL.createObjectURL(newTag.image) : null,
    }

    setTags(prev => [...prev, tagData])
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
    setNewTag({ name: '', color: '#0066cc', image: null })
  }

  const handleDeleteTag = (id: string) => {
    setTags(prev => prev.filter(tag => tag.id !== id))
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white font-montserrat mb-6">
        Tag Management
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create New Tag */}
        <div className="glass-morphism rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white font-montserrat mb-4">
            Create New Tag
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white font-montserrat mb-2">Tag Name</label>
              <input
                type="text"
                value={newTag.name}
                onChange={(e) => setNewTag(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 bg-space-gray border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cobalt-blue transition-colors font-montserrat"
                placeholder="Enter tag name"
                required
              />
            </div>

            <div>
              <label className="block text-white font-montserrat mb-2">Color</label>
              <input
                type="color"
                value={newTag.color}
                onChange={(e) => setNewTag(prev => ({ ...prev, color: e.target.value }))}
                className="w-full h-12 bg-space-gray border border-gray-600 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-white font-montserrat mb-2">Tag Image (Optional)</label>
              <div
                {...getRootProps()}
                className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:border-cobalt-blue transition-colors"
              >
                <input {...getInputProps()} />
                {newTag.image ? (
                  <p className="text-cobalt-light font-montserrat">{newTag.image.name}</p>
                ) : (
                  <p className="text-gray-400 font-montserrat">Drop an image here, or click to select</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-cobalt-blue to-cobalt-light text-white py-3 rounded-lg font-semibold font-montserrat hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Tag'}
            </button>
          </form>
        </div>

        {/* Existing Tags */}
        <div className="glass-morphism rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white font-montserrat mb-4">
            Existing Tags
          </h3>

          <div className="space-y-3">
            {tags.map((tag) => (
              <motion.div
                key={tag.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 bg-space-gray rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {tag.image && (
                    <img
                      src={tag.image}
                      alt={tag.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                  <span className="text-white font-montserrat">{tag.name}</span>
                </div>
                <button
                  onClick={() => handleDeleteTag(tag.id)}
                  className="text-red-400 hover:text-red-300 transition-colors font-montserrat"
                >
                  Delete
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TagManager 