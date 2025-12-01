'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { getSignalPosts, getObserverPosts, SignalPost, ObserverPost } from '@/lib/firebase'
import { getTagById, getDomainById } from '@/lib/dataService'
import { getTypography } from '@/lib/typography'
import Navigation from '@/components/Navigation'
import Image from 'next/image'

export default function RadarDetailPage() {
  const params = useParams()
  const postId = params.id as string
  const [post, setPost] = useState<SignalPost | ObserverPost | null>(null)
  const [postType, setPostType] = useState<'signal' | 'observer' | null>(null)
  const [loading, setLoading] = useState(true)
  const [typography, setTypography] = useState<any>(null)

  useEffect(() => {
    loadPost()
    loadTypography()
  }, [postId])

  const loadPost = async () => {
    try {
      const [signals, observers] = await Promise.all([
        getSignalPosts(),
        getObserverPosts()
      ])
      
      const signalPost = signals.find((p) => p.id === postId)
      const observerPost = observers.find((p) => p.id === postId)
      
      if (signalPost) {
        setPost(signalPost)
        setPostType('signal')
      } else if (observerPost) {
        setPost(observerPost)
        setPostType('observer')
      } else {
        setPost(null)
      }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-space-black flex items-center justify-center">
        <div className="text-cobalt-light">Loading...</div>
      </div>
    )
  }

  if (!post || !postType) {
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
                    alt={post.heading}
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
                      alt={post.heading}
                      width={800}
                      height={600}
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                )}

                {/* Header */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
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
                    {getDomainById(post.domain) && (
                      <span className="px-3 py-1 text-sm rounded-full bg-gray-700 text-white">
                        {getDomainById(post.domain)?.name}
                      </span>
                    )}
                  </div>
                  <h1
                    className="text-4xl md:text-5xl font-bold text-white mb-4 font-montserrat"
                    style={typography?.heading1 ? {
                      fontSize: typography.heading1.fontSize.desktop,
                      fontWeight: typography.heading1.fontWeight,
                      color: typography.heading1.color,
                      lineHeight: typography.heading1.lineHeight,
                    } : {}}
                  >
                    {post.heading}
                  </h1>
                  <p className="text-gray-400 mb-4">
                    {new Date(post.createdAt).toLocaleDateString()}
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
                <div className="flex items-center gap-2 mb-4 flex-wrap">
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
                  {getDomainById(post.domain) && (
                    <span className="px-3 py-1 text-sm rounded-full bg-gray-700 text-white">
                      {getDomainById(post.domain)?.name}
                    </span>
                  )}
                </div>
                <h1
                  className="text-4xl md:text-5xl font-bold text-white mb-4 font-montserrat"
                  style={typography?.heading1 ? {
                    fontSize: typography.heading1.fontSize.desktop,
                    fontWeight: typography.heading1.fontWeight,
                    color: typography.heading1.color,
                    lineHeight: typography.heading1.lineHeight,
                  } : {}}
                >
                  {post.heading}
                </h1>
                <p className="text-gray-400 mb-4">
                  {new Date(post.createdAt).toLocaleDateString()}
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
              )}
            </motion.div>
          </div>
        )}

        {/* Fallback for old posts without templateType */}
        {!post.templateType && (
          <div className="min-h-screen px-4 md:px-8 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4 flex-wrap">
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
                  {getDomainById(post.domain) && (
                    <span className="px-3 py-1 text-sm rounded-full bg-gray-700 text-white">
                      {getDomainById(post.domain)?.name}
                    </span>
                  )}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-montserrat">
                  {post.heading}
                </h1>
                <p className="text-gray-400 mb-4">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
              {post.content && (
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 whitespace-pre-wrap">{post.content}</p>
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* Back Button */}
        <div className="px-4 md:px-8 py-8">
          <a
            href="/radar"
            className="inline-flex items-center gap-2 text-cobalt-light hover:text-cobalt-blue transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Radar</span>
          </a>
        </div>
      </div>
    </div>
  )
}

