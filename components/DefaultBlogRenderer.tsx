'use client'

import Image from 'next/image'

interface DefaultBlogRendererProps {
  content: string
  imageUrl?: string
  image2Url?: string
  image3Url?: string
}

type BlockNode =
  | { kind: 'section'; text: string }
  | { kind: 'paragraph'; text: string }
  | { kind: 'quote'; text: string }
  | { kind: 'divider' }
  | { kind: 'image'; slot: 1 | 2 | 3 }

function parse(content: string): BlockNode[] {
  const nodes: BlockNode[] = []
  const lines = content.split('\n')
  let i = 0

  while (i < lines.length) {
    const raw = lines[i]
    const line = raw.trimEnd()

    if (line === '') {
      i++
      continue
    }

    if (line.startsWith('## ')) {
      nodes.push({ kind: 'section', text: line.slice(3).trim() })
      i++
      continue
    }

    if (line === '---') {
      nodes.push({ kind: 'divider' })
      i++
      continue
    }

    if (line === '[IMAGE_1]') {
      nodes.push({ kind: 'image', slot: 1 })
      i++
      continue
    }

    if (line === '[IMAGE_2]') {
      nodes.push({ kind: 'image', slot: 2 })
      i++
      continue
    }

    if (line === '[IMAGE_3]') {
      nodes.push({ kind: 'image', slot: 3 })
      i++
      continue
    }

    if (line.startsWith('> ')) {
      nodes.push({ kind: 'quote', text: line.slice(2).trim() })
      i++
      continue
    }

    // Accumulate paragraph lines
    const paraLines: string[] = []
    while (i < lines.length) {
      const l = lines[i].trimEnd()
      if (
        l === '' ||
        l.startsWith('## ') ||
        l === '---' ||
        l === '[IMAGE_1]' ||
        l === '[IMAGE_2]' ||
        l === '[IMAGE_3]' ||
        l.startsWith('> ')
      ) break
      paraLines.push(l)
      i++
    }
    if (paraLines.length > 0) {
      nodes.push({ kind: 'paragraph', text: paraLines.join(' ') })
    }
  }

  return nodes
}

function imageForSlot(
  slot: 1 | 2 | 3,
  imageUrl?: string,
  image2Url?: string,
  image3Url?: string
): string | undefined {
  if (slot === 1) return imageUrl
  if (slot === 2) return image2Url
  if (slot === 3) return image3Url
}

export function DefaultBlogRenderer({ content, imageUrl, image2Url, image3Url }: DefaultBlogRendererProps) {
  if (!content) return null
  const nodes = parse(content)
  let isFirstParagraph = true

  return (
    <div className="default-blog-body">
      {nodes.map((node, idx) => {
        if (node.kind === 'section') {
          return (
            <div key={idx} className="db-section-header">
              <span className="db-section-label">{node.text}</span>
            </div>
          )
        }

        if (node.kind === 'paragraph') {
          const first = isFirstParagraph
          if (isFirstParagraph) isFirstParagraph = false
          return (
            <p key={idx} className={first ? 'db-lead' : 'db-para'}>
              {node.text}
            </p>
          )
        }

        if (node.kind === 'quote') {
          return (
            <blockquote key={idx} className="db-pullquote">
              <span className="db-pullquote-mark">&ldquo;</span>
              {node.text}
              <span className="db-pullquote-mark">&rdquo;</span>
            </blockquote>
          )
        }

        if (node.kind === 'divider') {
          return <div key={idx} className="db-divider" />
        }

        if (node.kind === 'image') {
          const src = imageForSlot(node.slot, imageUrl, image2Url, image3Url)
          if (!src) return null
          return (
            <div key={idx} className="db-image-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="db-image" />
            </div>
          )
        }

        return null
      })}
    </div>
  )
}
