'use client'

import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, FileText, Image as ImageIcon } from 'lucide-react'
import { uploadToCloudinaryRobust } from '@/lib/cloudinary'
import toast from 'react-hot-toast'

interface ResearchFormProps {
  onBack: () => void
  editPost?: any
}

export default function ResearchForm({ onBack, editPost }: ResearchFormProps) {
  const [formData, setFormData] = useState({
    title: editPost?.title || '',
    author: editPost?.author || '',
    date: editPost?.date || new Date().toISOString().split('T')[0],
    excerpt: editPost?.excerpt || '',
    tags: editPost?.tags || []
  })
  
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [whitepaperFile, setWhitepaperFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState(editPost?.imageUrl || '')
  const [whitepaperUrl, setWhitepaperUrl] = useState(editPost?.whitepaperUrl || '')
  const [loading, setLoading] = useState(false)

  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setImageFile(acceptedFiles[0])
    }
  })

  const { getRootProps: getPdfRootProps, getInputProps: getPdfInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setWhitepaperFile(acceptedFiles[0])
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let finalImageUrl = imageUrl
      let finalWhitepaperUrl = whitepaperUrl

      // Upload image if new file selected
      if (imageFile) {
        toast.loading('Uploading image...')
        try {
          finalImageUrl = await uploadToCloudinaryRobust(imageFile, 'freezing-point/research/images')
          toast.dismiss()
          toast.success('Image uploaded successfully!')
        } catch (error) {
          toast.dismiss()
          toast.error('Failed to upload image')
          throw error
        }
      }

      // Upload whitepaper if new file selected
      if (whitepaperFile) {
        toast.loading('Uploading whitepaper...')
        try {
          finalWhitepaperUrl = await uploadToCloudinaryRobust(whitepaperFile, 'freezing-point/research/whitepapers')
          toast.dismiss()
          toast.success('Whitepaper uploaded successfully!')
        } catch (error) {
          toast.dismiss()
          toast.error('Failed to upload whitepaper')
          throw error
        }
      }

      const postData = {
        ...formData,
        imageUrl: finalImageUrl || undefined,
        whitepaperUrl: finalWhitepaperUrl || undefined
      }

      // For now, just log the data
      console.log('Research post data:', postData)
      toast.success('Research post saved successfully! (Check console)')

      onBack()
    } catch (error) {
      console.error('Error saving research post:', error)
      toast.error('Failed to save research post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">
          {editPost ? 'Edit Research Post' : 'Create Research Post'}
        </h2>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-space-gray text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 bg-space-gray border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cobalt-blue"
            placeholder="Enter research title"
          />
        </div>

        {/* Author */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Author *
          </label>
          <input
            type="text"
            required
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            className="w-full px-4 py-2 bg-space-gray border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cobalt-blue"
            placeholder="Enter author name"
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

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Excerpt *
          </label>
          <textarea
            required
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 bg-space-gray border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cobalt-blue"
            placeholder="Enter research excerpt"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Tags
          </label>
          <input
            type="text"
            value={formData.tags.join(', ')}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) })}
            className="w-full px-4 py-2 bg-space-gray border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cobalt-blue"
            placeholder="Enter tags separated by commas"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Featured Image (Optional)
          </label>
          <div
            {...getImageRootProps()}
            className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-cobalt-blue transition-colors"
          >
            <input {...getImageInputProps()} />
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

        {/* Whitepaper Upload */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Whitepaper PDF (Optional)
          </label>
          <div
            {...getPdfRootProps()}
            className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-cobalt-blue transition-colors"
          >
            <input {...getPdfInputProps()} />
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            {whitepaperFile ? (
              <div className="text-white">
                <p>Selected: {whitepaperFile.name}</p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setWhitepaperFile(null)
                  }}
                  className="mt-2 text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            ) : whitepaperUrl ? (
              <div className="text-white">
                <p>Current whitepaper uploaded</p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setWhitepaperUrl('')
                  }}
                  className="mt-2 text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div>
                <p className="text-gray-400">Drag & drop a PDF here, or click to select</p>
                <p className="text-gray-500 text-sm mt-1">PDF files up to 25MB</p>
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