'use client'

import { useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Edit, Trash2, Plus } from 'lucide-react'
import { Image as ImageIcon } from 'lucide-react'
import { uploadToCloudinaryDirect } from '@/lib/cloudinary'
import { saveTag, getTags, deleteTag, updateTag } from '@/lib/firebase'
import Image from 'next/image'
import { GradientButton } from '@/components/ui/gradient-button'
import toast from 'react-hot-toast'

interface Tag {
  id?: string
  name: string
  color: string
  imageUrl?: string
}

const inputCls = "w-full px-4 py-2.5 bg-transparent border border-white/8 rounded-lg text-white placeholder-gray-700 font-sans text-sm focus:outline-none focus:border-cobalt-blue/50 transition-colors"
const labelCls = "block font-sans text-[10px] tracking-widest uppercase text-gray-600 mb-2"
const secBtnCls = "px-4 py-2.5 border border-white/8 rounded-lg text-gray-400 hover:text-white hover:border-white/20 transition-colors font-sans text-sm"

export default function TagManager() {
  const [tags, setTags] = useState<Tag[]>([])
  const [newTag, setNewTag] = useState({ name: '', color: '#136fd7', imageUrl: '' })
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadTags = async () => {
      try {
        setTags(await getTags())
      } catch (error) {
        console.error('Error loading tags:', error)
        setTags([
          { id: '1', name: 'Machine Learning', color: '#136fd7' },
          { id: '2', name: 'AI Ethics', color: '#ff6b6b' }
        ])
      }
    }
    loadTags()
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] },
    maxFiles: 1,
    onDrop: (files) => setImageFile(files[0]),
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      let finalImageUrl = editingTag?.imageUrl || newTag.imageUrl
      if (imageFile) {
        toast.loading('Uploading image…')
        finalImageUrl = await uploadToCloudinaryDirect(imageFile)
        toast.dismiss()
        toast.success('Image uploaded!')
      }
      if (editingTag && editingTag.id) {
        await updateTag(editingTag.id, { name: newTag.name, color: newTag.color, imageUrl: finalImageUrl || undefined })
        setTags(await getTags())
        toast.success('Tag updated!')
      } else {
        await saveTag({ name: newTag.name, color: newTag.color, imageUrl: finalImageUrl || undefined })
        setTags(await getTags())
        toast.success('Tag created!')
      }
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
    setNewTag({ name: tag.name, color: tag.color, imageUrl: tag.imageUrl || '' })
    setImageFile(null)
  }

  const handleDelete = async (tagId: string) => {
    if (window.confirm('Delete this tag?')) {
      try {
        await deleteTag(tagId)
        setTags(prev => prev.filter(t => t.id !== tagId))
        toast.success('Tag deleted!')
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
    <div className="max-w-4xl space-y-6">
      {/* Form */}
      <div className="border border-white/8 rounded-xl p-6">
        <p className="font-sans text-[10px] tracking-widest uppercase text-gray-600 mb-5">
          {editingTag ? 'Edit Tag' : 'New Tag'}
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Tag Name *</label>
              <input type="text" required value={newTag.name}
                onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                className={inputCls} placeholder="Tag name" />
            </div>
            <div>
              <label className={labelCls}>Color *</label>
              <div className="flex items-center gap-2">
                <input type="color" value={newTag.color}
                  onChange={(e) => setNewTag({ ...newTag, color: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-white/8 bg-transparent p-0.5" />
                <input type="text" value={newTag.color}
                  onChange={(e) => setNewTag({ ...newTag, color: e.target.value })}
                  className={`${inputCls} flex-1`} placeholder="#136fd7" />
              </div>
            </div>
          </div>

          <div>
            <label className={labelCls}>Tag Image (optional)</label>
            <div {...getRootProps()}
              className="border border-dashed border-white/10 rounded-xl p-5 text-center cursor-pointer hover:border-cobalt-blue/40 transition-colors">
              <input {...getInputProps()} />
              {imageFile ? (
                <div>
                  <p className="font-sans text-sm text-white">{imageFile.name}</p>
                  <button type="button" onClick={(e) => { e.stopPropagation(); setImageFile(null) }}
                    className="mt-2 font-sans text-xs text-red-400 hover:text-red-300">Remove</button>
                </div>
              ) : (editingTag?.imageUrl || newTag.imageUrl) ? (
                <div>
                  <p className="font-sans text-sm text-gray-400 mb-1">Image attached</p>
                  <button type="button" onClick={(e) => { e.stopPropagation(); setNewTag({ ...newTag, imageUrl: '' }) }}
                    className="font-sans text-xs text-red-400 hover:text-red-300">Remove</button>
                </div>
              ) : (
                <div>
                  <Upload className="mx-auto h-6 w-6 text-gray-700 mb-2" />
                  <p className="font-body text-sm text-gray-600">Drag & drop or click to upload</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end items-center gap-3">
            {editingTag && (
              <button type="button" onClick={handleCancel} className={secBtnCls}>Cancel</button>
            )}
            <GradientButton
              type="submit"
              disabled={loading}
              className="!min-w-0 !px-6 !py-2.5 !text-sm !rounded-lg !font-light"
            >
              {loading ? 'Saving…' : editingTag ? 'Update Tag' : 'Create Tag'}
            </GradientButton>
          </div>
        </form>
      </div>

      {/* Tags list */}
      <div className="border border-white/8 rounded-xl p-6">
        <p className="font-sans text-[10px] tracking-widest uppercase text-gray-600 mb-5">Existing Tags</p>
        {tags.length === 0 ? (
          <p className="font-body text-gray-600 text-sm text-center py-8">No tags yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {tags.map((tag, index) => (
              <div key={tag.id || `tag-${index}`}
                className="border border-white/8 rounded-xl p-4 hover:border-white/15 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: tag.color }} />
                    <span className="font-sans text-sm text-white">{tag.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleEdit(tag)}
                      className="p-1.5 text-gray-600 hover:text-cobalt-light transition-colors">
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => tag.id && handleDelete(tag.id)}
                      className="p-1.5 text-gray-600 hover:text-red-400 transition-colors"
                      disabled={!tag.id}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                {tag.imageUrl && (
                  <div className="relative w-full h-16 rounded-lg overflow-hidden mt-2">
                    <Image src={tag.imageUrl} alt={tag.name} fill className="object-cover"
                      sizes="(max-width: 768px) 100vw, 300px" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
