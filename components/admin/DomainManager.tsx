'use client'

import { useState, useEffect } from 'react'
import { Edit, Trash2 } from 'lucide-react'
import { getDomains, saveDomain, updateDomain, deleteDomain } from '@/lib/firebase'
import { GradientButton } from '@/components/ui/gradient-button'
import toast from 'react-hot-toast'

interface Domain {
  id?: string
  name: string
  description?: string
  color?: string
  postCount: number
}

const inputCls = "w-full px-4 py-2.5 bg-transparent border border-white/8 rounded-lg text-white placeholder-gray-700 font-sans text-sm focus:outline-none focus:border-cobalt-blue/50 transition-colors"
const labelCls = "block font-sans text-[10px] tracking-widest uppercase text-gray-600 mb-2"
const secBtnCls = "px-4 py-2.5 border border-white/8 rounded-lg text-gray-400 hover:text-white hover:border-white/20 transition-colors font-sans text-sm"

export default function DomainManager() {
  const [domains, setDomains] = useState<Domain[]>([])
  const [newDomain, setNewDomain] = useState({ name: '', description: '', color: '#136fd7' })
  const [editingDomain, setEditingDomain] = useState<Domain | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const fetched = await getDomains()
        if (!mounted) return
        setDomains(fetched.map(d => ({ postCount: 0, description: d.description || '', color: d.color || '#136fd7', ...d })))
      } catch (e) {
        console.error('Error loading domains', e)
        if (mounted) setDomains([])
      }
    }
    load()
    const interval = setInterval(load, 4000)
    return () => { mounted = false; clearInterval(interval) }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editingDomain && editingDomain.id) {
        await updateDomain(editingDomain.id, { name: newDomain.name, description: newDomain.description, color: newDomain.color })
        const refreshed = await getDomains()
        setDomains(refreshed.map(d => ({ postCount: 0, description: d.description || '', color: d.color || '#136fd7', ...d })))
        toast.success('Domain updated!')
      } else {
        await saveDomain({ name: newDomain.name, description: newDomain.description, color: newDomain.color })
        const refreshed = await getDomains()
        setDomains(refreshed.map(d => ({ postCount: 0, description: d.description || '', color: d.color || '#136fd7', ...d })))
        toast.success('Domain created!')
      }
      setNewDomain({ name: '', description: '', color: '#136fd7' })
      setEditingDomain(null)
    } catch (error) {
      console.error('Error saving domain:', error)
      toast.error('Failed to save domain')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (domain: Domain) => {
    setEditingDomain(domain)
    setNewDomain({ name: domain.name, description: domain.description ?? '', color: domain.color ?? '#136fd7' })
  }

  const handleDelete = async (domainId: string) => {
    if (window.confirm('Delete this domain?')) {
      try {
        await deleteDomain(domainId)
        setDomains(prev => prev.filter(d => d.id !== domainId))
        toast.success('Domain deleted!')
      } catch (error) {
        console.error('Error deleting domain:', error)
        toast.error('Failed to delete domain')
      }
    }
  }

  const handleCancel = () => {
    setEditingDomain(null)
    setNewDomain({ name: '', description: '', color: '#136fd7' })
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Form */}
      <div className="border border-white/8 rounded-xl p-6">
        <p className="font-sans text-[10px] tracking-widest uppercase text-gray-600 mb-5">
          {editingDomain ? 'Edit Domain' : 'New Domain'}
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Domain Name *</label>
              <input type="text" required value={newDomain.name}
                onChange={(e) => setNewDomain({ ...newDomain, name: e.target.value })}
                className={inputCls} placeholder="Domain name" />
            </div>
            <div>
              <label className={labelCls}>Color *</label>
              <div className="flex items-center gap-2">
                <input type="color" value={newDomain.color}
                  onChange={(e) => setNewDomain({ ...newDomain, color: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-white/8 bg-transparent p-0.5" />
                <input type="text" value={newDomain.color}
                  onChange={(e) => setNewDomain({ ...newDomain, color: e.target.value })}
                  className={`${inputCls} flex-1`} placeholder="#136fd7" />
              </div>
            </div>
          </div>
          <div>
            <label className={labelCls}>Description *</label>
            <textarea required value={newDomain.description}
              onChange={(e) => setNewDomain({ ...newDomain, description: e.target.value })}
              rows={3} className={inputCls} placeholder="Domain description" />
          </div>
          <div className="flex justify-end items-center gap-3">
            {editingDomain && (
              <button type="button" onClick={handleCancel} className={secBtnCls}>Cancel</button>
            )}
            <GradientButton
              type="submit"
              disabled={loading}
              className="!min-w-0 !px-6 !py-2.5 !text-sm !rounded-lg !font-light"
            >
              {loading ? 'Saving…' : editingDomain ? 'Update Domain' : 'Create Domain'}
            </GradientButton>
          </div>
        </form>
      </div>

      {/* Domains list */}
      <div className="border border-white/8 rounded-xl p-6">
        <p className="font-sans text-[10px] tracking-widest uppercase text-gray-600 mb-5">Existing Domains</p>
        {domains.length === 0 ? (
          <p className="font-body text-gray-600 text-sm text-center py-8">No domains yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {domains.map((domain, index) => (
              <div key={domain.id || `domain-${index}`}
                className="border border-white/8 rounded-xl p-4 hover:border-white/15 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: domain.color }} />
                    <span className="font-sans text-sm text-white">{domain.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleEdit(domain)}
                      className="p-1.5 text-gray-600 hover:text-cobalt-light transition-colors">
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => domain.id && handleDelete(domain.id)}
                      className="p-1.5 text-gray-600 hover:text-red-400 transition-colors"
                      disabled={!domain.id}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                {domain.description && (
                  <p className="font-body text-xs text-gray-600 mt-1">{domain.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
