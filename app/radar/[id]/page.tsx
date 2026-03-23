'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { getSignalPosts, getObserverPosts, SignalPost, ObserverPost } from '@/lib/firebase'
import { getTagById, getDomainById } from '@/lib/dataService'
import { getTypography } from '@/lib/typography'
import Image from 'next/image'

type RadarPost = (SignalPost | ObserverPost) & { _type: 'signal' | 'observer' }

function Sk({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-white/6 ${className}`} />
}

function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#050508] flex pt-0">
      <div className="hidden md:block w-2/5 h-screen sticky top-0 bg-white/4 animate-pulse" />
      <div className="w-full md:w-3/5 pt-24 pb-16 px-8 md:px-14">
        <div className="max-w-xl space-y-6">
          <div className="flex gap-2">
            <Sk className="h-5 w-16 rounded-full" />
            <Sk className="h-5 w-20 rounded-full" />
          </div>
          <Sk className="h-10 w-4/5" />
          <Sk className="h-10 w-3/5" />
          <Sk className="h-4 w-32" />
          <div className="pt-4 space-y-3">
            <Sk className="h-4 w-full" />
            <Sk className="h-4 w-full" />
            <Sk className="h-4 w-5/6" />
            <Sk className="h-4 w-full" />
            <Sk className="h-4 w-4/5" />
          </div>
        </div>
      </div>
    </div>
  )
}

function TagRow({ tags, domain }: { tags: string[]; domain?: string }) {
  return (
    <div className="flex flex-wrap gap-2 mb-5">
      {tags.map((tagId) => {
        const tag = getTagById(tagId)
        return tag ? (
          <span key={tagId} className="px-2.5 py-1 font-sans text-[9px] tracking-wider rounded-full"
            style={{ backgroundColor: tag.color + '22', border: `1px solid ${tag.color}44`, color: tag.color }}>
            {tag.name}
          </span>
        ) : null
      })}
      {domain && getDomainById(domain) && (
        <span className="px-2.5 py-1 font-sans text-[9px] tracking-wider rounded-full border border-white/8 text-gray-500">
          {getDomainById(domain)?.name}
        </span>
      )}
    </div>
  )
}

function PostNav({ prev, next }: { prev: RadarPost | null; next: RadarPost | null }) {
  if (!prev && !next) return null
  return (
    <div className="mt-16 pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
      <div>
        {prev && (
          <a href={`/radar/${prev.id}`}
            className="group flex flex-col gap-1 p-4 border border-white/8 rounded-xl hover:border-cobalt-blue/40 transition-colors">
            <span className="font-sans text-[9px] tracking-widest uppercase text-gray-600 flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Previous
            </span>
            <span className="font-sans text-sm text-gray-300 group-hover:text-white transition-colors line-clamp-2 leading-snug">
              {prev.heading}
            </span>
          </a>
        )}
      </div>
      <div>
        {next && (
          <a href={`/radar/${next.id}`}
            className="group flex flex-col gap-1 p-4 border border-white/8 rounded-xl hover:border-cobalt-blue/40 transition-colors text-right">
            <span className="font-sans text-[9px] tracking-widest uppercase text-gray-600 flex items-center gap-1 justify-end">
              Next <ArrowRight className="w-3 h-3" />
            </span>
            <span className="font-sans text-sm text-gray-300 group-hover:text-white transition-colors line-clamp-2 leading-snug">
              {next.heading}
            </span>
          </a>
        )}
      </div>
    </div>
  )
}

export default function RadarDetailPage() {
  const params = useParams()
  const postId = params.id as string
  const [post, setPost] = useState<RadarPost | null>(null)
  const [allPosts, setAllPosts] = useState<RadarPost[]>([])
  const [loading, setLoading] = useState(true)
  const [typography, setTypography] = useState<any>(null)

  useEffect(() => {
    Promise.all([
      getSignalPosts(),
      getObserverPosts(),
      getTypography().catch(() => null),
    ]).then(([signals, observers, typo]) => {
      const combined: RadarPost[] = [
        ...signals.map((p) => ({ ...p, _type: 'signal' as const })),
        ...observers.map((p) => ({ ...p, _type: 'observer' as const })),
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      setAllPosts(combined)
      setPost(combined.find((p) => p.id === postId) || null)
      setTypography(typo)
    }).catch(console.error).finally(() => setLoading(false))
  }, [postId])

  if (loading) return <DetailSkeleton />

  if (!post) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center">
        <p className="font-sans text-sm text-gray-500">Post not found</p>
      </div>
    )
  }

  const idx = allPosts.findIndex((p) => p.id === postId)
  const prev = idx < allPosts.length - 1 ? allPosts[idx + 1] : null
  const next = idx > 0 ? allPosts[idx - 1] : null

  const typeBadgeCls = post._type === 'signal'
    ? 'bg-cobalt-blue/15 text-cobalt-light border border-cobalt-blue/25'
    : 'bg-purple-700/15 text-purple-400 border border-purple-700/25'

  const typoH1Style = typography?.heading1 ? {
    fontSize: typography.heading1.fontSize.desktop,
    fontWeight: typography.heading1.fontWeight,
    color: typography.heading1.color,
    lineHeight: typography.heading1.lineHeight,
  } : {}

  const typoBodyStyle = typography?.body ? {
    fontSize: typography.body.fontSize.desktop,
    fontWeight: typography.body.fontWeight,
    color: typography.body.color,
    lineHeight: typography.body.lineHeight,
  } : {}

  const SharedHeader = ({ className = '' }: { className?: string }) => (
    <div className={className}>
      <div className="flex items-center gap-2 mb-4">
        <span className={`px-2.5 py-1 font-sans text-[9px] tracking-widest uppercase rounded-full ${typeBadgeCls}`}>
          {post._type === 'signal' ? 'Signal' : 'Observer'}
        </span>
      </div>
      <TagRow tags={post.tags} domain={post.domain} />
      <h1 className="font-sans font-light text-3xl md:text-5xl text-white leading-tight mb-4" style={typoH1Style}>
        {post.heading}
      </h1>
      <p className="font-body text-gray-500 text-sm mb-6">
        {new Date(post.date).toLocaleDateString()}
      </p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#050508]">

      {/* ── Single Image Template ── */}
      {post.templateType === 'singleImage' && (
        <div className="flex min-h-screen">
          {post.imageUrl && (
            <div className="hidden md:block w-2/5 flex-shrink-0 sticky top-0 h-screen">
              <div className="relative w-full h-full">
                <Image src={post.imageUrl} alt={post.heading} fill className="object-cover" priority sizes="40vw" />
                <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-r from-transparent to-[#050508]" />
              </div>
            </div>
          )}
          <div className="flex-1 pt-24 pb-16 px-6 md:px-14">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
              {post.imageUrl && (
                <div className="md:hidden relative w-full h-56 mb-8 rounded-xl overflow-hidden">
                  <Image src={post.imageUrl} alt={post.heading} fill className="object-cover" sizes="100vw" />
                </div>
              )}
              <SharedHeader className="mb-8" />
              {post.richContent && (
                <div className="prose prose-invert prose-p:font-body prose-headings:font-sans prose-headings:font-light max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.richContent }}
                  style={typoBodyStyle}
                />
              )}
              <PostNav prev={prev} next={next} />
              <div className="mt-12">
                <a href="/radar"
                  className="inline-flex items-center gap-2 font-sans text-[10px] tracking-[0.4em] uppercase text-gray-600 hover:text-cobalt-light transition-colors">
                  <ArrowLeft className="w-3 h-3" /> Back to Radar
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* ── Document Template ── */}
      {post.templateType === 'document' && (
        <div className="pt-24 pb-16 px-4 md:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            <SharedHeader className="mb-10" />
            {post.blocks && post.blocks.length > 0 && (
              <div className="space-y-10">
                {post.blocks.sort((a, b) => a.order - b.order).map((block) => (
                  <div key={block.id}>
                    {block.type === 'text' && block.content && (
                      <div className="prose prose-invert prose-p:font-body prose-headings:font-sans prose-headings:font-light max-w-none"
                        dangerouslySetInnerHTML={{ __html: block.content }} style={typoBodyStyle} />
                    )}
                    {block.type === 'image' && block.imageUrl && (
                      <div className="relative w-full rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
                        <Image src={block.imageUrl} alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 768px" />
                      </div>
                    )}
                    {block.type === 'imageText' && (
                      <div className={`flex flex-col ${block.align === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'} gap-6 items-start`}>
                        {block.imageUrl && (
                          <div className="relative w-full md:w-1/2 flex-shrink-0 rounded-xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
                            <Image src={block.imageUrl} alt="" fill className="object-cover" sizes="50vw" />
                          </div>
                        )}
                        {block.content && (
                          <div className="w-full md:w-1/2 prose prose-invert prose-p:font-body prose-headings:font-sans prose-headings:font-light max-w-none"
                            dangerouslySetInnerHTML={{ __html: block.content }} style={typoBodyStyle} />
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            <PostNav prev={prev} next={next} />
            <div className="mt-12">
              <a href="/radar"
                className="inline-flex items-center gap-2 font-sans text-[10px] tracking-[0.4em] uppercase text-gray-600 hover:text-cobalt-light transition-colors">
                <ArrowLeft className="w-3 h-3" /> Back to Radar
              </a>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── Fallback (no templateType) ── */}
      {!post.templateType && (
        <div className="pt-24 pb-16 px-4 md:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            <SharedHeader className="mb-8" />
            {post.content && (
              <p className="font-body text-gray-400 leading-relaxed whitespace-pre-wrap">{post.content}</p>
            )}
            <PostNav prev={prev} next={next} />
            <div className="mt-12">
              <a href="/radar"
                className="inline-flex items-center gap-2 font-sans text-[10px] tracking-[0.4em] uppercase text-gray-600 hover:text-cobalt-light transition-colors">
                <ArrowLeft className="w-3 h-3" /> Back to Radar
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
