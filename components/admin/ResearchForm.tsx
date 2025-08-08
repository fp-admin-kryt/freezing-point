'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { dataStore } from '@/lib/dataStore'

interface ResearchFormProps {
  onSubmit?: (data: any) => void
  initialData?: any
}

const ResearchForm = ({ onSubmit, initialData }: ResearchFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    date: new Date().toISOString().split('T')[0], // Today's date as default
    excerpt: '',
    tags: [] as string[],
    image: null as File | null,
    whitepaper: null as File | null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        author: initialData.author || '',
        date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        excerpt: initialData.excerpt || '',
        tags: initialData.tags || [],
        image: null,
        whitepaper: null,
      })
    }
  }, [initialData])

  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setFormData(prev => ({ ...prev, image: acceptedFiles[0] }))
    }
  })

  const { getRootProps: getPdfRootProps, getInputProps: getPdfInputProps } = useDropzone({
    accept: { 'application/pdf': [] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setFormData(prev => ({ ...prev, whitepaper: acceptedFiles[0] }))
    }
  })

  const availableTags = dataStore.getTags().map(tag => tag.name)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (onSubmit) {
        await onSubmit(formData)
      } else {
        // Fallback for demo
        console.log('Research form data:', formData)
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
      
      // Reset form if not editing
      if (!initialData) {
        setFormData({
          title: '',
          author: '',
          date: new Date().toISOString().split('T')[0],
          excerpt: '',
          tags: [],
          image: null,
          whitepaper: null,
        })
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTagToggle = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }))
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white font-montserrat mb-6">
        {initialData ? 'Edit Research Post' : 'Create Research Post'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-white font-montserrat mb-2">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-4 py-3 bg-space-gray border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cobalt-blue transition-colors font-montserrat"
            placeholder="Enter research title"
            required
          />
        </div>

        {/* Author */}
        <div>
          <label className="block text-white font-montserrat mb-2">Author</label>
          <input
            type="text"
            value={formData.author}
            onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
            className="w-full px-4 py-3 bg-space-gray border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cobalt-blue transition-colors font-montserrat"
            placeholder="Enter author name"
            required
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-white font-montserrat mb-2">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            className="w-full px-4 py-3 bg-space-gray border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cobalt-blue transition-colors font-montserrat"
            required
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-white font-montserrat mb-2">Excerpt</label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
            rows={4}
            className="w-full px-4 py-3 bg-space-gray border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cobalt-blue transition-colors font-montserrat resize-none"
            placeholder="Enter research excerpt"
            required
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-white font-montserrat mb-2">Tags</label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1 rounded-full text-sm font-montserrat transition-colors ${
                  formData.tags.includes(tag)
                    ? 'bg-cobalt-blue text-white'
                    : 'bg-space-gray text-gray-300 hover:bg-gray-700'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Image */}
        <div>
          <label className="block text-white font-montserrat mb-2">
            Featured Image (Optional)
          </label>
          <div
            {...getImageRootProps()}
            className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-cobalt-blue transition-colors"
          >
            <input {...getImageInputProps()} />
            {formData.image ? (
              <p className="text-cobalt-light font-montserrat">{formData.image.name}</p>
            ) : (
              <p className="text-gray-400 font-montserrat">
                Drop an image here, or click to select (optional)
              </p>
            )}
          </div>
        </div>

        {/* Whitepaper PDF */}
        <div>
          <label className="block text-white font-montserrat mb-2">
            Whitepaper PDF (Optional)
          </label>
          <div
            {...getPdfRootProps()}
            className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-cobalt-blue transition-colors"
          >
            <input {...getPdfInputProps()} />
            {formData.whitepaper ? (
              <p className="text-cobalt-light font-montserrat">{formData.whitepaper.name}</p>
            ) : (
              <p className="text-gray-400 font-montserrat">
                Drop a PDF here, or click to select (optional)
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-cobalt-blue to-cobalt-light text-white py-3 rounded-lg font-semibold font-montserrat hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : (initialData ? 'Update Research Post' : 'Publish Research Post')}
        </button>
      </form>
    </div>
  )
}

export default ResearchForm 