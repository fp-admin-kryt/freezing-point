'use client'

import { useState } from 'react'
import { ContentBlock } from '@/lib/firebase'
import { GripVertical, X, Image as ImageIcon, FileText, ImageIcon as ImageTextIcon, ArrowUp, ArrowDown, Upload } from 'lucide-react'
import RichTextEditor from './RichTextEditor'
import { useDropzone } from 'react-dropzone'
import { uploadToCloudinaryDirect } from '@/lib/cloudinary'
import toast from 'react-hot-toast'

interface BlockEditorProps {
  blocks: ContentBlock[]
  onChange: (blocks: ContentBlock[]) => void
}

const labelCls = "block font-sans text-[10px] tracking-widest uppercase text-gray-600 mb-2"
const inputCls = "w-full px-4 py-2.5 bg-transparent border border-white/8 rounded-lg text-white placeholder-gray-700 font-sans text-sm focus:outline-none focus:border-cobalt-blue/50 transition-colors"

export default function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const [uploadingImage, setUploadingImage] = useState<string | null>(null)

  const addBlock = (type: 'text' | 'image' | 'imageText') => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type,
      content: type === 'text' || type === 'imageText' ? '' : undefined,
      imageUrl: type === 'image' || type === 'imageText' ? '' : undefined,
      align: type === 'imageText' ? 'left' : undefined,
      order: blocks.length,
    }
    onChange([...blocks, newBlock])
  }

  const removeBlock = (id: string) => {
    onChange(blocks.filter((b) => b.id !== id).map((b, idx) => ({ ...b, order: idx })))
  }

  const updateBlock = (id: string, updates: Partial<ContentBlock>) => {
    onChange(blocks.map((b) => (b.id === id ? { ...b, ...updates } : b)))
  }

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex((b) => b.id === id)
    if (index === -1) return
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= blocks.length) return
    const newBlocks = [...blocks]
    ;[newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]]
    onChange(newBlocks.map((b, idx) => ({ ...b, order: idx })))
  }

  const handleImageUpload = async (blockId: string, file: File) => {
    setUploadingImage(blockId)
    try {
      toast.loading('Uploading image…')
      const url = await uploadToCloudinaryDirect(file)
      updateBlock(blockId, { imageUrl: url })
      toast.dismiss()
      toast.success('Image uploaded!')
    } catch (error) {
      toast.dismiss()
      toast.error('Failed to upload image')
    } finally {
      setUploadingImage(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* Add block toolbar */}
      <div className="flex flex-wrap gap-2 p-4 border border-white/8 rounded-xl">
        <p className="w-full font-sans text-[10px] tracking-widest uppercase text-gray-600 mb-1">Add Block</p>
        {[
          { type: 'text' as const, icon: FileText, label: 'Text' },
          { type: 'image' as const, icon: ImageIcon, label: 'Image' },
          { type: 'imageText' as const, icon: ImageTextIcon, label: 'Image + Text' },
        ].map(({ type, icon: Icon, label }) => (
          <button key={type} type="button" onClick={() => addBlock(type)}
            className="flex items-center gap-2 px-4 py-2 border border-white/8 rounded-lg text-gray-400 hover:text-white hover:border-white/20 transition-colors font-sans text-sm">
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Blocks */}
      <div className="space-y-3">
        {blocks.map((block, index) => (
          <div key={block.id} className="border border-white/8 rounded-xl p-4">
            {/* Block header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-gray-700" />
                <span className="font-sans text-xs tracking-wider uppercase text-gray-500">
                  {block.type === 'text' && 'Text Block'}
                  {block.type === 'image' && 'Image Block'}
                  {block.type === 'imageText' && 'Image + Text Block'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => moveBlock(block.id, 'up')}
                  disabled={index === 0}
                  className="p-1.5 text-gray-600 hover:text-white disabled:opacity-25 transition-colors">
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={() => moveBlock(block.id, 'down')}
                  disabled={index === blocks.length - 1}
                  className="p-1.5 text-gray-600 hover:text-white disabled:opacity-25 transition-colors">
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={() => removeBlock(block.id)}
                  className="p-1.5 text-gray-600 hover:text-red-400 transition-colors ml-1">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {block.type === 'text' && (
              <RichTextEditor
                value={block.content || ''}
                onChange={(html) => updateBlock(block.id, { content: html })}
                placeholder="Enter text content…"
              />
            )}

            {block.type === 'image' && (
              <ImageBlockEditor
                block={block}
                onUpdate={(updates) => updateBlock(block.id, updates)}
                onImageUpload={(file) => handleImageUpload(block.id, file)}
                uploading={uploadingImage === block.id}
              />
            )}

            {block.type === 'imageText' && (
              <ImageTextBlockEditor
                block={block}
                onUpdate={(updates) => updateBlock(block.id, updates)}
                onImageUpload={(file) => handleImageUpload(block.id, file)}
                uploading={uploadingImage === block.id}
              />
            )}
          </div>
        ))}

        {blocks.length === 0 && (
          <div className="text-center py-10">
            <p className="font-body text-gray-700 text-sm">No blocks yet. Add one above.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function ImageBlockEditor({ block, onUpdate, onImageUpload, uploading }: {
  block: ContentBlock
  onUpdate: (updates: Partial<ContentBlock>) => void
  onImageUpload: (file: File) => void
  uploading: boolean
}) {
  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] },
    maxFiles: 1,
    onDrop: (files) => { if (files[0]) onImageUpload(files[0]) },
  })

  return (
    <div {...getRootProps()}
      className="border border-dashed border-white/10 rounded-xl p-6 text-center cursor-pointer hover:border-cobalt-blue/40 transition-colors">
      <input {...getInputProps()} />
      {block.imageUrl ? (
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={block.imageUrl} alt="Block" className="max-h-48 mx-auto rounded-lg mb-3" />
          <button type="button" onClick={(e) => { e.stopPropagation(); onUpdate({ imageUrl: '' }) }}
            className="font-sans text-xs text-red-400 hover:text-red-300">Remove</button>
        </div>
      ) : (
        <div>
          <Upload className="mx-auto h-7 w-7 text-gray-700 mb-2" />
          <p className="font-body text-sm text-gray-600">Click or drag to upload</p>
          {uploading && <p className="font-sans text-xs text-cobalt-light mt-2">Uploading…</p>}
        </div>
      )}
    </div>
  )
}

function ImageTextBlockEditor({ block, onUpdate, onImageUpload, uploading }: {
  block: ContentBlock
  onUpdate: (updates: Partial<ContentBlock>) => void
  onImageUpload: (file: File) => void
  uploading: boolean
}) {
  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] },
    maxFiles: 1,
    onDrop: (files) => { if (files[0]) onImageUpload(files[0]) },
  })

  return (
    <div className="space-y-4">
      <div>
        <label className={labelCls}>Image Position</label>
        <select value={block.align || 'left'} onChange={(e) => onUpdate({ align: e.target.value as 'left' | 'right' })}
          className={inputCls}>
          <option value="left" className="bg-[#0e0e12]">Image Left, Text Right</option>
          <option value="right" className="bg-[#0e0e12]">Image Right, Text Left</option>
        </select>
      </div>
      <div>
        <label className={labelCls}>Image</label>
        <div {...getRootProps()}
          className="border border-dashed border-white/10 rounded-xl p-5 text-center cursor-pointer hover:border-cobalt-blue/40 transition-colors">
          <input {...getInputProps()} />
          {block.imageUrl ? (
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={block.imageUrl} alt="Block" className="max-h-32 mx-auto rounded-lg mb-2" />
              <button type="button" onClick={(e) => { e.stopPropagation(); onUpdate({ imageUrl: '' }) }}
                className="font-sans text-xs text-red-400 hover:text-red-300">Remove</button>
            </div>
          ) : (
            <div>
              <Upload className="mx-auto h-6 w-6 text-gray-700 mb-2" />
              <p className="font-body text-sm text-gray-600">Click or drag to upload</p>
              {uploading && <p className="font-sans text-xs text-cobalt-light mt-1">Uploading…</p>}
            </div>
          )}
        </div>
      </div>
      <div>
        <label className={labelCls}>Text Content</label>
        <RichTextEditor value={block.content || ''} onChange={(html) => onUpdate({ content: html })} placeholder="Enter text…" />
      </div>
    </div>
  )
}
