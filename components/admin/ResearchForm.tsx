'use client'

import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FileText, ArrowLeft, Upload, X, Image as ImageIcon } from 'lucide-react'
import { uploadToCloudinaryDirect } from '@/lib/cloudinary'
import { saveResearchPost, uploadPdfToStorage } from '@/lib/firebase'
import TagSelector from './TagSelector'
import { GradientButton } from '@/components/ui/gradient-button'
import toast from 'react-hot-toast'

interface ResearchFormProps {
  onBack: (refresh?: boolean) => void
  editPost?: any
}

const inputCls = "w-full px-4 py-2.5 bg-transparent border border-white/8 rounded-lg text-white placeholder-gray-700 font-sans text-sm focus:outline-none focus:border-cobalt-blue/50 transition-colors"
const labelCls = "block font-sans text-[10px] tracking-widest uppercase text-gray-600 mb-2"
const secBtnCls = "px-4 py-2.5 border border-white/8 rounded-lg text-gray-400 hover:text-white hover:border-white/20 transition-colors font-sans text-sm"

const toSlug = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()

export default function ResearchForm({ onBack, editPost }: ResearchFormProps) {
  const [formData, setFormData] = useState({
    title: editPost?.title || '',
    author: editPost?.author || '',
    date: editPost?.date || new Date().toISOString().split('T')[0],
    excerpt: editPost?.excerpt || '',
    tags: editPost?.tags || []
  })
  const [slug, setSlug] = useState<string>(editPost?.id || '')
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(!!editPost)

  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverUrl, setCoverUrl] = useState(editPost?.imageUrl || '')

  const [abstract, setAbstract] = useState(editPost?.abstract || '')
  const [previewBody, setPreviewBody] = useState(editPost?.previewBody || '')

  const [whitepaperFile, setWhitepaperFile] = useState<File | null>(null)
  const [whitepaperUrl, setWhitepaperUrl] = useState(editPost?.whitepaperUrl || '')

  const [loading, setLoading] = useState(false)

  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps } = useDropzone({
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] },
    maxFiles: 1,
    onDrop: (files) => setCoverFile(files[0]),
  })

  const { getRootProps: getPdfRootProps, getInputProps: getPdfInputProps } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    onDrop: (files) => setWhitepaperFile(files[0]),
  })

  const uploadImage = async (file: File): Promise<string> => {
    toast.loading('Uploading cover image…')
    try {
      const url = await uploadToCloudinaryDirect(file)
      toast.dismiss()
      toast.success('Cover image uploaded!')
      return url
    } catch (err) {
      toast.dismiss()
      toast.error('Failed to upload cover image')
      throw err
    }
  }

  const uploadPdf = async (file: File): Promise<string> => {
    toast.loading('Uploading PDF…')
    try {
      const url = await uploadPdfToStorage(file, slug.trim())
      toast.dismiss()
      toast.success('PDF uploaded!')
      return url
    } catch (err) {
      toast.dismiss()
      toast.error('Failed to upload PDF')
      throw err
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!slug.trim()) { toast.error('Please enter a slug'); return }
    if (!abstract.trim()) { toast.error('Please enter an abstract'); return }
    setLoading(true)

    let finalCover = coverUrl
    let finalPdf = whitepaperUrl

    try {
      if (coverFile) finalCover = await uploadImage(coverFile)
    } catch {
      setLoading(false)
      return
    }

    if (whitepaperFile) {
      try {
        finalPdf = await uploadPdf(whitepaperFile)
        setWhitepaperFile(null)
      } catch {
        // PDF upload failed — clear the file so future saves aren't blocked,
        // keep the existing whitepaperUrl, and continue saving text changes
        setWhitepaperFile(null)
        toast.error('PDF upload failed — saving other changes without it')
      }
    }

    try {
      const postData: any = {
        ...formData,
        imageUrl: finalCover || undefined,
        whitepaperUrl: finalPdf || undefined,
        abstract: abstract || undefined,
        previewBody: previewBody || undefined,
        templateType: 'default',
      }
      await saveResearchPost(postData, slug.trim())
      toast.success('Post saved!')
      onBack(true)
    } catch (error) {
      console.error('Error saving research post:', error)
      toast.error('Failed to save — check console for details')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-sans text-[10px] tracking-[0.5em] uppercase text-cobalt-light mb-2">
            {editPost ? 'Edit' : 'Create'}
          </p>
          <h2 className="font-sans font-light text-2xl text-white">Research Post</h2>
        </div>
        <button onClick={() => onBack()} className={`flex items-center gap-2 ${secBtnCls}`}>
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

        {/* Cover image */}
        <div className="border border-white/8 rounded-xl p-6 space-y-4">
          <p className="font-sans text-[10px] tracking-widest uppercase text-gray-600">Cover Image</p>
          <div {...getImageRootProps()}
            className="border border-dashed border-white/10 rounded-xl p-6 text-center cursor-pointer hover:border-cobalt-blue/40 transition-colors">
            <input {...getImageInputProps()} />
            {coverFile ? (
              <div className="text-white flex items-center justify-center gap-3">
                <p className="font-sans text-sm">{coverFile.name}</p>
                <button type="button" onClick={(e) => { e.stopPropagation(); setCoverFile(null) }}
                  className="text-gray-600 hover:text-red-400 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : coverUrl ? (
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={coverUrl} alt="Preview" className="max-h-40 mx-auto rounded-lg mb-3 object-cover" />
                <button type="button" onClick={(e) => { e.stopPropagation(); setCoverUrl('') }}
                  className="font-sans text-xs text-red-400 hover:text-red-300">Remove</button>
              </div>
            ) : (
              <div>
                <ImageIcon className="mx-auto h-8 w-8 text-gray-700 mb-3" />
                <p className="font-body text-sm text-gray-600">Drag & drop or click to upload</p>
                <p className="font-body text-xs text-gray-700 mt-1">PNG, JPG up to 10MB</p>
              </div>
            )}
          </div>
        </div>

        {/* Abstract */}
        <div className="border border-white/8 rounded-xl p-6 space-y-3">
          <div>
            <label className={labelCls}>Abstract *</label>
            <p className="font-sans text-[10px] text-gray-700 mb-2">
              The visible summary shown on the paper page. Separate paragraphs with a blank line.
            </p>
          </div>
          <textarea
            required
            value={abstract}
            onChange={(e) => setAbstract(e.target.value)}
            rows={8}
            className={inputCls}
            placeholder="Write the abstract / summary that readers will see in full…"
          />
        </div>

        {/* Preview body (blurred) */}
        <div className="border border-white/8 rounded-xl p-6 space-y-3">
          <div>
            <label className={labelCls}>Preview Body (shown blurred)</label>
            <p className="font-sans text-[10px] text-gray-700 mb-2">
              Text that appears blurred behind the &ldquo;Download Paper&rdquo; CTA — gives readers a glimpse of the depth without giving the paper away. Separate paragraphs with a blank line.
            </p>
          </div>
          <textarea
            value={previewBody}
            onChange={(e) => setPreviewBody(e.target.value)}
            rows={8}
            className={inputCls}
            placeholder="A teaser of the body text — methodology, findings, snippets…"
          />
        </div>

        {/* Whitepaper PDF */}
        <div className="border border-white/8 rounded-xl p-6 space-y-3">
          <div>
            <label className={labelCls}>Whitepaper PDF</label>
            <p className="font-sans text-[10px] text-gray-700 mb-2">
              The full paper users can view from the CTA on the blurred section.
            </p>
          </div>
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
                <p className="font-sans text-sm text-gray-400 mb-2">PDF attached</p>
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
          <button type="button" onClick={() => onBack()} className={secBtnCls}>Cancel</button>
          <GradientButton
            type="submit"
            disabled={loading}
            className="!min-w-0 !px-6 !py-2.5 !text-sm !rounded-lg !font-light"
          >
            {loading ? 'Saving…' : editPost ? 'Update Post' : 'Publish Post'}
          </GradientButton>
        </div>
      </form>
    </div>
  )
}
