'use client'

import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FileText, Image as ImageIcon, Layout, FileImage } from 'lucide-react'
import { uploadToCloudinaryDirect } from '@/lib/cloudinary'
import { saveResearchPost, TemplateType, ContentBlock } from '@/lib/firebase'
import TagSelector from './TagSelector'
import RichTextEditor from './RichTextEditor'
import BlockEditor from './BlockEditor'
import PostPreview from './PostPreview'
import { Eye } from 'lucide-react'
import toast from 'react-hot-toast'

interface ResearchFormProps {
  onBack: () => void
  editPost?: any
}

export default function ResearchForm({ onBack, editPost }: ResearchFormProps) {
  const [templateType, setTemplateType] = useState<TemplateType | ''>(
    editPost?.templateType || ''
  )
  const [formData, setFormData] = useState({
    title: editPost?.title || '',
    author: editPost?.author || '',
    date: editPost?.date || new Date().toISOString().split('T')[0],
    excerpt: editPost?.excerpt || '',
    tags: editPost?.tags || []
  })
  
  // Single Image Template State
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState(editPost?.imageUrl || '')
  const [richContent, setRichContent] = useState(editPost?.richContent || '')

  // Document Template State
  const [blocks, setBlocks] = useState<ContentBlock[]>(
    editPost?.blocks || []
  )

  // Whitepaper (common to both)
  const [whitepaperFile, setWhitepaperFile] = useState<File | null>(null)
  const [whitepaperUrl, setWhitepaperUrl] = useState(editPost?.whitepaperUrl || '')
  const [loading, setLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

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
    
    if (!templateType) {
      toast.error('Please select a template type')
      return
    }

    setLoading(true)

    try {
      let finalImageUrl = imageUrl
      let finalWhitepaperUrl = whitepaperUrl

      // Upload image if new file selected (for single image template)
      if (imageFile && templateType === 'singleImage') {
        toast.loading('Uploading image...')
        try {
          finalImageUrl = await uploadToCloudinaryDirect(imageFile)
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
          finalWhitepaperUrl = await uploadToCloudinaryDirect(whitepaperFile)
          toast.dismiss()
          toast.success('Whitepaper uploaded successfully!')
        } catch (error) {
          toast.dismiss()
          toast.error('Failed to upload whitepaper')
          throw error
        }
      }

      const postData: any = {
        ...formData,
        templateType,
        whitepaperUrl: finalWhitepaperUrl || undefined,
      }

      // Add template-specific data
      if (templateType === 'singleImage') {
        postData.imageUrl = finalImageUrl || undefined
        postData.richContent = richContent || undefined
      } else if (templateType === 'document') {
        postData.blocks = blocks.length > 0 ? blocks : undefined
      }

      // Save to Firebase
      await saveResearchPost(postData)
      toast.success('Research post saved successfully!')

      onBack()
    } catch (error) {
      console.error('Error saving research post:', error)
      toast.error('Failed to save research post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
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
        {/* Basic Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Tags
            </label>
            <TagSelector
              selectedTags={formData.tags}
              onChange={(tags) => setFormData({ ...formData, tags })}
              placeholder="Select tags"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Excerpt *
          </label>
          <textarea
            required
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 bg-space-gray border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cobalt-blue"
            placeholder="Enter research excerpt (for card preview)"
          />
        </div>

        {/* Template Type Selection */}
        {!editPost && (
          <div>
            <label className="block text-sm font-medium text-white mb-4">
              Select Template Type *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setTemplateType('singleImage')}
                className={`p-6 border-2 rounded-lg transition-all ${
                  templateType === 'singleImage'
                    ? 'border-cobalt-blue bg-cobalt-blue/10'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <FileImage className="w-12 h-12 text-cobalt-light mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-2">Single Image Template</h3>
                  <p className="text-sm text-gray-400">
                    Sticky image on left, scrollable rich text content on right
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTemplateType('document')}
                className={`p-6 border-2 rounded-lg transition-all ${
                  templateType === 'document'
                    ? 'border-cobalt-blue bg-cobalt-blue/10'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <Layout className="w-12 h-12 text-cobalt-light mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-2">Document Template</h3>
                  <p className="text-sm text-gray-400">
                    Flexible block-based layout with text and image blocks
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Single Image Template Editor */}
        {templateType === 'singleImage' && (
          <div className="space-y-4 p-6 bg-gray-900 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Single Image Template</h3>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Sticky Image (Left Side) *
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
                  <div>
                    <img src={imageUrl} alt="Preview" className="max-w-full h-auto rounded-lg mb-2" />
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

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Rich Text Content (Right Side) *
              </label>
              <RichTextEditor
                value={richContent}
                onChange={setRichContent}
                placeholder="Enter your formatted content here..."
              />
            </div>
          </div>
        )}

        {/* Document Template Editor */}
        {templateType === 'document' && (
          <div className="space-y-4 p-6 bg-gray-900 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Document Template</h3>
            <BlockEditor blocks={blocks} onChange={setBlocks} />
          </div>
        )}

        {/* Whitepaper Upload (Common to both) */}
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
          {templateType && (
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
          )}
          <button
            type="submit"
            disabled={loading || !templateType}
            className="px-6 py-2 bg-cobalt-blue text-white rounded-lg hover:bg-cobalt-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : (editPost ? 'Update Post' : 'Create Post')}
          </button>
        </div>

        {/* Preview Modal */}
        {showPreview && templateType && (
          <PostPreview
            templateType={templateType}
            imageUrl={imageUrl}
            richContent={richContent}
            blocks={blocks}
            title={formData.title}
            author={formData.author}
            date={formData.date}
            onClose={() => setShowPreview(false)}
          />
        )}
      </form>
    </div>
  )
}
