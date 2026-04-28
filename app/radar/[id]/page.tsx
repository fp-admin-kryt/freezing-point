'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { getSignalPosts, getObserverPosts, getRadarPosts, RadarPost as RadarPostType } from '@/lib/firebase'
import { getTagById, getDomainById } from '@/lib/dataService'
import { getTypography } from '@/lib/typography'
import Image from 'next/image'
import { DocumentBlocks } from '@/components/DocumentBlocks'

type RadarPost = RadarPostType

function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#050508] animate-pulse">
      <div className="w-full h-[60vh] bg-white/4" />
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-5">
        <div className="flex gap-2">
          <div className="h-5 w-16 rounded-full bg-white/6" />
          <div className="h-5 w-20 rounded-full bg-white/6" />
        </div>
        <div className="h-10 w-4/5 rounded bg-white/6" />
        <div className="h-10 w-3/5 rounded bg-white/6" />
        <div className="h-4 w-32 rounded bg-white/6" />
        <div className="pt-4 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 rounded bg-white/4" style={{ width: `${85 + Math.random() * 15}%` }} />
          ))}
        </div>
      </div>
    </div>
  )
}

function TagRow({ tags, domain }: { tags: string[]; domain?: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tagId) => {
        const tag = getTagById(tagId)
        return tag ? (
          <span
            key={tagId}
            className="px-2.5 py-1 font-sans text-[9px] tracking-wider rounded-full"
            style={{ backgroundColor: tag.color + '22', border: `1px solid ${tag.color}44`, color: tag.color }}
          >
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
          <a
            href={`/radar/${prev.id}`}
            className="group block border border-white/8 rounded-xl overflow-hidden hover:border-cobalt-blue/30 transition-all duration-300"
          >
            {prev.imageUrl && (
              <div className="relative w-full h-28 overflow-hidden">
                <Image
                  src={prev.imageUrl}
                  alt=""
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/50" />
              </div>
            )}
            <div className={`p-4 ${!prev.imageUrl ? '' : ''}`}>
              <span className="font-sans text-[9px] tracking-widest uppercase text-gray-600 flex items-center gap-1 mb-2">
                <ArrowLeft className="w-3 h-3" /> Previous
              </span>
              <span className="font-sans text-sm text-gray-300 group-hover:text-white transition-colors line-clamp-2 leading-snug block">
                {prev.heading}
              </span>
            </div>
          </a>
        )}
      </div>
      <div>
        {next && (
          <a
            href={`/radar/${next.id}`}
            className="group block border border-white/8 rounded-xl overflow-hidden hover:border-cobalt-blue/30 transition-all duration-300 text-right"
          >
            {next.imageUrl && (
              <div className="relative w-full h-28 overflow-hidden">
                <Image
                  src={next.imageUrl}
                  alt=""
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/50" />
              </div>
            )}
            <div className="p-4">
              <span className="font-sans text-[9px] tracking-widest uppercase text-gray-600 flex items-center gap-1 justify-end mb-2">
                Next <ArrowRight className="w-3 h-3" />
              </span>
              <span className="font-sans text-sm text-gray-300 group-hover:text-white transition-colors line-clamp-2 leading-snug block">
                {next.heading}
              </span>
            </div>
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
      getRadarPosts(),
      getTypography().catch(() => null),
    ]).then(([signals, observers, radar, typo]) => {
      const combined: RadarPost[] = [...radar, ...signals, ...observers]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
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

  const typoH1Style = typography?.heading1 ? {
    fontSize: typography.heading1.fontSize.desktop,
    fontWeight: typography.heading1.fontWeight,
    color: typography.heading1.color,
    lineHeight: typography.heading1.lineHeight,
    fontFamily: typography.heading1.fontFamily || undefined,
    letterSpacing: typography.heading1.letterSpacing || undefined,
  } : {}

  const typoBodyStyle = typography?.body ? {
    fontSize: typography.body.fontSize.desktop,
    fontWeight: typography.body.fontWeight,
    color: typography.body.color,
    lineHeight: typography.body.lineHeight,
    fontFamily: typography.body.fontFamily || undefined,
    letterSpacing: typography.body.letterSpacing || undefined,
  } : {}

  return (
    <div className="min-h-screen bg-[#050508]">

      {/* ── Hero Image (all templates, if imageUrl exists) ── */}
      {post.imageUrl && (
        <div className="relative w-full overflow-hidden" style={{ height: 'clamp(300px, 62vh, 680px)' }}>
          <Image
            src={post.imageUrl}
            alt={post.heading}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* Cinematic gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050508]/30 via-transparent to-[#050508]/30" />

          {/* Tags float over bottom of hero */}
          <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 pb-8">
            <div className="max-w-3xl mx-auto">
              <TagRow tags={post.tags} domain={post.domain} />
            </div>
          </div>
        </div>
      )}

      {/* ── Article Content ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="max-w-3xl mx-auto px-6 md:px-8"
      >
        {/* Header */}
        <div className={post.imageUrl ? 'pt-10 pb-8' : 'pt-28 pb-8'}>
          {!post.imageUrl && (
            <div className="mb-5">
              <TagRow tags={post.tags} domain={post.domain} />
            </div>
          )}
          <h1
            className="font-sans font-light text-3xl md:text-5xl text-white leading-tight mb-4"
            style={typoH1Style}
          >
            {post.heading}
          </h1>
          <p className="font-body text-gray-500 text-sm">
            {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/[0.06] mb-10" />

        {/* Content */}
        {post.templateType === 'singleImage' && post.richContent && (
          <div
            className="prose prose-invert prose-p:font-body prose-headings:font-sans prose-headings:font-light max-w-none prose-p:leading-relaxed prose-p:text-gray-300 prose-headings:text-white"
            dangerouslySetInnerHTML={{ __html: post.richContent }}
            style={typoBodyStyle}
          />
        )}

        {post.templateType === 'document' && post.blocks && post.blocks.length > 0 && (
          <DocumentBlocks blocks={post.blocks} typoBodyStyle={typoBodyStyle} />
        )}

        {!post.templateType && post.content && (
          <p className="font-body text-gray-300 leading-relaxed whitespace-pre-wrap" style={typoBodyStyle}>
            {post.content}
          </p>
        )}

        {/* Prev / Next */}
        <PostNav prev={prev} next={next} />

        {/* Back link */}
        <div className="mt-12 pb-16">
          <a
            href="/radar"
            className="inline-flex items-center gap-2 font-sans text-[10px] tracking-[0.4em] uppercase text-gray-600 hover:text-cobalt-light transition-colors"
          >
            <ArrowLeft className="w-3 h-3" /> Back to Radar
          </a>
        </div>
      </motion.div>
    </div>
  )
}
