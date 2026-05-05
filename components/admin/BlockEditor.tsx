'use client'

import { useState } from 'react'
import { ContentBlock, GridCell } from '@/lib/firebase'
import { GripVertical, X, Image as ImageIcon, FileText, ImageIcon as ImageTextIcon, ArrowUp, ArrowDown, Upload, Type, Quote, LayoutGrid, Plus } from 'lucide-react'
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

  const addBlock = (type: ContentBlock['type']) => {
    const isMedia = type === 'image' || type === 'imageText'
    const isGrid = type === 'grid'
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type,
      content: !isMedia && !isGrid ? '' : type === 'imageText' ? '' : undefined,
      imageUrl: isMedia ? '' : undefined,
      align: type === 'imageText' ? 'left' : undefined,
      cells: isGrid ? [{ header: '', title: '', content: '' }, { header: '', title: '', content: '' }] : undefined,
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
      <div className="p-4 border border-white/8 rounded-xl space-y-3">
        <div>
          <p className="font-sans text-[10px] tracking-widest uppercase text-gray-600 mb-2">Typography</p>
          <div className="flex flex-wrap gap-2">
            {[
              { type: 'sectionLabel' as const, icon: Type, label: 'Section Header' },
              { type: 'documentTitle' as const, icon: Type, label: 'Title' },
              { type: 'subtitle' as const, icon: Type, label: 'Subtitle' },
              { type: 'heading1' as const, icon: Type, label: 'Heading 1' },
              { type: 'heading2' as const, icon: Type, label: 'Heading 2' },
              { type: 'text' as const, icon: FileText, label: 'Body' },
              { type: 'pullQuote' as const, icon: Quote, label: 'Pull Quote' },
            ].map(({ type, icon: Icon, label }) => (
              <button key={type} type="button" onClick={() => addBlock(type)}
                className="flex items-center gap-2 px-3 py-1.5 border border-white/8 rounded-lg text-gray-400 hover:text-white hover:border-white/20 transition-colors font-sans text-xs">
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="font-sans text-[10px] tracking-widest uppercase text-gray-600 mb-2">Media</p>
          <div className="flex flex-wrap gap-2">
            {[
              { type: 'image' as const, icon: ImageIcon, label: 'Image' },
              { type: 'imageText' as const, icon: ImageTextIcon, label: 'Image + Text' },
            ].map(({ type, icon: Icon, label }) => (
              <button key={type} type="button" onClick={() => addBlock(type)}
                className="flex items-center gap-2 px-3 py-1.5 border border-white/8 rounded-lg text-gray-400 hover:text-white hover:border-white/20 transition-colors font-sans text-xs">
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="font-sans text-[10px] tracking-widest uppercase text-gray-600 mb-2">Layout</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => addBlock('grid')}
              className="flex items-center gap-2 px-3 py-1.5 border border-white/8 rounded-lg text-gray-400 hover:text-white hover:border-white/20 transition-colors font-sans text-xs">
              <LayoutGrid className="w-3.5 h-3.5" />
              Grid
            </button>
          </div>
        </div>
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
                  {block.type === 'sectionLabel' && 'Section Header'}
                  {block.type === 'documentTitle' && 'Title'}
                  {block.type === 'subtitle' && 'Subtitle'}
                  {block.type === 'heading1' && 'Heading 1'}
                  {block.type === 'heading2' && 'Heading 2'}
                  {block.type === 'text' && 'Body'}
                  {block.type === 'pullQuote' && 'Pull Quote'}
                  {block.type === 'image' && 'Image'}
                  {block.type === 'imageText' && 'Image + Text'}
                  {block.type === 'grid' && 'Grid'}
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

            {(['sectionLabel', 'documentTitle', 'subtitle', 'heading1', 'heading2'] as Array<ContentBlock['type']>).includes(block.type) && (
              <PlainTextEditor
                value={block.content || ''}
                onChange={(val) => updateBlock(block.id, { content: val })}
                placeholder={
                  block.type === 'sectionLabel' ? 'e.g. RADAR · 01 · HEALTH & AI' :
                  block.type === 'documentTitle' ? 'Article title…' :
                  block.type === 'subtitle' ? 'Subtitle or deck text…' :
                  block.type === 'heading1' ? 'e.g. THE BROKEN CHAIN' :
                  'Subheading…'
                }
              />
            )}

            {block.type === 'pullQuote' && (
              <PlainTextEditor
                value={block.content || ''}
                onChange={(val) => updateBlock(block.id, { content: val })}
                placeholder="Enter pull quote…"
                rows={3}
              />
            )}

            {block.type === 'text' && (
              <RichTextEditor
                value={block.content || ''}
                onChange={(html) => updateBlock(block.id, { content: html })}
                placeholder="Enter body text…"
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

            {block.type === 'grid' && (
              <GridBlockEditor
                cells={block.cells || []}
                onChange={(cells) => updateBlock(block.id, { cells })}
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

function PlainTextEditor({ value, onChange, placeholder, rows = 1 }: {
  value: string
  onChange: (val: string) => void
  placeholder?: string
  rows?: number
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-4 py-2.5 bg-transparent border border-white/8 rounded-lg text-white placeholder-gray-700 font-sans text-sm focus:outline-none focus:border-cobalt-blue/50 transition-colors resize-none"
    />
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

function GridBlockEditor({ cells, onChange }: {
  cells: GridCell[]
  onChange: (cells: GridCell[]) => void
}) {
  const update = (index: number, patch: Partial<GridCell>) => {
    onChange(cells.map((c, i) => (i === index ? { ...c, ...patch } : c)))
  }
  const remove = (index: number) => {
    onChange(cells.filter((_, i) => i !== index))
  }
  const move = (index: number, dir: 'up' | 'down') => {
    const newIndex = dir === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= cells.length) return
    const next = [...cells]
    ;[next[index], next[newIndex]] = [next[newIndex], next[index]]
    onChange(next)
  }
  const add = () => {
    onChange([...cells, { header: '', title: '', content: '' }])
  }

  return (
    <div className="space-y-3">
      <p className="font-sans text-[10px] text-gray-700 leading-relaxed">
        Cells stack on phones and auto-fit side-by-side on larger screens.
      </p>
      {cells.map((cell, i) => (
        <div key={i} className="border border-white/8 rounded-lg p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-sans text-[9px] tracking-widest uppercase text-gray-600">
              Cell {i + 1}
            </span>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => move(i, 'up')} disabled={i === 0}
                className="p-1 text-gray-600 hover:text-white disabled:opacity-25 transition-colors">
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button type="button" onClick={() => move(i, 'down')} disabled={i === cells.length - 1}
                className="p-1 text-gray-600 hover:text-white disabled:opacity-25 transition-colors">
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button type="button" onClick={() => remove(i)}
                className="p-1 text-gray-600 hover:text-red-400 transition-colors ml-1">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <input
            type="text"
            value={cell.header}
            onChange={(e) => update(i, { header: e.target.value })}
            placeholder="Header (e.g. STAGE 01)"
            className={inputCls}
          />
          <input
            type="text"
            value={cell.title}
            onChange={(e) => update(i, { title: e.target.value })}
            placeholder="Title"
            className={inputCls}
          />
          <textarea
            value={cell.content}
            onChange={(e) => update(i, { content: e.target.value })}
            placeholder="Content (rendered in italics)"
            rows={3}
            className={`${inputCls} resize-none`}
          />
        </div>
      ))}
      <button type="button" onClick={add}
        className="flex items-center gap-2 px-3 py-2 border border-dashed border-white/10 rounded-lg text-gray-500 hover:text-white hover:border-white/25 transition-colors font-sans text-xs w-full justify-center">
        <Plus className="w-3.5 h-3.5" />
        Add Cell
      </button>
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
