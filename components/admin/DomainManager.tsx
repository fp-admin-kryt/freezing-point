'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { getDomains, saveDomain, updateDomain, deleteDomain } from '@/lib/firebase'
import toast from 'react-hot-toast'

interface Domain {
  id?: string
  name: string
  description?: string
  color?: string
  postCount: number
}

export default function DomainManager() {
  const [domains, setDomains] = useState<Domain[]>([])
  const [newDomain, setNewDomain] = useState({ name: '', description: '', color: '#136fd7' })
  const [editingDomain, setEditingDomain] = useState<Domain | null>(null)
  const [loading, setLoading] = useState(false)
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Load from Firebase
  useEffect(() => {
    const load = async () => {
      try {
        const fetched = await getDomains()
        // Ensure postCount exists for UI; default 0
        setDomains(fetched.map(d => ({ postCount: 0, description: '', color: '#136fd7', ...d })))
      } catch (e) {
        console.error('Error loading domains', e)
        setDomains([])
      }
    }
    load()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingDomain && editingDomain.id) {
        await updateDomain(editingDomain.id, {
          name: newDomain.name,
          description: newDomain.description,
          color: newDomain.color
        })
        const refreshed = await getDomains()
        setDomains(refreshed.map(d => ({ postCount: 0, ...d })))
        toast.success('Domain updated successfully!')
      } else {
        await saveDomain({
          name: newDomain.name,
          description: newDomain.description,
          color: newDomain.color
        })
        const refreshed = await getDomains()
        setDomains(refreshed.map(d => ({ postCount: 0, ...d })))
        toast.success('Domain created successfully!')
      }

      // Reset form
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
    setNewDomain({
      name: domain.name,
      description: domain.description ?? '',
      color: domain.color ?? '#136fd7'
    })
  }

  const handleDelete = async (domainId: string) => {
    if (window.confirm('Are you sure you want to delete this domain?')) {
      try {
        await deleteDomain(domainId)
        setDomains(prev => prev.filter(domain => domain.id !== domainId))
        toast.success('Domain deleted successfully!')
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
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Domain Management</h2>
        <button
          type="button"
          onClick={() => { setEditingDomain(null); setNewDomain({ name: '', description: '', color: '#136fd7' }); scrollToTop(); }}
          className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/15 transition-colors"
        >
          Create Domain
        </button>
      </div>

      {/* Create/Edit Form */}
      <div className="bg-space-gray rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          {editingDomain ? 'Edit Domain' : 'Create New Domain'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Domain Name */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Domain Name *
              </label>
              <input
                type="text"
                required
                value={newDomain.name}
                onChange={(e) => setNewDomain({ ...newDomain, name: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cobalt-blue"
                placeholder="Enter domain name"
              />
            </div>

            {/* Domain Color */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Domain Color *
              </label>
              <input
                type="color"
                value={newDomain.color}
                onChange={(e) => setNewDomain({ ...newDomain, color: e.target.value })}
                className="w-full h-10 bg-gray-800 border border-gray-600 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Description *
            </label>
            <textarea
              required
              value={newDomain.description}
              onChange={(e) => setNewDomain({ ...newDomain, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cobalt-blue"
              placeholder="Enter domain description"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            {editingDomain && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-cobalt-blue text-white rounded-lg hover:bg-cobalt-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  {editingDomain ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  <span>{editingDomain ? 'Update Domain' : 'Create Domain'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Domains List */}
      <div className="bg-space-gray rounded-lg p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Existing Domains</h3>
          <button
            type="button"
            onClick={() => { setEditingDomain(null); setNewDomain({ name: '', description: '', color: '#136fd7' }); scrollToTop(); }}
            className="px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-sm hover:bg-white/15 transition-colors"
          >
            + Create Domain
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {domains.map((domain, index) => (
            <div
              key={domain.id || `domain-${index}`}
              className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: domain.color }}
                  ></div>
                  <span className="text-white font-medium">{domain.name}</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(domain)}
                    className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => domain.id && handleDelete(domain.id)}
                    className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                    disabled={!domain.id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-gray-300 text-sm mb-2">{domain.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Posts: {domain.postCount}</span>
              </div>
            </div>
          ))}
        </div>
        {domains.length === 0 && (
          <p className="text-gray-400 text-center py-8">No domains created yet.</p>
        )}
      </div>
    </div>
  )
} 