'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ExternalLink, ArrowLeft, ArrowRight, FileText, Lock } from 'lucide-react'
import { GradientButton } from '@/components/ui/gradient-button'
import { getResearchPosts, ResearchPost } from '@/lib/firebase'
import { getTagById } from '@/lib/dataService'
import Image from 'next/image'

function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#050508] animate-pulse">
      <div className="w-full h-[60vh] bg-white/4" />
      <div className="max-w-[960px] mx-auto px-6 py-12 space-y-5">
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
    <div className="mt-16 pt-8 grid grid-cols-2 gap-4" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
      <div>
        {prev && (
          <a
            href={`/research/${prev.id}`}
            className="group block bg-white/[0.03] rounded-xl overflow-hidden hover:bg-white/[0.06] transition-all duration-300"
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
                <div className="absolute inset-0 bg-black/40" />
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
            className="group block bg-white/[0.03] rounded-xl overflow-hidden hover:bg-white/[0.06] transition-all duration-300 text-right"
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
                <div className="absolute inset-0 bg-black/40" />
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

  useEffect(() => {
    getResearchPosts()
      .then((posts) => {
        const sorted = [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        setAllPosts(sorted)
        setPost(sorted.find((p) => p.id === postId) || null)
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

  const abstractParas = (post.abstract || '').split(/\n\s*\n/).map(p => p.trim()).filter(Boolean)
  const previewParas = (post.previewBody || '').split(/\n\s*\n/).map(p => p.trim()).filter(Boolean)

  return (
    <div className="min-h-screen bg-[#050508]">
      {/* Hero image */}
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

      <motion.article
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-[960px] mx-auto px-6 md:px-10"
      >
        {/* Header */}
        <header className={post.imageUrl ? 'pt-12 pb-10' : 'pt-32 pb-10'}>
          <div className="mb-6">
            <TagRow tags={post.tags} />
          </div>

          <h1
            className="font-sans font-light leading-[1.1] tracking-tight text-white mb-7"
            style={{ fontSize: 'clamp(2rem, 4.6vw, 3.4rem)' }}
          >
            {post.title}
          </h1>

          <div className="flex items-center gap-4 flex-wrap">
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
        </header>

        {/* Cobalt accent rule */}
        <div className="relative mb-12 h-px">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cobalt-blue/40 to-transparent" />
        </div>

        {/* ── Abstract ── */}
        {abstractParas.length > 0 && (
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-cobalt-light" />
              <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-cobalt-light">
                Abstract
              </span>
            </div>
            <div className="space-y-5">
              {abstractParas.map((para, i) => (
                <p
                  key={i}
                  className="font-body text-[1.0625rem] leading-[1.85] text-white/85"
                  style={{ fontWeight: 300 }}
                >
                  {para}
                </p>
              ))}
            </div>
          </section>
        )}

        {/* ── Blurred preview + Download CTA ── */}
        {(previewParas.length > 0 || post.whitepaperUrl) && (
          <section className="relative mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-white/15" />
              <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-gray-500">
                Full Paper
              </span>
            </div>

            {/* Preview container */}
            <div className="relative overflow-hidden rounded-2xl">
              {/* Blurred body text behind */}
              <div
                aria-hidden
                className="px-6 md:px-10 pt-10 pb-24 select-none pointer-events-none"
                style={{
                  filter: 'blur(7px)',
                  WebkitFilter: 'blur(7px)',
                }}
              >
                <div className="space-y-5">
                  {(previewParas.length > 0 ? previewParas : [
                    'The full body of this paper covers methodology, experimental setup, key findings, and detailed analysis.',
                    'Sections include comprehensive literature review, dataset description, model architecture, training procedures, evaluation metrics, and ablation studies.',
                    'Download the PDF to read the complete research, including all figures, tables, and references.',
                  ]).map((para, i) => (
                    <p
                      key={i}
                      className="font-body text-[1rem] leading-[1.85] text-white/60"
                      style={{ fontWeight: 300 }}
                    >
                      {para}
                    </p>
                  ))}
                </div>
              </div>

              {/* Smooth fade to dark at bottom */}
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#050508] via-[#050508]/85 to-transparent pointer-events-none" />

              {/* Centered Download CTA */}
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 px-6">
                <div className="relative w-full max-w-md">
                  {/* Glow halo */}
                  <div
                    className="absolute -inset-6 rounded-3xl pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 60%, rgba(19,111,215,0.18), transparent 70%)' }}
                  />

                  <div className="relative bg-[#070710]/60 backdrop-blur-xl rounded-2xl p-7 text-center">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-cobalt-blue/15 border border-cobalt-blue/30 flex items-center justify-center">
                        {post.whitepaperUrl ? (
                          <FileText className="w-5 h-5 text-cobalt-light" />
                        ) : (
                          <Lock className="w-5 h-5 text-cobalt-light" />
                        )}
                      </div>
                    </div>

                    <h3 className="font-sans text-lg font-light text-white mb-2">
                      Read the Full Paper
                    </h3>
                    <p className="font-body text-sm text-gray-500 mb-6 leading-relaxed">
                      {post.whitepaperUrl
                        ? 'Opens in a new tab — view or save the complete paper from there.'
                        : 'The full paper will be available soon.'}
                    </p>

                    {post.whitepaperUrl ? (
                      <GradientButton
                        type="button"
                        onClick={() => window.open(post.whitepaperUrl!, '_blank', 'noopener')}
                        className="!min-w-0 !px-6 !py-3 !text-sm !rounded-lg !font-light w-full sm:w-auto"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View PDF
                      </GradientButton>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="px-6 py-3 rounded-lg border border-white/8 text-gray-600 font-sans text-sm cursor-not-allowed"
                      >
                        Coming Soon
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

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
