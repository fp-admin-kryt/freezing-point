'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Download, ArrowLeft } from 'lucide-react'
import { getResearchPosts, ResearchPost } from '@/lib/firebase'
import { getTagById } from '@/lib/dataService'
import { getTypography } from '@/lib/typography'
import Navigation from '@/components/Navigation'
import Image from 'next/image'

export default function ResearchDetailPage() {
  const params = useParams()
  const postId = params.id as string
  const [post, setPost] = useState<ResearchPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [typography, setTypography] = useState<any>(null)

  useEffect(() => {
    const loadPost = async () => {
      try {
        const posts = await getResearchPosts()
        const found = posts.find((p) => p.id === postId)
        setPost(found || null)
      } catch (error) {
        console.error('Error loading post:', error)
      } finally {
        setLoading(false)
      }
    }

    const loadTypography = async () => {
      try {
        const typo = await getTypography()
        setTypography(typo)
      } catch (error) {
        console.error('Error loading typography:', error)
      }
    }

    loadPost()
    loadTypography()
  }, [postId])

  if (loading) {
    return (
      <div className="min-h-screen bg-space-black flex items-center justify-center">
        <div className="text-cobalt-light">Loading...</div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-space-black flex items-center justify-center">
        <div className="text-red-400">Post not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-space-black">
      <Navigation />
      <div className="pt-24">
        {/* Single Image Template */}
        {post.templateType === 'singleImage' && (
          <div className="min-h-screen flex">
            {/* Sticky Image Left */}
            <div className="hidden md:block w-1/2 sticky top-24 h-screen overflow-hidden">
              {post.imageUrl && (
                <div className="relative w-full h-full">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}
            </div>

            {/* Scrollable Content Right */}
            <div className="w-full md:w-1/2 px-4 md:px-8 py-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto"
              >
                {/* Mobile Image */}
                {post.imageUrl && (
                  <div className="md:hidden mb-8">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      width={800}
                      height={600}
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                )}

                {/* Header */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    {post.tags.map((tagId: string) => {
                      const tag = getTagById(tagId)
                      return tag ? (
                        <span
                          key={tagId}
                          className="px-3 py-1 text-sm rounded-full text-white"
                          style={{ backgroundColor: tag.color }}
                        >
                          {tag.name}
                        </span>
                      ) : null
                    })}
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <h1
                      className="text-4xl md:text-5xl font-bold text-white font-montserrat"
                      style={typography?.heading1 ? {
                        fontSize: typography.heading1.fontSize.desktop,
                        fontWeight: typography.heading1.fontWeight,
                        color: typography.heading1.color,
                        lineHeight: typography.heading1.lineHeight,
                      } : {}}
                    >
                      {post.title}
                    </h1>
                    {post.whitepaperUrl && (
                      <a
                        href={post.whitepaperUrl}
                        onClick={(e) => {
                          e.preventDefault()
                          const url = post.whitepaperUrl
                          if (!url) return
                          // Force download for Cloudinary PDFs
                          const link = document.createElement('a')
                          link.href = url
                          link.download = `${post.title || 'whitepaper'}.pdf`
                          link.target = '_blank'
                          document.body.appendChild(link)
                          link.click()
                          document.body.removeChild(link)
                        }}
                        className="ml-4 inline-flex items-center gap-2 px-4 py-2 bg-cobalt-blue text-white rounded-lg hover:bg-cobalt-light transition-colors flex-shrink-0"
                      >
                        <Download className="w-4 h-4" />
                        <span className="hidden md:inline">Download PDF</span>
                      </a>
                    )}
                  </div>
                  <p className="text-gray-400 mb-4">
                    By {post.author} • {new Date(post.date).toLocaleDateString()}
                  </p>
                </div>

                {/* Rich Content */}
                {post.richContent && (
                  <div
                    className="prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: post.richContent }}
                    style={typography?.body ? {
                      fontSize: typography.body.fontSize.desktop,
                      fontWeight: typography.body.fontWeight,
                      color: typography.body.color,
                      lineHeight: typography.body.lineHeight,
                    } : {}}
                  />
                )}
              </motion.div>
            </div>
          </div>
        )}

        {/* Document Template */}
        {post.templateType === 'document' && (
          <div className="min-h-screen px-4 md:px-8 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-5xl mx-auto"
            >
              {/* Header */}
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-4">
                  {post.tags.map((tagId: string) => {
                    const tag = getTagById(tagId)
                    return tag ? (
                      <span
                        key={tagId}
                        className="px-3 py-1 text-sm rounded-full text-white"
                        style={{ backgroundColor: tag.color }}
                      >
                        {tag.name}
                      </span>
                    ) : null
                  })}
                </div>
                <div className="flex items-center justify-between mb-4">
                  <h1
                    className="text-4xl md:text-5xl font-bold text-white font-montserrat"
                    style={typography?.heading1 ? {
                      fontSize: typography.heading1.fontSize.desktop,
                      fontWeight: typography.heading1.fontWeight,
                      color: typography.heading1.color,
                      lineHeight: typography.heading1.lineHeight,
                    } : {}}
                  >
                    {post.title}
                  </h1>
                  {post.whitepaperUrl && (
                    <a
                      href={post.whitepaperUrl}
                      download
                      onClick={(e) => {
                        e.preventDefault()
                        window.open(post.whitepaperUrl, '_blank')
                      }}
                      className="ml-4 inline-flex items-center gap-2 px-4 py-2 bg-cobalt-blue text-white rounded-lg hover:bg-cobalt-light transition-colors flex-shrink-0"
                    >
                      <Download className="w-4 h-4" />
                      <span className="hidden md:inline">Download PDF</span>
                    </a>
                  )}
                </div>
                <p className="text-gray-400 mb-4">
                  By {post.author} • {new Date(post.date).toLocaleDateString()}
                </p>
              </div>

              {/* Blocks */}
              {post.blocks && post.blocks.length > 0 && (
                <div className="space-y-8">
                  {post.blocks
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
                            className={`flex flex-col ${block.align === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'
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
                                className={`w-full md:w-1/2 prose prose-invert max-w-none ${block.align === 'right' ? 'md:text-right' : ''
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
              )}
            </motion.div>
          </div>
        )}

        {/* Back Button */}
        <div className="px-4 md:px-8 py-8">
          <a
            href="/research"
            className="inline-flex items-center gap-2 text-cobalt-light hover:text-cobalt-blue transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Research</span>
          </a>
        </div>
      </div>
    </div>
  )
}

