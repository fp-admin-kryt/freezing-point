'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, Radio, Tag, Globe, Plus, Edit, Trash2 } from 'lucide-react'
import ResearchForm from './ResearchForm'
import RadarForm from './RadarForm'
import TagManager from './TagManager'
import DomainManager from './DomainManager'
import { GradientButton } from '@/components/ui/gradient-button'
import { getResearchPosts, getSignalPosts, getObserverPosts, getRadarPosts, deleteResearchPost, deleteSignalPost, deleteObserverPost, deleteRadarPost, getTags, getDomains } from '@/lib/firebase'
import toast from 'react-hot-toast'

type TabType = 'research' | 'radar' | 'tags' | 'domains'
type ViewType = 'manage' | 'create' | 'edit'

interface Post {
  id?: string
  title?: string
  heading?: string
  author?: string
  date?: string
  type?: 'research' | 'signal' | 'observer' | 'radar'
}

const inputCls = "w-full px-4 py-2.5 bg-transparent border border-white/8 rounded-lg text-white placeholder-gray-700 font-sans text-sm focus:outline-none focus:border-cobalt-blue/50 transition-colors"
const secBtnCls = "px-4 py-2 border border-white/8 rounded-lg text-gray-400 hover:text-white hover:border-white/20 transition-colors font-sans text-sm"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('research')
  const [view, setView] = useState<ViewType>('manage')
  const [researchPosts, setResearchPosts] = useState<Post[]>([])
  const [radarPosts, setRadarPosts] = useState<Post[]>([])
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(false)
  const [tags, setTags] = useState<any[]>([])
  const [domains, setDomains] = useState<any[]>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const [research, signals, observers, newRadar, tagsData, domainsData] = await Promise.all([
          getResearchPosts(),
          getSignalPosts(),
          getObserverPosts(),
          getRadarPosts(),
          getTags(),
          getDomains()
        ])
        setResearchPosts(research)
        // Merge legacy signals/observers with new radar posts into one list
        const merged = [
          ...newRadar.map(p => ({ ...p, type: 'radar' as const })),
          ...signals.map(p => ({ ...p, type: 'signal' as const })),
          ...observers.map(p => ({ ...p, type: 'observer' as const })),
        ].sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
        setRadarPosts(merged)
        setTags(tagsData)
        setDomains(domainsData)
      } catch (error) {
        console.error('Error loading data:', error)
        toast.error('Failed to load data')
      }
    }
    loadData()
  }, [])

  const handleDelete = async (postId: string, type: 'research' | 'signal' | 'observer' | 'radar') => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        if (postId) {
          if (type === 'research') {
            await deleteResearchPost(postId)
            setResearchPosts(prev => prev.filter(p => p.id !== postId))
          } else if (type === 'signal') {
            await deleteSignalPost(postId)
            setRadarPosts(prev => prev.filter(p => p.id !== postId))
          } else if (type === 'observer') {
            await deleteObserverPost(postId)
            setRadarPosts(prev => prev.filter(p => p.id !== postId))
          } else if (type === 'radar') {
            await deleteRadarPost(postId)
            setRadarPosts(prev => prev.filter(p => p.id !== postId))
          }
          toast.success('Post deleted successfully!')
        }
      } catch (error) {
        console.error('Error deleting post:', error)
        toast.error('Failed to delete post')
      }
    }
  }

  const handleEdit = (post: Post) => {
    setEditingPost(post)
    setView('edit')
  }

  const handleBack = () => {
    setView('manage')
    setEditingPost(null)
  }

  const tabs = [
    { id: 'research', label: 'Research', icon: FileText },
    { id: 'radar', label: 'Radar', icon: Radio },
    { id: 'tags', label: 'Tags', icon: Tag },
    { id: 'domains', label: 'Domains', icon: Globe },
  ]

  const renderContent = () => {
    if (view === 'create' || view === 'edit') {
      if (activeTab === 'research') {
        return (
          <ResearchForm
            onBack={handleBack}
            editPost={view === 'edit' ? editingPost : undefined}
          />
        )
      } else if (activeTab === 'radar') {
        return (
          <RadarForm
            onBack={handleBack}
            editPost={view === 'edit' ? editingPost : undefined}
          />
        )
      } else if (activeTab === 'tags') {
        return <TagManager />
      } else if (activeTab === 'domains') {
        return <DomainManager />
      }
      return null
    }

    return (
      <div className="space-y-6">
        {/* Header with Create Button */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="font-sans text-[10px] tracking-[0.5em] uppercase text-cobalt-light mb-1">
              {activeTab === 'research' ? 'Publications' : activeTab === 'radar' ? 'Intelligence' : activeTab === 'tags' ? 'Taxonomy' : 'Categorisation'}
            </p>
            <h2 className="font-sans font-light text-2xl text-white">
              {activeTab === 'research' ? 'Research Posts' : activeTab === 'radar' ? 'Radar Posts' : activeTab === 'tags' ? 'Tags' : 'Domains'}
            </h2>
          </div>

          {activeTab === 'research' && (
            <GradientButton
              onClick={() => setView('create')}
              className="!min-w-0 !px-5 !py-2.5 !text-sm !rounded-lg !font-light"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Research
            </GradientButton>
          )}
          {activeTab === 'radar' && (
            <GradientButton
              onClick={() => setView('create')}
              className="!min-w-0 !px-5 !py-2.5 !text-sm !rounded-lg !font-light"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Radar Post
            </GradientButton>
          )}
        </div>

        {/* Posts List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-6 w-6 border-b border-cobalt-blue" />
          </div>
        ) : (
          <div className="space-y-2">
            {activeTab === 'research' && researchPosts.map((post, index) => (
              <div key={post.id || `research-${index}`} className="border border-white/8 rounded-xl px-5 py-4 hover:border-white/12 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-sans text-sm font-medium text-white truncate">{post.title}</h3>
                    <p className="font-body text-gray-600 text-xs mt-0.5">
                      {post.author} &middot; {post.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 ml-4">
                    <button
                      onClick={() => handleEdit({ ...post, type: 'research' })}
                      className="p-2 text-gray-600 hover:text-cobalt-light transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => post.id && handleDelete(post.id, 'research')}
                      className="p-2 text-gray-600 hover:text-red-400 transition-colors"
                      disabled={!post.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {activeTab === 'radar' && radarPosts.map((post, index) => (
              <div key={post.id || `radar-${index}`} className="border border-white/8 rounded-xl px-5 py-4 hover:border-white/12 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-sans text-sm font-medium text-white truncate">{post.heading}</h3>
                    <p className="font-body text-gray-600 text-xs mt-0.5">{post.date}</p>
                  </div>
                  <div className="flex items-center gap-1 ml-4">
                    <button
                      onClick={() => handleEdit({ ...post, type: post.type })}
                      className="p-2 text-gray-600 hover:text-cobalt-light transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => post.id && post.type && handleDelete(post.id, post.type)}
                      className="p-2 text-gray-600 hover:text-red-400 transition-colors"
                      disabled={!post.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {activeTab === 'tags' && <TagManager />}
            {activeTab === 'domains' && <DomainManager />}

            {((activeTab === 'research' && researchPosts.length === 0) ||
              (activeTab === 'radar' && radarPosts.length === 0)) && (
              <div className="text-center py-16">
                <p className="font-body text-gray-600 text-sm mb-6">
                  No {activeTab} posts yet.
                </p>
                <GradientButton
                  onClick={() => setView('create')}
                  className="!min-w-0 !px-6 !py-2.5 !text-sm !rounded-lg !font-light"
                >
                  Create first post
                </GradientButton>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050508]">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-sans text-[10px] tracking-[0.5em] uppercase text-cobalt-light mb-3">
                Content Management
              </p>
              <h1 className="font-sans font-light text-3xl text-white">Admin Dashboard</h1>
            </div>
            <button
              onClick={() => { window.location.href = '/admin/styles' }}
              className={secBtnCls}
            >
              Typography Settings
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-[#0a0a0f] border border-white/8 rounded-xl p-1 mb-8 w-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as TabType)
                  setView('manage')
                  setEditingPost(null)
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-sans text-sm ${
                  activeTab === tab.id
                    ? 'bg-cobalt-blue/20 text-cobalt-light border border-cobalt-blue/30'
                    : 'text-gray-600 hover:text-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Content */}
        <motion.div
          key={`${activeTab}-${view}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </div>
    </div>
  )
}
