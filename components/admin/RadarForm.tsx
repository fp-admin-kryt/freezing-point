'use client'

import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Layout, BookOpen, Eye, ArrowLeft, Upload, X } from 'lucide-react'
import { uploadToCloudinaryDirect } from '@/lib/cloudinary'
import { saveRadarPost, TemplateType, ContentBlock } from '@/lib/firebase'
import TagSelector from './TagSelector'
import DomainSelector from './DomainSelector'
import BlockEditor from './BlockEditor'
import PostPreview from './PostPreview'
import { GradientButton } from '@/components/ui/gradient-button'
import toast from 'react-hot-toast'

interface RadarFormProps {
  onBack: () => void
  editPost?: any
}

const inputCls = "w-full px-4 py-2.5 bg-transparent border border-white/8 rounded-lg text-white placeholder-gray-700 font-sans text-sm focus:outline-none focus:border-cobalt-blue/50 transition-colors"
const labelCls = "block font-sans text-[10px] tracking-widest uppercase text-gray-600 mb-2"
const secBtnCls = "px-4 py-2.5 border border-white/8 rounded-lg text-gray-400 hover:text-white hover:border-white/20 transition-colors font-sans text-sm"

const toSlug = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()

const BODY_PLACEHOLDER = `## Introduction

Write your opening paragraph here. This becomes the lead text.

[IMAGE_1]

## Section Title

Your section body text goes here. Write naturally — each paragraph is separated by a blank line.

[GRID]
PHASE 01 | Discovery | Initial research and concept formation
PHASE 02 | Synthesis | Translating insights into frameworks
PHASE 03 | Application | Deploying systems in real-world contexts
[/GRID]

[IMAGE_2]

## Another Section

Continue your writing...

> A powerful pull quote or key insight goes here.

[IMAGE_3]

## Conclusion

Closing thoughts.`

interface ImageZoneProps {
  label: string
  hint: string
  file: File | null
  url: string
  onFile: (f: File | null) => void
  onUrl: (u: string) => void
}

function ImageZone({ label, hint, file, url, onFile, onUrl }: ImageZoneProps) {
  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] },
    maxFiles: 1,
    onDrop: (files) => onFile(files[0]),
  })
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <p className="font-sans text-[10px] text-gray-700 mb-2">{hint}</p>
      <div
        {...getRootProps()}
        className="border border-dashed border-white/10 rounded-xl p-5 text-center cursor-pointer hover:border-cobalt-blue/40 transition-colors"
      >
        <input {...getInputProps()} />
        {file ? (
          <div className="text-white flex items-center justify-center gap-3">
            <p className="font-sans text-sm">{file.name}</p>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onFile(null) }}
              className="text-gray-600 hover:text-red-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : url ? (
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="Preview" className="max-h-32 mx-auto rounded-lg mb-3 object-cover" />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onUrl('') }}
              className="font-sans text-xs text-red-400 hover:text-red-300"
            >
              Remove
            </button>
          </div>
        ) : (
          <div>
            <Upload className="mx-auto h-7 w-7 text-gray-700 mb-2" />
            <p className="font-body text-sm text-gray-600">Drag & drop or click</p>
            <p className="font-body text-xs text-gray-700 mt-0.5">PNG, JPG up to 10MB</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function RadarForm({ onBack, editPost }: RadarFormProps) {
  const [templateType, setTemplateType] = useState<TemplateType | ''>(editPost?.templateType || '')
  const [formData, setFormData] = useState({
    heading: editPost?.heading || '',
    content: editPost?.content || '',
    tags: editPost?.tags || [],
    domain: editPost?.domain || '',
    date: editPost?.date || new Date().toISOString().split('T')[0]
  })
  const [slug, setSlug] = useState<string>(editPost?.id || '')
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(!!editPost)

  // Default template state
  const [defaultContent, setDefaultContent] = useState(editPost?.defaultContent || '')
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverUrl, setCoverUrl] = useState(editPost?.imageUrl || '')
  const [img2File, setImg2File] = useState<File | null>(null)
  const [img2Url, setImg2Url] = useState(editPost?.image2Url || '')
  const [img3File, setImg3File] = useState<File | null>(null)
  const [img3Url, setImg3Url] = useState(editPost?.image3Url || '')

  // Document template state
  const [blocks, setBlocks] = useState<ContentBlock[]>(editPost?.blocks || [])

  const [loading, setLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const uploadImage = async (file: File, label: string): Promise<string> => {
    toast.loading(`Uploading ${label}…`)
    try {
      const url = await uploadToCloudinaryDirect(file)
      toast.dismiss()
      toast.success(`${label} uploaded!`)
      return url
    } catch (err) {
      toast.dismiss()
      toast.error(`Failed to upload ${label}`)
      throw err
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!templateType) { toast.error('Please select a template type'); return }
    if (!slug.trim()) { toast.error('Please enter a slug'); return }
    setLoading(true)
    try {
      const postData: any = { ...formData, templateType }

      if (templateType === 'default') {
        postData.defaultContent = defaultContent || undefined
        let finalCover = coverUrl
        let finalImg2 = img2Url
        let finalImg3 = img3Url
        if (coverFile) finalCover = await uploadImage(coverFile, 'Cover image')
        if (img2File) finalImg2 = await uploadImage(img2File, 'Body image 1')
        if (img3File) finalImg3 = await uploadImage(img3File, 'Body image 2')
        postData.imageUrl = finalCover || undefined
        postData.image2Url = finalImg2 || undefined
        postData.image3Url = finalImg3 || undefined
      } else if (templateType === 'document') {
        postData.blocks = blocks.length > 0 ? blocks : undefined
      }

      await saveRadarPost(postData, slug.trim())
      toast.success('Radar post saved!')
      onBack()
    } catch (error) {
      console.error('Error saving post:', error)
      toast.error('Failed to save post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div>
            <p className="font-sans text-[10px] tracking-[0.5em] uppercase text-cobalt-light mb-2">
              {editPost ? 'Edit' : 'Create'}
            </p>
            <h2 className="font-sans font-light text-2xl text-white">Radar Post</h2>
          </div>
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
              <label className={labelCls}>Heading *</label>
              <input type="text" required value={formData.heading}
                onChange={(e) => {
                  setFormData({ ...formData, heading: e.target.value })
                  if (!slugManuallyEdited) setSlug(toSlug(e.target.value))
                }}
                className={inputCls} placeholder="Radar post heading" />
            </div>
            <div>
              <label className={labelCls}>Date *</label>
              <input type="date" required value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className={inputCls} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Domain *</label>
              <DomainSelector
                selectedDomain={formData.domain}
                onChange={(domain) => setFormData({ ...formData, domain })}
                placeholder="Select domain"
              />
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
            <label className={labelCls}>Summary</label>
            <textarea value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
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
              placeholder="my-radar-post"
            />
            <p className="mt-1.5 font-sans text-[10px] text-gray-700">
              freezingpoint.ai/radar/<span className="text-gray-500">{slug || 'my-radar-post'}</span>
            </p>
          </div>
        </div>

        {/* Template selection */}
        {!editPost && (
          <div className="border border-white/8 rounded-xl p-6">
            <p className="font-sans text-[10px] tracking-widest uppercase text-gray-600 mb-4">Template *</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button type="button" onClick={() => setTemplateType('default')}
                className={`p-5 border rounded-xl transition-all text-left ${
                  templateType === 'default'
                    ? 'border-cobalt-blue/60 bg-cobalt-blue/8'
                    : 'border-white/8 hover:border-white/20'
                }`}>
                <BookOpen className="w-8 h-8 text-cobalt-light mb-3" />
                <h3 className="font-sans text-sm font-medium text-white mb-1">Default Blog</h3>
                <p className="font-body text-xs text-gray-600">Beautiful editorial layout with up to 3 images</p>
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

        {/* Default Blog editor */}
        {templateType === 'default' && (
          <div className="border border-white/8 rounded-xl p-6 space-y-6">
            <p className="font-sans text-[10px] tracking-widest uppercase text-gray-600">Default Blog Template</p>

            <div>
              <label className={labelCls}>Body Content *</label>
              <p className="font-sans text-[10px] text-gray-700 mb-3 leading-relaxed">
                Use <code className="text-cobalt-light/70 bg-white/4 px-1 rounded">## Heading</code> for section titles,&nbsp;
                <code className="text-cobalt-light/70 bg-white/4 px-1 rounded">{`> Quote`}</code> for pull quotes,&nbsp;
                <code className="text-cobalt-light/70 bg-white/4 px-1 rounded">[IMAGE_1]</code>&nbsp;
                <code className="text-cobalt-light/70 bg-white/4 px-1 rounded">[IMAGE_2]</code>&nbsp;
                <code className="text-cobalt-light/70 bg-white/4 px-1 rounded">[IMAGE_3]</code> for images,&nbsp;
                <code className="text-cobalt-light/70 bg-white/4 px-1 rounded">---</code> for a divider.
              </p>
              <p className="font-sans text-[10px] text-gray-700 mb-3 leading-relaxed">
                Auto-responsive grid: wrap cells in&nbsp;
                <code className="text-cobalt-light/70 bg-white/4 px-1 rounded">[GRID]</code> /&nbsp;
                <code className="text-cobalt-light/70 bg-white/4 px-1 rounded">[/GRID]</code>. One cell per line, fields pipe-separated:&nbsp;
                <code className="text-cobalt-light/70 bg-white/4 px-1 rounded">HEADER | Title | Content (italic)</code>.
              </p>
              <textarea
                value={defaultContent}
                onChange={(e) => setDefaultContent(e.target.value)}
                rows={18}
                className={`${inputCls} font-mono text-xs leading-relaxed`}
                placeholder={BODY_PLACEHOLDER}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ImageZone
                label="Cover / Hero Image"
                hint="Full-width hero at top. Also [IMAGE_1] in body."
                file={coverFile}
                url={coverUrl}
                onFile={setCoverFile}
                onUrl={setCoverUrl}
              />
              <ImageZone
                label="Body Image 2"
                hint="Inserted where [IMAGE_2] appears."
                file={img2File}
                url={img2Url}
                onFile={setImg2File}
                onUrl={setImg2Url}
              />
              <ImageZone
                label="Body Image 3"
                hint="Inserted where [IMAGE_3] appears."
                file={img3File}
                url={img3Url}
                onFile={setImg3File}
                onUrl={setImg3Url}
              />
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

        {/* Actions */}
        <div className="flex justify-end items-center gap-3 pt-2">
          <button type="button" onClick={onBack} className={secBtnCls}>Cancel</button>
          {templateType === 'document' && (
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

      {showPreview && templateType === 'document' && (
        <PostPreview
          templateType={templateType}
          imageUrl={coverUrl}
          richContent=""
          blocks={blocks}
          heading={formData.heading}
          date={formData.date}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  )
}
