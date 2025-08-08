'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import ResearchForm from './ResearchForm'
import RadarForm from './RadarForm'
import TagManager from './TagManager'
import DomainManager from './DomainManager'
import PostManager from './PostManager'
import { dataStore } from '@/lib/dataStore'
import { ArrowLeft } from 'lucide-react'

type TabType = 'manage-research' | 'manage-signals' | 'manage-observer' | 'tags' | 'domains' | 'create-research' | 'create-signal' | 'create-observer'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('manage-research')
  const [editingPost, setEditingPost] = useState<any>(null)
  const [editingType, setEditingType] = useState<'research' | 'signal' | 'observer' | null>(null)

  const tabs = [
    { id: 'manage-research', label: 'Manage Research' },
    { id: 'manage-signals', label: 'Manage Signals' },
    { id: 'manage-observer', label: 'Manage Observer' },
    { id: 'tags', label: 'Tag Management' },
    { id: 'domains', label: 'Domain Management' },
  ]

  const handleCreateNew = (type: 'research' | 'signal' | 'observer') => {
    setEditingPost(null)
    setEditingType(null)
    switch (type) {
      case 'research':
        setActiveTab('create-research')
        break
      case 'signal':
        setActiveTab('create-signal')
        break
      case 'observer':
        setActiveTab('create-observer')
        break
    }
  }

  const handleEdit = (post: any, type: 'research' | 'signal' | 'observer') => {
    setEditingPost(post)
    setEditingType(type)
    switch (type) {
      case 'research':
        setActiveTab('create-research')
        break
      case 'signal':
        setActiveTab('create-signal')
        break
      case 'observer':
        setActiveTab('create-observer')
        break
    }
  }

  const handleDelete = (id: string, type: 'research' | 'signal' | 'observer') => {
    if (confirm('Are you sure you want to delete this post?')) {
      switch (type) {
        case 'research':
          dataStore.deleteResearchPost(id)
          break
        case 'signal':
          dataStore.deleteSignalPost(id)
          break
        case 'observer':
          dataStore.deleteObserverPost(id)
          break
      }
      // Force re-render
      setActiveTab(activeTab)
    }
  }

  const handleFormSubmit = (data: any, type: 'research' | 'signal' | 'observer') => {
    if (editingPost) {
      // Update existing post
      switch (type) {
        case 'research':
          dataStore.updateResearchPost(editingPost.id, data)
          break
        case 'signal':
          dataStore.updateSignalPost(editingPost.id, data)
          break
        case 'observer':
          dataStore.updateObserverPost(editingPost.id, data)
          break
      }
    } else {
      // Create new post
      switch (type) {
        case 'research':
          dataStore.addResearchPost(data)
          break
        case 'signal':
          dataStore.addSignalPost(data)
          break
        case 'observer':
          dataStore.addObserverPost(data)
          break
      }
    }
    setEditingPost(null)
    setEditingType(null)
    // Switch to management tab
    switch (type) {
      case 'research':
        setActiveTab('manage-research')
        break
      case 'signal':
        setActiveTab('manage-signals')
        break
      case 'observer':
        setActiveTab('manage-observer')
        break
    }
  }

  const handleBack = () => {
    setEditingPost(null)
    setEditingType(null)
    if (activeTab.startsWith('create-')) {
      const type = activeTab.replace('create-', '') as 'research' | 'signal' | 'observer'
      setActiveTab(`manage-${type}` as TabType)
    }
  }

  // Transform data for PostManager
  const transformResearchPosts = () => {
    return dataStore.getResearchPosts().map(post => ({
      ...post,
      type: 'research' as const,
      title: post.title,
      author: post.author,
      date: post.date,
      excerpt: post.excerpt,
      content: post.excerpt, // Use excerpt as content for display
      tags: post.tags,
      image: post.image,
      whitepaper: post.whitepaper
    }))
  }

  const transformSignalPosts = () => {
    return dataStore.getSignalPosts().map(post => ({
      ...post,
      type: 'signals' as const,
      title: post.heading,
      author: undefined,
      date: post.createdAt,
      excerpt: post.content,
      content: post.content,
      tags: post.tags,
      image: post.image,
      whitepaper: undefined
    }))
  }

  const transformObserverPosts = () => {
    return dataStore.getObserverPosts().map(post => ({
      ...post,
      type: 'observer' as const,
      title: post.heading,
      author: undefined,
      date: post.createdAt,
      excerpt: post.content,
      content: post.content,
      tags: post.tags,
      image: post.image,
      whitepaper: undefined
    }))
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'create-research':
        return (
          <div>
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-cobalt-light hover:text-cobalt-blue transition-colors mb-6 font-montserrat"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Manage Research
            </button>
            <ResearchForm 
              onSubmit={(data) => handleFormSubmit(data, 'research')}
              initialData={editingPost}
            />
          </div>
        )
      case 'create-signal':
        return (
          <div>
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-cobalt-light hover:text-cobalt-blue transition-colors mb-6 font-montserrat"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Manage Signals
            </button>
            <RadarForm 
              onSubmit={(data) => handleFormSubmit(data, 'signal')}
              initialData={editingPost}
              type="signal"
            />
          </div>
        )
      case 'create-observer':
        return (
          <div>
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-cobalt-light hover:text-cobalt-blue transition-colors mb-6 font-montserrat"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Manage Observer
            </button>
            <RadarForm 
              onSubmit={(data) => handleFormSubmit(data, 'observer')}
              initialData={editingPost}
              type="observer"
            />
          </div>
        )
      case 'manage-research':
        return (
          <PostManager
            type="research"
            posts={transformResearchPosts()}
            onEdit={(post) => handleEdit(post, 'research')}
            onDelete={(id) => handleDelete(id, 'research')}
            onCreateNew={() => handleCreateNew('research')}
          />
        )
      case 'manage-signals':
        return (
          <PostManager
            type="signals"
            posts={transformSignalPosts()}
            onEdit={(post) => handleEdit(post, 'signal')}
            onDelete={(id) => handleDelete(id, 'signal')}
            onCreateNew={() => handleCreateNew('signal')}
          />
        )
      case 'manage-observer':
        return (
          <PostManager
            type="observer"
            posts={transformObserverPosts()}
            onEdit={(post) => handleEdit(post, 'observer')}
            onDelete={(id) => handleDelete(id, 'observer')}
            onCreateNew={() => handleCreateNew('observer')}
          />
        )
      case 'tags':
        return <TagManager />
      case 'domains':
        return <DomainManager />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-space-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-8 text-center font-montserrat"
        >
          Admin Dashboard
        </motion.h1>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-6 py-3 rounded-full font-montserrat-alternates transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-cobalt-blue text-white shadow-lg'
                  : 'bg-space-gray text-gray-300 hover:bg-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="glass-morphism rounded-2xl p-8"
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  )
} 