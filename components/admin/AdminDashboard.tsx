'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Radio, 
  Eye, 
  Tag, 
  Globe, 
  Plus, 
  Edit, 
  Trash2,
  ArrowLeft 
} from 'lucide-react'
import ResearchForm from './ResearchForm'
import RadarForm from './RadarForm'
import TagManager from './TagManager'
import DomainManager from './DomainManager'
import { getResearchPosts, getSignalPosts, getObserverPosts, deleteResearchPost, deleteSignalPost, deleteObserverPost } from '@/lib/firebase'
import toast from 'react-hot-toast'

type TabType = 'research' | 'signals' | 'observer' | 'tags' | 'domains'
type ViewType = 'manage' | 'create' | 'edit'

interface Post {
  id?: string
  title?: string
  heading?: string
  author?: string
  date?: string
  type?: 'research' | 'signal' | 'observer'
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('research')
  const [view, setView] = useState<ViewType>('manage')
  const [researchPosts, setResearchPosts] = useState<Post[]>([])
  const [signalPosts, setSignalPosts] = useState<Post[]>([])
  const [observerPosts, setObserverPosts] = useState<Post[]>([])
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(false)

  // Load data from Firebase
  useEffect(() => {
    const loadData = async () => {
      try {
        const [research, signals, observers] = await Promise.all([
          getResearchPosts(),
          getSignalPosts(),
          getObserverPosts()
        ])
        setResearchPosts(research)
        setSignalPosts(signals)
        setObserverPosts(observers)
      } catch (error) {
        console.error('Error loading data:', error)
        toast.error('Failed to load data')
      }
    }
    loadData()
  }, [])

  const handleDelete = async (postId: string, type: 'research' | 'signal' | 'observer') => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        if (postId) {
          if (type === 'research') {
            await deleteResearchPost(postId)
            setResearchPosts(prev => prev.filter(p => p.id !== postId))
          } else if (type === 'signal') {
            await deleteSignalPost(postId)
            setSignalPosts(prev => prev.filter(p => p.id !== postId))
          } else if (type === 'observer') {
            await deleteObserverPost(postId)
            setObserverPosts(prev => prev.filter(p => p.id !== postId))
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
    { id: 'signals', label: 'Signals', icon: Radio },
    { id: 'observer', label: 'Observer', icon: Eye },
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
      } else if (activeTab === 'signals') {
        return (
          <RadarForm 
            onBack={handleBack}
            type="signal"
            editPost={view === 'edit' ? editingPost : undefined}
          />
        )
      } else if (activeTab === 'observer') {
        return (
          <RadarForm 
            onBack={handleBack}
            type="observer"
            editPost={view === 'edit' ? editingPost : undefined}
          />
        )
      } else if (activeTab === 'tags') {
        return <TagManager />
      } else if (activeTab === 'domains') {
        return <DomainManager />
      }
    }

    // Manage view
    return (
      <div className="space-y-6">
        {/* Header with Create Button */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            Manage {activeTab === 'research' ? 'Research Posts' : 
                   activeTab === 'signals' ? 'Signal Posts' : 
                   activeTab === 'observer' ? 'Observer Posts' : 
                   activeTab === 'tags' ? 'Tags' : 'Domains'}
          </h2>
          {(activeTab === 'research' || activeTab === 'signals' || activeTab === 'observer') && (
            <button
              onClick={() => setView('create')}
              className="px-4 py-2 bg-cobalt-blue text-white rounded-lg hover:bg-cobalt-light transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create New</span>
            </button>
          )}
        </div>

        {/* Posts List */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cobalt-blue"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {activeTab === 'research' && researchPosts.map((post) => (
              <div key={post.id} className="bg-space-gray rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">{post.title}</h3>
                    <p className="text-gray-400 text-sm">By {post.author} • {post.date}</p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit({ ...post, type: 'research' })}
                      className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id, 'research')}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {activeTab === 'signals' && signalPosts.map((post) => (
              <div key={post.id} className="bg-space-gray rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">{post.heading}</h3>
                    <p className="text-gray-400 text-sm">{post.date}</p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit({ ...post, type: 'signal' })}
                      className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id, 'signal')}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {activeTab === 'observer' && observerPosts.map((post) => (
              <div key={post.id} className="bg-space-gray rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">{post.heading}</h3>
                    <p className="text-gray-400 text-sm">{post.date}</p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit({ ...post, type: 'observer' })}
                      className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id, 'observer')}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty state */}
            {((activeTab === 'research' && researchPosts.length === 0) ||
              (activeTab === 'signals' && signalPosts.length === 0) ||
              (activeTab === 'observer' && observerPosts.length === 0)) && (
              <div className="text-center py-8">
                <p className="text-gray-400">No {activeTab} posts found.</p>
                <button
                  onClick={() => setView('create')}
                  className="mt-4 px-4 py-2 bg-cobalt-blue text-white rounded-lg hover:bg-cobalt-light transition-colors"
                >
                  Create your first post
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-space-black">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage your content, tags, and domains</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-space-gray rounded-lg p-1 mb-8">
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
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-cobalt-blue text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </div>
    </div>
  )
} 