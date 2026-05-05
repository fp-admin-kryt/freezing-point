'use client'

import Image from 'next/image'

interface DefaultBlogRendererProps {
  content: string
  imageUrl?: string
  image2Url?: string
  image3Url?: string
}

interface GridCell {
  header: string
  title: string
  content: string
}

type BlockNode =
  | { kind: 'section'; text: string }
  | { kind: 'paragraph'; text: string }
  | { kind: 'quote'; text: string }
  | { kind: 'divider' }
  | { kind: 'image'; slot: 1 | 2 | 3 }
  | { kind: 'grid'; cells: GridCell[] }

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

    if (line === '[GRID]') {
      const cells: GridCell[] = []
      i++
      while (i < lines.length && lines[i].trimEnd() !== '[/GRID]') {
        const cellLine = lines[i].trim()
        if (cellLine) {
          const parts = cellLine.split('|').map((p) => p.trim())
          cells.push({
            header: parts[0] || '',
            title: parts[1] || '',
            content: parts[2] || '',
          })
        }
        i++
      }
      i++ // skip [/GRID]
      if (cells.length > 0) nodes.push({ kind: 'grid', cells })
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
        l === '[GRID]' ||
        l === '[/GRID]' ||
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

        if (node.kind === 'grid') {
          return (
            <div key={idx} className="db-grid">
              {node.cells.map((cell, ci) => (
                <div key={ci} className="db-grid-cell">
                  {cell.header && <p className="db-grid-header">{cell.header}</p>}
                  {cell.title && <p className="db-grid-title">{cell.title}</p>}
                  {cell.content && <p className="db-grid-content">{cell.content}</p>}
                </div>
              ))}
            </div>
          )
        }

        return null
      })}
    </div>
  )
}
