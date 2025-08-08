'use client'

import { useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Image as ImageIcon, Plus, Edit, Trash2 } from 'lucide-react'
import { uploadToCloudinaryRobust } from '@/lib/cloudinary'
import toast from 'react-hot-toast'

interface Tag {
  id: string
  name: string
  color: string
  imageUrl?: string
}

export default function TagManager() {
  const [tags, setTags] = useState<Tag[]>([])
  const [newTag, setNewTag] = useState({ name: '', color: '#136fd7', imageUrl: '' })
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  // Mock data for testing
  useEffect(() => {
    setTags([
      { id: '1', name: 'Machine Learning', color: '#136fd7', imageUrl: '' },
      { id: '2', name: 'AI Ethics', color: '#ff6b6b', imageUrl: '' }
    ])
  }, [])

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
      let finalImageUrl = editingTag?.imageUrl || newTag.imageUrl

      // Upload image if new file selected
      if (imageFile) {
        toast.loading('Uploading image...')
        finalImageUrl = await uploadToCloudinaryRobust(imageFile, 'freezing-point/tags')
        toast.dismiss()
        toast.success('Image uploaded successfully!')
      }

      if (editingTag) {
        // Mock update
        setTags(prev => prev.map(tag => 
          tag.id === editingTag.id 
            ? { ...tag, name: newTag.name, color: newTag.color, imageUrl: finalImageUrl || undefined }
            : tag
        ))
        toast.success('Tag updated successfully!')
      } else {
        // Mock create
        const newTagWithId = {
          id: Date.now().toString(),
          name: newTag.name,
          color: newTag.color,
          imageUrl: finalImageUrl || undefined
        }
        setTags(prev => [...prev, newTagWithId])
        toast.success('Tag created successfully!')
      }

      // Reset form
      setNewTag({ name: '', color: '#136fd7', imageUrl: '' })
      setEditingTag(null)
      setImageFile(null)
    } catch (error) {
      console.error('Error saving tag:', error)
      toast.error('Failed to save tag')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag)
    setNewTag({
      name: tag.name,
      color: tag.color,
      imageUrl: tag.imageUrl || ''
    })
    setImageFile(null)
  }

  const handleDelete = async (tagId: string) => {
    if (window.confirm('Are you sure you want to delete this tag?')) {
      try {
        // Mock delete
        setTags(prev => prev.filter(tag => tag.id !== tagId))
        toast.success('Tag deleted successfully!')
      } catch (error) {
        console.error('Error deleting tag:', error)
        toast.error('Failed to delete tag')
      }
    }
  }

  const handleCancel = () => {
    setEditingTag(null)
    setNewTag({ name: '', color: '#136fd7', imageUrl: '' })
    setImageFile(null)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Tag Management</h2>

      {/* Create/Edit Form */}
      <div className="bg-space-gray rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          {editingTag ? 'Edit Tag' : 'Create New Tag'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tag Name */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Tag Name *
              </label>
              <input
                type="text"
                required
                value={newTag.name}
                onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cobalt-blue"
                placeholder="Enter tag name"
              />
            </div>

            {/* Tag Color */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Tag Color *
              </label>
              <input
                type="color"
                value={newTag.color}
                onChange={(e) => setNewTag({ ...newTag, color: e.target.value })}
                className="w-full h-10 bg-gray-800 border border-gray-600 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Tag Image (Optional)
            </label>
            <div
              {...getRootProps()}
              className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:border-cobalt-blue transition-colors"
            >
              <input {...getInputProps()} />
              <ImageIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              {imageFile ? (
                <div className="text-white">
                  <p>Selected: {imageFile.name}</p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setImageFile(null)
                    }}
                    className="mt-1 text-red-400 hover:text-red-300 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ) : (editingTag?.imageUrl || newTag.imageUrl) ? (
                <div className="text-white">
                  <p>Current image uploaded</p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setNewTag({ ...newTag, imageUrl: '' })
                    }}
                    className="mt-1 text-red-400 hover:text-red-300 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-gray-400 text-sm">Drag & drop an image here, or click to select</p>
                </div>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            {editingTag && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-cobalt-blue text-white rounded-lg hover:bg-cobalt-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  {editingTag ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  <span>{editingTag ? 'Update Tag' : 'Create Tag'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Tags List */}
      <div className="bg-space-gray rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Existing Tags</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  ></div>
                  <span className="text-white font-medium">{tag.name}</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(tag)}
                    className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(tag.id)}
                    className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {tag.imageUrl && (
                <div className="w-full h-20 bg-gray-700 rounded overflow-hidden">
                  <img
                    src={tag.imageUrl}
                    alt={tag.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        {tags.length === 0 && (
          <p className="text-gray-400 text-center py-8">No tags created yet.</p>
        )}
      </div>
    </div>
  )
} 