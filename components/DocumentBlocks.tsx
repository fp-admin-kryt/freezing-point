import { ContentBlock } from '@/lib/firebase'
import Image from 'next/image'

interface Props {
  blocks: ContentBlock[]
  typoBodyStyle?: React.CSSProperties
}

export function DocumentBlocks({ blocks, typoBodyStyle = {} }: Props) {
  return (
    <div className="space-y-8">
      {[...blocks].sort((a, b) => a.order - b.order).map((block) => (
        <Block key={block.id} block={block} typoBodyStyle={typoBodyStyle} />
      ))}
    </div>
  )
}

function Block({ block, typoBodyStyle }: { block: ContentBlock; typoBodyStyle: React.CSSProperties }) {
  switch (block.type) {

    case 'sectionLabel':
      return block.content ? (
        <div className="py-8">
          <div className="flex items-center gap-5">
            <div className="flex-1 h-px bg-white/[0.07]" />
            <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-gray-400 whitespace-nowrap flex-shrink-0">
              {block.content}
            </p>
            <div className="flex-1 h-px bg-white/[0.07]" />
          </div>
        </div>
      ) : null

    case 'documentTitle':
      return block.content ? (
        <p className="font-sans text-[10px] tracking-[0.5em] uppercase text-gray-500">
          {block.content}
        </p>
      ) : null

    case 'subtitle':
      return block.content ? (
        <p className="font-body italic text-gray-400 text-lg md:text-xl leading-relaxed">
          {block.content}
        </p>
      ) : null

    case 'heading1':
      return block.content ? (
        <h2 className="font-sans font-semibold text-3xl md:text-4xl text-white leading-tight tracking-tight">
          {block.content}
        </h2>
      ) : null

    case 'heading2':
      return block.content ? (
        <h3 className="font-sans font-medium text-xl md:text-2xl text-white/90 leading-snug">
          {block.content}
        </h3>
      ) : null

    case 'pullQuote':
      return block.content ? (
        <blockquote className="border-l-2 border-cobalt-blue/60 pl-6 my-4">
          <p className="font-body italic text-gray-300 text-lg md:text-xl leading-relaxed">
            {block.content}
          </p>
        </blockquote>
      ) : null

    case 'text':
      return block.content ? (
        <div
          className="prose prose-invert prose-p:font-body prose-headings:font-sans prose-headings:font-light max-w-none prose-p:leading-relaxed prose-p:text-gray-300"
          dangerouslySetInnerHTML={{ __html: block.content }}
          style={typoBodyStyle}
        />
      ) : null

    case 'image':
      return block.imageUrl ? (
        <div className="relative w-full rounded-2xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
          <Image
            src={block.imageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      ) : null

    case 'imageText':
      return (
        <div className={`flex flex-col ${block.align === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'} gap-6 items-start`}>
          {block.imageUrl && (
            <div className="relative w-full md:w-1/2 flex-shrink-0 rounded-xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
              <Image
                src={block.imageUrl}
                alt=""
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>
          )}
          {block.content && (
            <div
              className="w-full md:w-1/2 prose prose-invert prose-p:font-body prose-headings:font-sans prose-headings:font-light max-w-none prose-p:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: block.content }}
              style={typoBodyStyle}
            />
          )}
        </div>
      )

    case 'grid': {
      const cells = (block.cells || []).filter((c) => c.header || c.title || c.content)
      if (cells.length === 0) return null
      return (
        <div
          style={{
            display: 'grid',
            gap: '0.875rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          }}
        >
          {cells.map((cell, i) => (
            <div
              key={i}
              className="border border-white/12 rounded-xl p-5 flex flex-col"
            >
              {cell.header && (
                <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-gray-400 mb-3 leading-snug">
                  {cell.header}
                </p>
              )}
              {cell.title && (
                <p className="font-body text-base text-white mb-2 leading-snug">
                  {cell.title}
                </p>
              )}
              {cell.content && (
                <p className="font-body italic text-sm text-gray-400 leading-relaxed">
                  {cell.content}
                </p>
              )}
            </div>
          ))}
        </div>
      )
    }

    default:
      return null
  }
}
