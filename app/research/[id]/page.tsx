'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Download, ArrowLeft, ArrowRight } from 'lucide-react'
import { GradientButton } from '@/components/ui/gradient-button'
import { getResearchPosts, ResearchPost } from '@/lib/firebase'
import { getTagById } from '@/lib/dataService'
import { getTypography } from '@/lib/typography'
import Image from 'next/image'
import { DocumentBlocks } from '@/components/DocumentBlocks'
import { DefaultBlogRenderer } from '@/components/DefaultBlogRenderer'

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
        <div className="h-4 w-48 rounded bg-white/6" />
        <div className="pt-4 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 rounded bg-white/4" style={{ width: `${85 + Math.random() * 15}%` }} />
          ))}
        </div>
      </div>
    </div>
  )
}

function TagRow({ tags }: { tags: string[] }) {
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
    </div>
  )
}

function PostNav({ prev, next }: { prev: ResearchPost | null; next: ResearchPost | null }) {
  if (!prev && !next) return null
  return (
    <div className="mt-16 pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
      <div>
        {prev && (
          <a
            href={`/research/${prev.id}`}
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
            <div className="p-4">
              <span className="font-sans text-[9px] tracking-widest uppercase text-gray-600 flex items-center gap-1 mb-2">
                <ArrowLeft className="w-3 h-3" /> Previous
              </span>
              <span className="font-sans text-sm text-gray-300 group-hover:text-white transition-colors line-clamp-2 leading-snug block">
                {prev.title}
              </span>
            </div>
          </a>
        )}
      </div>
      <div>
        {next && (
          <a
            href={`/research/${next.id}`}
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
                {next.title}
              </span>
            </div>
          </a>
        )}
      </div>
    </div>
  )
}

export default function ResearchDetailPage() {
  const params = useParams()
  const postId = params.id as string
  const [post, setPost] = useState<ResearchPost | null>(null)
  const [allPosts, setAllPosts] = useState<ResearchPost[]>([])
  const [loading, setLoading] = useState(true)
  const [typography, setTypography] = useState<any>(null)

  useEffect(() => {
    Promise.all([getResearchPosts(), getTypography().catch(() => null)])
      .then(([posts, typo]) => {
        const sorted = [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        setAllPosts(sorted)
        setPost(sorted.find((p) => p.id === postId) || null)
        setTypography(typo)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
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

  // ── Default Blog Template ──────────────────────────────────────────────────
  if (post.templateType === 'default') {
    return (
      <div className="min-h-screen bg-[#050508]">
        {/* Full-width hero image */}
        {post.imageUrl && (
          <div className="relative w-full overflow-hidden" style={{ height: 'clamp(340px, 68vh, 760px)' }}>
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050508]/20 via-transparent to-[#050508]/20" />
          </div>
        )}

        {/* Article wrapper */}
        <motion.article
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="max-w-[720px] mx-auto px-6 md:px-8"
        >
          {/* Header */}
          <header className={post.imageUrl ? 'pt-12 pb-10' : 'pt-32 pb-10'}>
            {/* Tags */}
            <div className="mb-6">
              <TagRow tags={post.tags} />
            </div>

            {/* Title */}
            <h1
              className="leading-[1.15] tracking-tight text-white mb-6"
              style={{
                fontFamily: 'var(--font-sans), system-ui, sans-serif',
                fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
                fontWeight: 400,
              }}
            >
              {post.title}
            </h1>

            {/* Meta row */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-px h-8 bg-cobalt-blue/40" />
                <div>
                  <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-gray-600 mb-0.5">Written by</p>
                  <p className="font-sans text-sm text-white/70">{post.author}</p>
                </div>
                <div className="w-px h-8 bg-white/8" />
                <div>
                  <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-gray-600 mb-0.5">Published</p>
                  <p className="font-sans text-sm text-white/70">
                    {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>

              {post.whitepaperUrl && (
                <GradientButton
                  className="!min-w-0 !px-5 !py-2.5 !text-sm !rounded-lg !font-light"
                  onClick={() => {
                    const link = document.createElement('a')
                    link.href = post.whitepaperUrl!
                    link.download = `${post.title || 'whitepaper'}.pdf`
                    link.target = '_blank'
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  <span className="hidden md:inline">Download PDF</span>
                </GradientButton>
              )}
            </div>
          </header>

          {/* Decorative divider */}
          <div className="relative mb-12 h-px">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cobalt-blue/40 to-transparent" />
          </div>

          {/* Blog body */}
          <DefaultBlogRenderer
            content={post.defaultContent || ''}
            imageUrl={post.imageUrl}
            image2Url={post.image2Url}
            image3Url={post.image3Url}
          />

          {/* Prev / Next */}
          <PostNav prev={prev} next={next} />

          {/* Back link */}
          <div className="mt-12 pb-16">
            <a
              href="/research"
              className="inline-flex items-center gap-2 font-sans text-[10px] tracking-[0.4em] uppercase text-gray-600 hover:text-cobalt-light transition-colors"
            >
              <ArrowLeft className="w-3 h-3" /> Back to Research
            </a>
          </div>
        </motion.article>
      </div>
    )
  }

  // ── Document / singleImage (legacy) Templates ──────────────────────────────
  return (
    <div className="min-h-screen bg-[#050508]">
      {post.imageUrl && (
        <div className="relative w-full overflow-hidden" style={{ height: 'clamp(300px, 62vh, 680px)' }}>
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050508]/30 via-transparent to-[#050508]/30" />
          <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 pb-8">
            <div className="max-w-3xl mx-auto">
              <TagRow tags={post.tags} />
            </div>
          </div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="max-w-3xl mx-auto px-6 md:px-8"
      >
        <div className={post.imageUrl ? 'pt-10 pb-8' : 'pt-28 pb-8'}>
          {!post.imageUrl && (
            <div className="mb-5">
              <TagRow tags={post.tags} />
            </div>
          )}
          <div className="flex items-start justify-between gap-6 mb-4">
            <h1
              className="font-sans font-light text-3xl md:text-5xl text-white leading-tight"
              style={typoH1Style}
            >
              {post.title}
            </h1>
            {post.whitepaperUrl && (
              <GradientButton
                className="flex-shrink-0 !min-w-0 !px-5 !py-2.5 !text-sm !rounded-lg !font-light mt-1"
                onClick={() => {
                  const link = document.createElement('a')
                  link.href = post.whitepaperUrl!
                  link.download = `${post.title || 'whitepaper'}.pdf`
                  link.target = '_blank'
                  document.body.appendChild(link)
                  link.click()
                  document.body.removeChild(link)
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Download PDF</span>
              </GradientButton>
            )}
          </div>
          <p className="font-body text-gray-500 text-sm">
            By {post.author} &middot;{' '}
            {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="h-px bg-white/[0.06] mb-10" />

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

        <PostNav prev={prev} next={next} />

        <div className="mt-12 pb-16">
          <a
            href="/research"
            className="inline-flex items-center gap-2 font-sans text-[10px] tracking-[0.4em] uppercase text-gray-600 hover:text-cobalt-light transition-colors"
          >
            <ArrowLeft className="w-3 h-3" /> Back to Research
          </a>
        </div>
      </motion.div>
    </div>
  )
}
