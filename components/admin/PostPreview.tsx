'use client'

import { useState, useEffect } from 'react'
import { X, Eye } from 'lucide-react'
import { TemplateType, ContentBlock } from '@/lib/firebase'
import { getTypography } from '@/lib/typography'
import Image from 'next/image'

interface PostPreviewProps {
  templateType: TemplateType
  // Single Image Template
  imageUrl?: string
  richContent?: string
  // Document Template
  blocks?: ContentBlock[]
  // Common
  title?: string
  heading?: string
  author?: string
  date?: string
  onClose: () => void
}

export default function PostPreview({
  templateType,
  imageUrl,
  richContent,
  blocks,
  title,
  heading,
  author,
  date,
  onClose,
}: PostPreviewProps) {
  const [typography, setTypography] = useState<any>(null)

  useEffect(() => {
    loadTypography()
  }, [])

  const loadTypography = async () => {
    try {
      const typo = await getTypography()
      setTypography(typo)
    } catch (error) {
      console.error('Error loading typography:', error)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-space-black overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-space-black border-b border-gray-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Eye className="w-5 h-5 text-cobalt-light" />
          <h2 className="text-xl font-bold text-white">Preview</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Preview Content */}
      <div className="min-h-screen">
        {/* Single Image Template */}
        {templateType === 'singleImage' && (
          <div className="min-h-screen flex">
            {/* Sticky Image Left */}
            <div className="hidden md:block w-1/2 sticky top-0 h-screen overflow-hidden">
              {imageUrl ? (
                <div className="relative w-full h-full">
                  <Image
                    src={imageUrl}
                    alt={title || heading || 'Preview'}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <p className="text-gray-500">No image uploaded</p>
                </div>
              )}
            </div>

            {/* Scrollable Content Right */}
            <div className="w-full md:w-1/2 px-4 md:px-8 py-12">
              <div className="max-w-3xl mx-auto">
                {/* Mobile Image */}
                {imageUrl && (
                  <div className="md:hidden mb-8">
                    <Image
                      src={imageUrl}
                      alt={title || heading || 'Preview'}
                      width={800}
                      height={600}
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                )}

                {/* Header */}
                <div className="mb-8">
                  {(title || heading) && (
                    <h1
                      className="text-4xl md:text-5xl font-bold text-white mb-4 font-montserrat"
                      style={typography?.heading1 ? {
                        fontSize: typography.heading1.fontSize.desktop,
                        fontWeight: typography.heading1.fontWeight,
                        color: typography.heading1.color,
                        lineHeight: typography.heading1.lineHeight,
                      } : {}}
                    >
                      {title || heading}
                    </h1>
                  )}
                  {author && date && (
                    <p className="text-gray-400 mb-4">
                      By {author} • {new Date(date).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {/* Rich Content */}
                {richContent ? (
                  <div
                    className="prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: richContent }}
                    style={typography?.body ? {
                      fontSize: typography.body.fontSize.desktop,
                      fontWeight: typography.body.fontWeight,
                      color: typography.body.color,
                      lineHeight: typography.body.lineHeight,
                    } : {}}
                  />
                ) : (
                  <p className="text-gray-500 italic">No content added yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Document Template */}
        {templateType === 'document' && (
          <div className="min-h-screen px-4 md:px-8 py-12">
            <div className="max-w-5xl mx-auto">
              {/* Header */}
              <div className="mb-12">
                {(title || heading) && (
                  <h1
                    className="text-4xl md:text-5xl font-bold text-white mb-4 font-montserrat"
                    style={typography?.heading1 ? {
                      fontSize: typography.heading1.fontSize.desktop,
                      fontWeight: typography.heading1.fontWeight,
                      color: typography.heading1.color,
                      lineHeight: typography.heading1.lineHeight,
                    } : {}}
                  >
                    {title || heading}
                  </h1>
                )}
                {author && date && (
                  <p className="text-gray-400 mb-4">
                    By {author} • {new Date(date).toLocaleDateString()}
                  </p>
                )}
              </div>

              {/* Blocks */}
              {blocks && blocks.length > 0 ? (
                <div className="space-y-8">
                  {blocks
                    .sort((a, b) => a.order - b.order)
                    .map((block) => (
                      <div key={block.id}>
                        {block.type === 'text' && block.content && (
                          <div
                            className="prose prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: block.content }}
                            style={typography?.body ? {
                              fontSize: typography.body.fontSize.desktop,
                              fontWeight: typography.body.fontWeight,
                              color: typography.body.color,
                              lineHeight: typography.body.lineHeight,
                            } : {}}
                          />
                        )}

                        {block.type === 'image' && block.imageUrl && (
                          <div className="w-full">
                            <Image
                              src={block.imageUrl}
                              alt="Block image"
                              width={1200}
                              height={800}
                              className="w-full h-auto rounded-lg"
                            />
                          </div>
                        )}

                        {block.type === 'imageText' && (
                          <div
                            className={`flex flex-col ${
                              block.align === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'
                            } gap-6 items-start`}
                          >
                            {block.imageUrl && (
                              <div className="w-full md:w-1/2 flex-shrink-0">
                                <Image
                                  src={block.imageUrl}
                                  alt="Block image"
                                  width={600}
                                  height={400}
                                  className="w-full h-auto rounded-lg"
                                />
                              </div>
                            )}
                            {block.content && (
                              <div
                                className={`w-full md:w-1/2 prose prose-invert max-w-none ${
                                  block.align === 'right' ? 'md:text-right' : ''
                                }`}
                                dangerouslySetInnerHTML={{ __html: block.content }}
                                style={typography?.body ? {
                                  fontSize: typography.body.fontSize.desktop,
                                  fontWeight: typography.body.fontWeight,
                                  color: typography.body.color,
                                  lineHeight: typography.body.lineHeight,
                                } : {}}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-gray-500 italic text-center py-12">No blocks added yet</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

