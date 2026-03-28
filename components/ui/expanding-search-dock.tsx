'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { useState } from 'react'

type ExpandingSearchDockProps = {
  onSearch?: (query: string) => void
  onChange?: (query: string) => void
  placeholder?: string
  value?: string
}

export function ExpandingSearchDock({
  onSearch,
  onChange,
  placeholder = 'Search...',
  value,
}: ExpandingSearchDockProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [internalQuery, setInternalQuery] = useState('')

  const query = value !== undefined ? value : internalQuery

  const handleExpand = () => {
    setIsExpanded(true)
  }

  const handleCollapse = () => {
    setIsExpanded(false)
    setInternalQuery('')
    onChange?.('')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInternalQuery(val)
    onChange?.(val)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch && query) {
      onSearch(query)
    }
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.button
            key="icon"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={handleExpand}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors hover:bg-white/10"
          >
            <Search className="h-5 w-5 text-gray-400" />
          </motion.button>
        ) : (
          <motion.form
            key="input"
            initial={{ width: 48, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 48, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onSubmit={handleSubmit}
            className="relative"
          >
            <motion.div
              initial={{ backdropFilter: 'blur(0px)' }}
              animate={{ backdropFilter: 'blur(12px)' }}
              className="relative flex items-center gap-2 overflow-hidden rounded-full border border-white/10 bg-white/5 backdrop-blur-md"
            >
              <div className="ml-4">
                <Search className="h-4 w-4 text-gray-500" />
              </div>
              <input
                type="text"
                value={query}
                onChange={handleChange}
                placeholder={placeholder}
                autoFocus
                className="h-12 flex-1 bg-transparent pr-4 text-sm text-white outline-none placeholder:text-gray-600 font-sans"
              />
              <motion.button
                type="button"
                onClick={handleCollapse}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="mr-2 flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="h-4 w-4 text-gray-500" />
              </motion.button>
            </motion.div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
