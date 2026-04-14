'use client'

import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FileText, Image as ImageIcon, Layout, FileImage, Eye, ArrowLeft, Upload, X } from 'lucide-react'
import { uploadToCloudinaryDirect } from '@/lib/cloudinary'
import { saveResearchPost, TemplateType, ContentBlock } from '@/lib/firebase'
import TagSelector from './TagSelector'
import RichTextEditor from './RichTextEditor'
import BlockEditor from './BlockEditor'
import PostPreview from './PostPreview'
import { GradientButton } from '@/components/ui/gradient-button'
import toast from 'react-hot-toast'

interface ResearchFormProps {
  onBack: () => void
  editPost?: any
}

const inputCls = "w-full px-4 py-2.5 bg-transparent border border-white/8 rounded-lg text-white placeholder-gray-700 font-sans text-sm focus:outline-none focus:border-cobalt-blue/50 transition-colors"
const labelCls = "block font-sans text-[10px] tracking-widest uppercase text-gray-600 mb-2"
const secBtnCls = "px-4 py-2.5 border border-white/8 rounded-lg text-gray-400 hover:text-white hover:border-white/20 transition-colors font-sans text-sm"

const toSlug = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()

export default function ResearchForm({ onBack, editPost }: ResearchFormProps) {
  const [templateType, setTemplateType] = useState<TemplateType | ''>(editPost?.templateType || '')
  const [formData, setFormData] = useState({
    title: editPost?.title || '',
    author: editPost?.author || '',
    date: editPost?.date || new Date().toISOString().split('T')[0],
    excerpt: editPost?.excerpt || '',
    tags: editPost?.tags || []
  })
  const [slug, setSlug] = useState<string>(editPost?.id || '')
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(!!editPost)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState(editPost?.imageUrl || '')
  const [richContent, setRichContent] = useState(editPost?.richContent || '')
  const [blocks, setBlocks] = useState<ContentBlock[]>(editPost?.blocks || [])
  const [whitepaperFile, setWhitepaperFile] = useState<File | null>(null)
  const [whitepaperUrl, setWhitepaperUrl] = useState(editPost?.whitepaperUrl || '')
  const [loading, setLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps } = useDropzone({
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] },
    maxFiles: 1,
    onDrop: (files) => setImageFile(files[0]),
  })

  const { getRootProps: getPdfRootProps, getInputProps: getPdfInputProps } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    onDrop: (files) => setWhitepaperFile(files[0]),
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!templateType) { toast.error('Please select a template type'); return }
    if (!slug.trim()) { toast.error('Please enter a slug'); return }
    setLoading(true)
    try {
      let finalImageUrl = imageUrl
      let finalWhitepaperUrl = whitepaperUrl
      if (imageFile && templateType === 'singleImage') {
        toast.loading('Uploading image…')
        try { finalImageUrl = await uploadToCloudinaryDirect(imageFile); toast.dismiss(); toast.success('Image uploaded!') }
        catch (err) { toast.dismiss(); toast.error('Failed to upload image'); throw err }
      }
      if (whitepaperFile) {
        toast.loading('Uploading whitepaper…')
        try { finalWhitepaperUrl = await uploadToCloudinaryDirect(whitepaperFile); toast.dismiss(); toast.success('Whitepaper uploaded!') }
        catch (err) { toast.dismiss(); toast.error('Failed to upload whitepaper'); throw err }
      }
      const postData: any = { ...formData, templateType, whitepaperUrl: finalWhitepaperUrl || undefined }
      if (templateType === 'singleImage') { postData.imageUrl = finalImageUrl || undefined; postData.richContent = richContent || undefined }
      else if (templateType === 'document') { postData.blocks = blocks.length > 0 ? blocks : undefined }
      await saveResearchPost(postData, slug.trim())
      toast.success('Research post saved!')
      onBack()
    } catch (error) {
      console.error('Error saving research post:', error)
      toast.error('Failed to save research post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-sans text-[10px] tracking-[0.5em] uppercase text-cobalt-light mb-2">
            {editPost ? 'Edit' : 'Create'}
          </p>
          <h2 className="font-sans font-light text-2xl text-white">Research Post</h2>
        </div>
        <button onClick={onBack} className={`flex items-center gap-2 ${secBtnCls}`}>
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic fields */}
        <div className="border border-white/8 rounded-xl p-6 space-y-5">
          <p className="font-sans text-[10px] tracking-widest uppercase text-gray-600">Details</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Title *</label>
              <input type="text" required value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value })
                  if (!slugManuallyEdited) setSlug(toSlug(e.target.value))
                }}
                className={inputCls} placeholder="Research title" />
            </div>
            <div>
              <label className={labelCls}>Author *</label>
              <input type="text" required value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className={inputCls} placeholder="Author name" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Date *</label>
              <input type="date" required value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Tags</label>
              <TagSelector
                selectedTags={formData.tags}
                onChange={(tags) => setFormData({ ...formData, tags })}
                placeholder="Select tags"
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>Excerpt *</label>
            <textarea required value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              rows={3} className={inputCls} placeholder="Short preview text shown on cards" />
          </div>
          <div>
            <label className={labelCls}>Slug (URL) *</label>
            <input
              type="text"
              required
              value={slug}
              disabled={!!editPost}
              onChange={(e) => {
                setSlug(toSlug(e.target.value))
                setSlugManuallyEdited(true)
              }}
              className={`${inputCls} ${editPost ? 'opacity-40 cursor-not-allowed' : ''}`}
              placeholder="my-research-title"
            />
            <p className="mt-1.5 font-sans text-[10px] text-gray-700">
              freezingpoint.ai/research/<span className="text-gray-500">{slug || 'my-research-title'}</span>
            </p>
          </div>
        </div>

        {/* Template selection */}
        {!editPost && (
          <div className="border border-white/8 rounded-xl p-6">
            <p className="font-sans text-[10px] tracking-widest uppercase text-gray-600 mb-4">Template *</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button type="button" onClick={() => setTemplateType('singleImage')}
                className={`p-5 border rounded-xl transition-all text-left ${
                  templateType === 'singleImage'
                    ? 'border-cobalt-blue/60 bg-cobalt-blue/8'
                    : 'border-white/8 hover:border-white/20'
                }`}>
                <FileImage className="w-8 h-8 text-cobalt-light mb-3" />
                <h3 className="font-sans text-sm font-medium text-white mb-1">Single Image</h3>
                <p className="font-body text-xs text-gray-600">Sticky image left, rich text right</p>
              </button>
              <button type="button" onClick={() => setTemplateType('document')}
                className={`p-5 border rounded-xl transition-all text-left ${
                  templateType === 'document'
                    ? 'border-cobalt-blue/60 bg-cobalt-blue/8'
                    : 'border-white/8 hover:border-white/20'
                }`}>
                <Layout className="w-8 h-8 text-cobalt-light mb-3" />
                <h3 className="font-sans text-sm font-medium text-white mb-1">Document</h3>
                <p className="font-body text-xs text-gray-600">Flexible block-based layout</p>
              </button>
            </div>
          </div>
        )}

        {/* Single Image editor */}
        {templateType === 'singleImage' && (
          <div className="border border-white/8 rounded-xl p-6 space-y-5">
            <p className="font-sans text-[10px] tracking-widest uppercase text-gray-600">Single Image Template</p>
            <div>
              <label className={labelCls}>Sticky Image (left side) *</label>
              <div {...getImageRootProps()}
                className="border border-dashed border-white/10 rounded-xl p-6 text-center cursor-pointer hover:border-cobalt-blue/40 transition-colors">
                <input {...getImageInputProps()} />
                {imageFile ? (
                  <div className="text-white">
                    <p className="font-sans text-sm">{imageFile.name}</p>
                    <button type="button" onClick={(e) => { e.stopPropagation(); setImageFile(null) }}
                      className="mt-2 font-sans text-xs text-red-400 hover:text-red-300">Remove</button>
                  </div>
                ) : imageUrl ? (
                  <div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageUrl} alt="Preview" className="max-h-40 mx-auto rounded-lg mb-3" />
                    <button type="button" onClick={(e) => { e.stopPropagation(); setImageUrl('') }}
                      className="font-sans text-xs text-red-400 hover:text-red-300">Remove</button>
                  </div>
                ) : (
                  <div>
                    <Upload className="mx-auto h-8 w-8 text-gray-700 mb-3" />
                    <p className="font-body text-sm text-gray-600">Drag & drop or click to upload</p>
                    <p className="font-body text-xs text-gray-700 mt-1">PNG, JPG up to 10MB</p>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className={labelCls}>Rich Text Content (right side) *</label>
              <RichTextEditor value={richContent} onChange={setRichContent} placeholder="Enter formatted content…" />
            </div>
          </div>
        )}

        {/* Document editor */}
        {templateType === 'document' && (
          <div className="border border-white/8 rounded-xl p-6 space-y-4">
            <p className="font-sans text-[10px] tracking-widest uppercase text-gray-600">Document Template</p>
            <BlockEditor blocks={blocks} onChange={setBlocks} />
          </div>
        )}

        {/* Whitepaper upload */}
        <div className="border border-white/8 rounded-xl p-6">
          <label className={labelCls}>Whitepaper PDF (optional)</label>
          <div {...getPdfRootProps()}
            className="border border-dashed border-white/10 rounded-xl p-6 text-center cursor-pointer hover:border-cobalt-blue/40 transition-colors">
            <input {...getPdfInputProps()} />
            {whitepaperFile ? (
              <div className="text-white">
                <p className="font-sans text-sm">{whitepaperFile.name}</p>
                <button type="button" onClick={(e) => { e.stopPropagation(); setWhitepaperFile(null) }}
                  className="mt-2 font-sans text-xs text-red-400 hover:text-red-300">Remove</button>
              </div>
            ) : whitepaperUrl ? (
              <div>
                <p className="font-sans text-sm text-gray-400 mb-2">Whitepaper attached</p>
                <button type="button" onClick={(e) => { e.stopPropagation(); setWhitepaperUrl('') }}
                  className="font-sans text-xs text-red-400 hover:text-red-300">Remove</button>
              </div>
            ) : (
              <div>
                <FileText className="mx-auto h-8 w-8 text-gray-700 mb-3" />
                <p className="font-body text-sm text-gray-600">Drag & drop or click to upload PDF</p>
                <p className="font-body text-xs text-gray-700 mt-1">PDF up to 25MB</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end items-center gap-3 pt-2">
          <button type="button" onClick={onBack} className={secBtnCls}>Cancel</button>
          {templateType && (
            <button type="button" onClick={() => setShowPreview(true)}
              className={`flex items-center gap-2 ${secBtnCls}`}>
              <Eye className="w-4 h-4" /> Preview
            </button>
          )}
          <GradientButton
            type="submit"
            disabled={loading || !templateType}
            className="!min-w-0 !px-6 !py-2.5 !text-sm !rounded-lg !font-light"
          >
            {loading ? 'Saving…' : editPost ? 'Update Post' : 'Publish Post'}
          </GradientButton>
        </div>
      </form>

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
    </div>
  )
}
