'use client'

import { useState } from 'react'
import { ContentBlock } from '@/lib/firebase'
import { GripVertical, X, Image as ImageIcon, FileText, ImageIcon as ImageTextIcon, ArrowUp, ArrowDown } from 'lucide-react'
import RichTextEditor from './RichTextEditor'
import { useDropzone } from 'react-dropzone'
import { uploadToCloudinaryDirect } from '@/lib/cloudinary'
import toast from 'react-hot-toast'

interface BlockEditorProps {
  blocks: ContentBlock[]
  onChange: (blocks: ContentBlock[]) => void
}

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
    onChange(
      blocks.map((b) => (b.id === id ? { ...b, ...updates } : b))
    )
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
      toast.loading('Uploading image...')
      const url = await uploadToCloudinaryDirect(file)
      updateBlock(blockId, { imageUrl: url })
      toast.dismiss()
      toast.success('Image uploaded successfully!')
    } catch (error) {
      toast.dismiss()
      toast.error('Failed to upload image')
      console.error('Upload error:', error)
    } finally {
      setUploadingImage(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* Add Block Buttons */}
      <div className="flex flex-wrap gap-2 p-4 bg-gray-800 rounded-lg border border-gray-700">
        <button
          type="button"
          onClick={() => addBlock('text')}
          className="flex items-center gap-2 px-4 py-2 bg-space-gray border border-gray-600 rounded-lg text-white hover:border-cobalt-blue transition-colors"
        >
          <FileText className="w-4 h-4" />
          <span>Add Text Block</span>
        </button>
        <button
          type="button"
          onClick={() => addBlock('image')}
          className="flex items-center gap-2 px-4 py-2 bg-space-gray border border-gray-600 rounded-lg text-white hover:border-cobalt-blue transition-colors"
        >
          <ImageIcon className="w-4 h-4" />
          <span>Add Image Block</span>
        </button>
        <button
          type="button"
          onClick={() => addBlock('imageText')}
          className="flex items-center gap-2 px-4 py-2 bg-space-gray border border-gray-600 rounded-lg text-white hover:border-cobalt-blue transition-colors"
        >
          <ImageTextIcon className="w-4 h-4" />
          <span>Add Image + Text Block</span>
        </button>
      </div>

      {/* Blocks List */}
      <div className="space-y-4">
        {blocks.map((block, index) => (
          <div
            key={block.id}
            className="bg-space-gray rounded-lg border border-gray-700 p-4"
          >
            {/* Block Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <GripVertical className="w-5 h-5 text-gray-400" />
                <span className="text-white font-semibold">
                  {block.type === 'text' && 'Text Block'}
                  {block.type === 'image' && 'Image Block'}
                  {block.type === 'imageText' && 'Image + Text Block'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => moveBlock(block.id, 'up')}
                  disabled={index === 0}
                  className="p-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move Up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => moveBlock(block.id, 'down')}
                  disabled={index === blocks.length - 1}
                  className="p-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move Down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => removeBlock(block.id)}
                  className="p-1 text-red-400 hover:text-red-300"
                  title="Remove Block"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Block Content */}
            {block.type === 'text' && (
              <RichTextEditor
                value={block.content || ''}
                onChange={(html) => updateBlock(block.id, { content: html })}
                placeholder="Enter text content..."
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
          <div className="text-center py-12 text-gray-400">
            <p>No blocks yet. Add a block to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Image Block Component
function ImageBlockEditor({
  block,
  onUpdate,
  onImageUpload,
  uploading,
}: {
  block: ContentBlock
  onUpdate: (updates: Partial<ContentBlock>) => void
  onImageUpload: (file: File) => void
  uploading: boolean
}) {
  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] },
    maxFiles: 1,
    onDrop: (files) => {
      if (files[0]) onImageUpload(files[0])
    },
  })

  return (
    <div>
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-cobalt-blue transition-colors"
      >
        <input {...getInputProps()} />
        {block.imageUrl ? (
          <div>
            <img src={block.imageUrl} alt="Block image" className="max-w-full h-auto rounded-lg mb-2" />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onUpdate({ imageUrl: '' })
              }}
              className="mt-2 text-red-400 hover:text-red-300 text-sm"
            >
              Remove Image
            </button>
          </div>
        ) : (
          <div>
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-2" />
            <p className="text-gray-400">Click or drag to upload image</p>
            {uploading && <p className="text-cobalt-light mt-2">Uploading...</p>}
          </div>
        )}
      </div>
    </div>
  )
}

// Image + Text Block Component
function ImageTextBlockEditor({
  block,
  onUpdate,
  onImageUpload,
  uploading,
}: {
  block: ContentBlock
  onUpdate: (updates: Partial<ContentBlock>) => void
  onImageUpload: (file: File) => void
  uploading: boolean
}) {
  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] },
    maxFiles: 1,
    onDrop: (files) => {
      if (files[0]) onImageUpload(files[0])
    },
  })

  return (
    <div className="space-y-4">
      {/* Alignment Selector */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">Image Position</label>
        <select
          value={block.align || 'left'}
          onChange={(e) => onUpdate({ align: e.target.value as 'left' | 'right' })}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cobalt-blue"
        >
          <option value="left">Image Left, Text Right</option>
          <option value="right">Image Right, Text Left</option>
        </select>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">Image</label>
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:border-cobalt-blue transition-colors"
        >
          <input {...getInputProps()} />
          {block.imageUrl ? (
            <div>
              <img src={block.imageUrl} alt="Block image" className="max-w-full h-auto rounded-lg mb-2" />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onUpdate({ imageUrl: '' })
                }}
                className="mt-2 text-red-400 hover:text-red-300 text-sm"
              >
                Remove Image
              </button>
            </div>
          ) : (
            <div>
              <ImageIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-gray-400 text-sm">Click or drag to upload image</p>
              {uploading && <p className="text-cobalt-light mt-2 text-sm">Uploading...</p>}
            </div>
          )}
        </div>
      </div>

      {/* Text Content */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">Text Content</label>
        <RichTextEditor
          value={block.content || ''}
          onChange={(html) => onUpdate({ content: html })}
          placeholder="Enter text content..."
        />
      </div>
    </div>
  )
}

