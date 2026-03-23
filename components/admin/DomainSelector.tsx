'use client'

import { useState, useEffect } from 'react'
import { getDomains } from '@/lib/firebase'

interface Domain {
  id?: string
  name: string
  color?: string
}

interface DomainSelectorProps {
  selectedDomain: string
  onChange: (domain: string) => void
  placeholder?: string
}

export default function DomainSelector({ selectedDomain, onChange, placeholder = 'Select domain…' }: DomainSelectorProps) {
  const [domains, setDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDomains()
      .then(setDomains)
      .catch(() => setDomains([]))
      .finally(() => setLoading(false))
  }, [])

  const cls = "w-full px-4 py-2.5 bg-transparent border border-white/8 rounded-lg text-white placeholder-gray-700 font-sans text-sm focus:outline-none focus:border-cobalt-blue/50 transition-colors"

  if (loading) {
    return (
      <div className={`${cls} text-gray-700`}>Loading domains…</div>
    )
  }

  if (domains.length === 0) {
    return (
      <div className={`${cls} text-gray-700`}>No domains — create some first.</div>
    )
  }

  return (
    <select value={selectedDomain} onChange={(e) => onChange(e.target.value)} className={cls}>
      <option value="" className="bg-[#0e0e12] text-gray-400">{placeholder}</option>
      {domains.map((domain, index) => (
        <option key={domain.id || `domain-${index}`} value={domain.id || ''} className="bg-[#0e0e12]">
          {domain.name}
        </option>
      ))}
    </select>
  )
}
