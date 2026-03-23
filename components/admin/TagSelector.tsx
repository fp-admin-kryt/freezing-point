'use client'

import { useState, useEffect } from 'react'
import { getTags } from '@/lib/firebase'

interface Tag {
  id?: string
  name: string
  color: string
}

interface TagSelectorProps {
  selectedTags: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
}

export default function TagSelector({ selectedTags, onChange, placeholder = 'Select tags…' }: TagSelectorProps) {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTags()
      .then(setTags)
      .catch(() => setTags([]))
      .finally(() => setLoading(false))
  }, [])

  const toggle = (tagId: string) => {
    onChange(selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId])
  }

  if (loading) {
    return (
      <div className="w-full px-4 py-2.5 border border-white/8 rounded-lg font-sans text-sm text-gray-700">
        Loading tags…
      </div>
    )
  }

  if (tags.length === 0) {
    return (
      <div className="w-full px-4 py-2.5 border border-white/8 rounded-lg font-sans text-sm text-gray-700">
        No tags — create some first.
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="font-sans text-[10px] text-gray-700">
        {selectedTags.length > 0 ? `${selectedTags.length} selected` : placeholder}
      </div>
      <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
        {tags.map((tag, index) => {
          const isSelected = !!(tag.id && selectedTags.includes(tag.id))
          return (
            <button
              key={tag.id || `tag-${index}`}
              type="button"
              onClick={() => tag.id && toggle(tag.id)}
              className="px-2.5 py-1 rounded-full font-sans text-xs transition-all"
              style={{
                backgroundColor: isSelected ? tag.color + '33' : 'transparent',
                border: `1px solid ${isSelected ? tag.color + '88' : 'rgba(255,255,255,0.08)'}`,
                color: isSelected ? tag.color : '#6b7280',
              }}
              disabled={!tag.id}
            >
              {tag.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
