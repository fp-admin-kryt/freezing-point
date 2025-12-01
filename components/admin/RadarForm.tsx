'use client'

import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { uploadToCloudinaryDirect } from '@/lib/cloudinary'
import { saveSignalPost, saveObserverPost } from '@/lib/firebase'
import TagSelector from './TagSelector'
import DomainSelector from './DomainSelector'
import toast from 'react-hot-toast'

interface RadarFormProps {
  onBack: () => void
  type: 'signal' | 'observer'
  editPost?: any
}

export default function RadarForm({ onBack, type, editPost }: RadarFormProps) {
  const [formData, setFormData] = useState({
    heading: editPost?.heading || '',
    content: editPost?.content || '',
    tags: editPost?.tags || [],
    domain: editPost?.domain || '',
    date: editPost?.date || new Date().toISOString().split('T')[0]
  })
  
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState(editPost?.imageUrl || '')
  const [loading, setLoading] = useState(false)

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setImageFile(acceptedFiles[0])
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let finalImageUrl = imageUrl

      // Upload image if new file selected
      if (imageFile) {
        toast.loading('Uploading image...')
        finalImageUrl = await uploadToCloudinaryDirect(imageFile)
        toast.dismiss()
        toast.success('Image uploaded successfully!')
      }

      const postData = {
        ...formData,
        imageUrl: finalImageUrl || undefined
      }

      // Save to Firebase
      if (type === 'signal') {
        await saveSignalPost(postData)
      } else {
        await saveObserverPost(postData)
      }
      toast.success(`${type === 'signal' ? 'Signal' : 'Observer'} post saved successfully!`)

      onBack()
    } catch (error) {
      console.error('Error saving post:', error)
      toast.error('Failed to save post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">
          {editPost ? `Edit ${type === 'signal' ? 'Signal' : 'Observer'} Post` : `Create ${type === 'signal' ? 'Signal' : 'Observer'} Post`}
        </h2>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-space-gray text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Heading */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Heading *
          </label>
          <input
            type="text"
            required
            value={formData.heading}
            onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
            className="w-full px-4 py-2 bg-space-gray border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cobalt-blue"
            placeholder={`Enter ${type === 'signal' ? 'signal' : 'observer'} heading`}
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Content *
          </label>
          <textarea
            required
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={6}
            className="w-full px-4 py-2 bg-space-gray border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cobalt-blue"
            placeholder={`Enter ${type === 'signal' ? 'signal' : 'observer'} content`}
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Date *
          </label>
          <input
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-4 py-2 bg-space-gray border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cobalt-blue"
          />
        </div>

        {/* Domain */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Domain *
          </label>
          <DomainSelector
            selectedDomain={formData.domain}
            onChange={(domain) => setFormData({ ...formData, domain })}
            placeholder="Select domain for this post"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Tags
          </label>
          <TagSelector
            selectedTags={formData.tags}
            onChange={(tags) => setFormData({ ...formData, tags })}
            placeholder="Select tags for this post"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Featured Image (Optional)
          </label>
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-cobalt-blue transition-colors"
          >
            <input {...getInputProps()} />
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            {imageFile ? (
              <div className="text-white">
                <p>Selected: {imageFile.name}</p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setImageFile(null)
                  }}
                  className="mt-2 text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            ) : imageUrl ? (
              <div className="text-white">
                <p>Current image uploaded</p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setImageUrl('')
                  }}
                  className="mt-2 text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div>
                <p className="text-gray-400">Drag & drop an image here, or click to select</p>
                <p className="text-gray-500 text-sm mt-1">PNG, JPG, GIF up to 10MB</p>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-cobalt-blue text-white rounded-lg hover:bg-cobalt-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : (editPost ? 'Update Post' : 'Create Post')}
          </button>
        </div>
      </form>
    </div>
  )
} 