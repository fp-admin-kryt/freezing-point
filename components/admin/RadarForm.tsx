'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { dataStore } from '@/lib/dataStore'

interface RadarFormProps {
  type: string
  onSubmit?: (data: any) => void
  initialData?: any
}

const RadarForm = ({ type, onSubmit, initialData }: RadarFormProps) => {
  const [formData, setFormData] = useState({
    heading: '',
    content: '',
    tags: [] as string[],
    image: null as File | null,
    domain: '',
    date: new Date().toISOString().split('T')[0], // Today's date as default
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        heading: initialData.title || initialData.heading || '',
        content: initialData.content || '',
        tags: initialData.tags || [],
        image: null,
        domain: initialData.domain || '',
        date: initialData.date || initialData.createdAt ? new Date(initialData.date || initialData.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      })
    }
  }, [initialData])

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setFormData(prev => ({ ...prev, image: acceptedFiles[0] }))
    }
  })

  const availableTags = dataStore.getTags().map(tag => tag.name)
  const availableDomains = dataStore.getDomains()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (onSubmit) {
        await onSubmit(formData)
      } else {
        // Fallback for demo
        console.log(`${type} form data:`, formData)
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
      
      // Reset form if not editing
      if (!initialData) {
        setFormData({
          heading: '',
          content: '',
          tags: [],
          image: null,
          domain: '',
          date: new Date().toISOString().split('T')[0],
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
        {initialData ? `Edit ${type === 'signals' ? 'Signal' : 'Observer'} Post` : `Create ${type === 'signals' ? 'Signal' : 'Observer'} Post`}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Heading */}
        <div>
          <label className="block text-white font-montserrat mb-2">Heading</label>
          <input
            type="text"
            value={formData.heading}
            onChange={(e) => setFormData(prev => ({ ...prev, heading: e.target.value }))}
            className="w-full px-4 py-3 bg-space-gray border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cobalt-blue transition-colors font-montserrat"
            placeholder={`Enter ${type} heading`}
            required
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-white font-montserrat mb-2">Content</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            rows={8}
            className="w-full px-4 py-3 bg-space-gray border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cobalt-blue transition-colors font-montserrat resize-none"
            placeholder={`Enter ${type} content`}
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

        {/* Domain */}
        <div>
          <label className="block text-white font-montserrat mb-2">Domain</label>
          <select
            value={formData.domain}
            onChange={(e) => setFormData(prev => ({ ...prev, domain: e.target.value }))}
            className="w-full px-4 py-3 bg-space-gray border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cobalt-blue transition-colors font-montserrat"
            required
          >
            <option value="">Select a domain</option>
            {availableDomains.map((domain) => (
              <option key={domain.id} value={domain.id}>
                {domain.name}
              </option>
            ))}
          </select>
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

        {/* Image Upload (Optional) */}
        <div>
          <label className="block text-white font-montserrat mb-2">
            Featured Image (Optional)
          </label>
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-cobalt-blue transition-colors"
          >
            <input {...getInputProps()} />
            {formData.image ? (
              <p className="text-cobalt-light font-montserrat">{formData.image.name}</p>
            ) : (
              <p className="text-gray-400 font-montserrat">
                Drop an image here, or click to select (optional)
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
          {isSubmitting ? 'Saving...' : (initialData ? `Update ${type === 'signals' ? 'Signal' : 'Observer'}` : `Publish ${type === 'signals' ? 'Signal' : 'Observer'}`)}
        </button>
      </form>
    </div>
  )
}

export default RadarForm 