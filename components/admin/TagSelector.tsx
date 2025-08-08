'use client'

import { useState, useEffect } from 'react'
import { getTags } from '@/lib/firebase'

interface Tag {
  id?: string
  name: string
  color: string
  imageUrl?: string
}

interface TagSelectorProps {
  selectedTags: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
}

export default function TagSelector({ selectedTags, onChange, placeholder = "Select tags..." }: TagSelectorProps) {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTags = async () => {
      try {
        const fetchedTags = await getTags()
        setTags(fetchedTags)
      } catch (error) {
        console.error('Error loading tags:', error)
        setTags([])
      } finally {
        setLoading(false)
      }
    }
    loadTags()
  }, [])

  const handleTagToggle = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onChange(selectedTags.filter(id => id !== tagId))
    } else {
      onChange([...selectedTags, tagId])
    }
  }

  if (loading) {
    return (
      <div className="w-full px-4 py-2 bg-space-gray border border-gray-600 rounded-lg text-gray-400">
        Loading tags...
      </div>
    )
  }

  if (tags.length === 0) {
    return (
      <div className="w-full px-4 py-2 bg-space-gray border border-gray-600 rounded-lg text-gray-400">
        No tags available. Create some tags first.
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="text-sm text-gray-300 mb-2">
        {selectedTags.length > 0 ? `${selectedTags.length} tag(s) selected` : placeholder}
      </div>
      <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
        {tags.map((tag) => (
          <button
            key={tag.id}
            type="button"
            onClick={() => handleTagToggle(tag.id!)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              selectedTags.includes(tag.id!)
                ? 'ring-2 ring-cobalt-blue'
                : 'hover:opacity-80'
            }`}
            style={{ backgroundColor: tag.color, color: 'white' }}
          >
            {tag.name}
          </button>
        ))}
      </div>
    </div>
  )
}
