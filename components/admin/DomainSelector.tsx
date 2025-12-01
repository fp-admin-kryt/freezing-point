'use client'

import { useState, useEffect } from 'react'
import { getDomains } from '@/lib/firebase'

interface Domain {
  id?: string
  name: string
  description?: string
  color?: string
}

interface DomainSelectorProps {
  selectedDomain: string
  onChange: (domain: string) => void
  placeholder?: string
}

export default function DomainSelector({ selectedDomain, onChange, placeholder = "Select domain..." }: DomainSelectorProps) {
  const [domains, setDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDomains = async () => {
      try {
        const fetchedDomains = await getDomains()
        setDomains(fetchedDomains)
      } catch (error) {
        console.error('Error loading domains:', error)
        setDomains([])
      } finally {
        setLoading(false)
      }
    }
    loadDomains()
  }, [])

  if (loading) {
    return (
      <div className="w-full px-4 py-2 bg-space-gray border border-gray-600 rounded-lg text-gray-400">
        Loading domains...
      </div>
    )
  }

  if (domains.length === 0) {
    return (
      <div className="w-full px-4 py-2 bg-space-gray border border-gray-600 rounded-lg text-gray-400">
        No domains available. Create some domains first.
      </div>
    )
  }

  return (
    <select
      value={selectedDomain}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2 bg-space-gray border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cobalt-blue"
    >
      <option value="">{placeholder}</option>
      {domains.map((domain, index) => (
        <option key={domain.id || `domain-${index}`} value={domain.id || ''}>
          {domain.name}
        </option>
      ))}
    </select>
  )
}
