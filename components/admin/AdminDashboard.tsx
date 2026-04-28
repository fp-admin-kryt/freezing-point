'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText, Radio, Tag, Globe, Plus, Edit, Trash2,
  Type, LogOut, ChevronRight, LayoutDashboard,
} from 'lucide-react'
import Image from 'next/image'
import ResearchForm from './ResearchForm'
import RadarForm from './RadarForm'
import TagManager from './TagManager'
import DomainManager from './DomainManager'
import TypographyPanel from './TypographyPanel'
import { GradientButton } from '@/components/ui/gradient-button'
import {
  getResearchPosts, getSignalPosts, getObserverPosts, getRadarPosts,
  deleteResearchPost, deleteSignalPost, deleteObserverPost, deleteRadarPost,
} from '@/lib/firebase'
import toast from 'react-hot-toast'

type SectionType = 'research' | 'radar' | 'tags' | 'domains' | 'typography'
type ViewType = 'manage' | 'create' | 'edit'

interface Post {
  id?: string
  title?: string
  heading?: string
  author?: string
  date?: string
  imageUrl?: string
  type?: 'research' | 'signal' | 'observer' | 'radar'
}

const NAV_GROUPS = [
  {
    label: 'Content',
    items: [
      { id: 'research' as SectionType, label: 'Research', icon: FileText },
      { id: 'radar' as SectionType, label: 'Radar', icon: Radio },
    ],
  },
  {
    label: 'Manage',
    items: [
      { id: 'tags' as SectionType, label: 'Tags', icon: Tag },
      { id: 'domains' as SectionType, label: 'Domains', icon: Globe },
    ],
  },
]

const SECTION_META: Record<SectionType, { title: string; description: string; action?: string }> = {
  research: { title: 'Research', description: 'Published research papers and articles', action: 'New Research' },
  radar: { title: 'Radar', description: 'Intelligence signals and observations', action: 'New Radar Post' },
  tags: { title: 'Tags', description: 'Manage content taxonomy' },
  domains: { title: 'Domains', description: 'Manage domain categories' },
  typography: { title: 'Typography', description: 'Font styles, sizes, and rendering' },
}

function NavItem({
  id, label, icon: Icon, active, onClick,
}: {
  id: string; label: string; icon: React.ElementType; active: boolean; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-sans transition-all duration-150 ${
        active
          ? 'bg-cobalt-blue/12 text-cobalt-light border border-cobalt-blue/18'
          : 'text-gray-500 hover:text-gray-200 hover:bg-white/4'
      }`}
    >
      <Icon className="w-[15px] h-[15px] flex-shrink-0" />
      <span>{label}</span>
      {active && <ChevronRight className="w-3 h-3 ml-auto opacity-60" />}
    </button>
  )
}

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<SectionType>('research')
  const [view, setView] = useState<ViewType>('manage')
  const [researchPosts, setResearchPosts] = useState<Post[]>([])
  const [radarPosts, setRadarPosts] = useState<Post[]>([])
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [research, signals, observers, newRadar] = await Promise.all([
          getResearchPosts(),
          getSignalPosts(),
          getObserverPosts(),
          getRadarPosts(),
        ])
        setResearchPosts(research)
        const merged = [
          ...newRadar.map(p => ({ ...p, type: 'radar' as const })),
          ...signals.map(p => ({ ...p, type: 'signal' as const })),
          ...observers.map(p => ({ ...p, type: 'observer' as const })),
        ].sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
        setRadarPosts(merged)
      } catch {
        toast.error('Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleDelete = async (postId: string, type: 'research' | 'signal' | 'observer' | 'radar') => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return
    try {
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
      toast.success('Deleted')
    } catch {
      toast.error('Failed to delete')
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

  const handleSignOut = () => {
    sessionStorage.removeItem('admin-token')
    window.location.reload()
  }

  const handleSectionChange = (section: SectionType) => {
    setActiveSection(section)
    setView('manage')
    setEditingPost(null)
  }

  const renderContent = () => {
    if (activeSection === 'typography') return <TypographyPanel />
    if (activeSection === 'tags') return <TagManager />
    if (activeSection === 'domains') return <DomainManager />

    if (view === 'create' || view === 'edit') {
      if (activeSection === 'research') {
        return <ResearchForm onBack={handleBack} editPost={view === 'edit' ? editingPost : undefined} />
      }
      if (activeSection === 'radar') {
        return <RadarForm onBack={handleBack} editPost={view === 'edit' ? editingPost : undefined} />
      }
    }

    const isResearch = activeSection === 'research'
    const posts = isResearch ? researchPosts : radarPosts

    if (loading) {
      return (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-white/3 animate-pulse" />
          ))}
        </div>
      )
    }

    if (posts.length === 0) {
      return (
        <div className="text-center py-24 border border-white/5 rounded-2xl">
          <p className="font-body text-gray-600 text-sm mb-6">No {activeSection} posts yet.</p>
          <GradientButton
            onClick={() => setView('create')}
            className="!min-w-0 !px-6 !py-2.5 !text-sm !rounded-lg !font-light"
          >
            Create first post
          </GradientButton>
        </div>
      )
    }

    return (
      <div className="space-y-1.5">
        {posts.map((post, index) => (
          <div
            key={post.id || index}
            className="group border border-white/6 rounded-xl px-5 py-3.5 hover:border-white/10 hover:bg-white/[0.015] transition-all duration-150"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {post.imageUrl ? (
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-white/8">
                    <Image src={post.imageUrl} alt="" fill className="object-cover" sizes="40px" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-lg flex-shrink-0 bg-white/4 border border-white/6 flex items-center justify-center">
                    {isResearch
                      ? <FileText className="w-4 h-4 text-gray-700" />
                      : <Radio className="w-4 h-4 text-gray-700" />
                    }
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="font-sans text-sm font-medium text-white/90 truncate leading-tight">
                    {isResearch ? post.title : post.heading}
                  </h3>
                  <p className="font-body text-gray-600 text-xs mt-0.5">
                    {isResearch && post.author ? `${post.author} · ` : ''}{post.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <button
                  onClick={() => handleEdit({ ...post, type: isResearch ? 'research' : post.type })}
                  className="p-2 text-gray-600 hover:text-cobalt-light transition-colors rounded-lg hover:bg-white/4"
                  title="Edit"
                >
                  <Edit className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => post.id && post.type && handleDelete(post.id, isResearch ? 'research' : post.type as any)}
                  className="p-2 text-gray-600 hover:text-red-400 transition-colors rounded-lg hover:bg-white/4"
                  disabled={!post.id}
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const meta = SECTION_META[activeSection]
  const isContentSection = activeSection === 'research' || activeSection === 'radar'
  const showActionButton = isContentSection && view === 'manage'
  const breadcrumbGroup = activeSection === 'research' || activeSection === 'radar'
    ? 'Content'
    : activeSection === 'tags' || activeSection === 'domains'
    ? 'Manage'
    : 'Settings'

  return (
    <div className="flex min-h-screen bg-[#050508]">

      {/* ── Sidebar ── */}
      <aside className="w-60 flex-shrink-0 fixed left-0 top-0 bottom-0 bg-[#06060a] border-r border-white/[0.05] flex flex-col z-50">

        {/* Logo / header */}
        <div className="px-5 py-5 border-b border-white/[0.05]">
          <div className="flex items-center gap-3">
            <div className="relative w-7 h-7 flex-shrink-0">
              <Image src="/assets/logos/fp-logo.png" alt="FP" fill className="object-contain opacity-90" sizes="28px" />
            </div>
            <div>
              <p className="font-sans text-white/90 text-[13px] font-medium leading-none tracking-tight">Freezing Point</p>
              <p className="font-sans text-[9px] tracking-[0.35em] uppercase text-gray-700 mt-0.5">Admin</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5 overflow-y-auto">
          <div className="space-y-5">
            {NAV_GROUPS.map((group) => (
              <div key={group.label}>
                <p className="font-sans text-[8.5px] tracking-[0.45em] uppercase text-gray-700 px-3 mb-1.5">
                  {group.label}
                </p>
                <div className="space-y-0.5">
                  {group.items.map((item) => (
                    <NavItem
                      key={item.id}
                      id={item.id}
                      label={item.label}
                      icon={item.icon}
                      active={activeSection === item.id}
                      onClick={() => handleSectionChange(item.id)}
                    />
                  ))}
                </div>
              </div>
            ))}

            {/* Settings group */}
            <div>
              <div className="h-px bg-white/[0.04] mb-4" />
              <p className="font-sans text-[8.5px] tracking-[0.45em] uppercase text-gray-700 px-3 mb-1.5">
                Settings
              </p>
              <NavItem
                id="typography"
                label="Typography"
                icon={Type}
                active={activeSection === 'typography'}
                onClick={() => handleSectionChange('typography')}
              />
            </div>
          </div>
        </nav>

        {/* Sign out */}
        <div className="px-3 py-4 border-t border-white/[0.04]">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-sans text-gray-600 hover:text-red-400/80 hover:bg-red-500/5 transition-all duration-150"
          >
            <LogOut className="w-[15px] h-[15px] flex-shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 ml-60 min-h-screen flex flex-col">

        {/* Top bar */}
        <div className="border-b border-white/[0.05] px-8 py-4 flex items-center justify-between sticky top-0 bg-[#050508]/90 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            <span className="font-sans text-[9px] tracking-[0.35em] uppercase text-gray-700">
              {breadcrumbGroup}
            </span>
            <ChevronRight className="w-3 h-3 text-gray-800" />
            <span className="font-sans text-[9px] tracking-[0.35em] uppercase text-gray-500">
              {meta.title}
            </span>
            {(view === 'create' || view === 'edit') && (
              <>
                <ChevronRight className="w-3 h-3 text-gray-800" />
                <span className="font-sans text-[9px] tracking-[0.35em] uppercase text-cobalt-light">
                  {view === 'create' ? 'New' : 'Edit'}
                </span>
              </>
            )}
          </div>

          {showActionButton && meta.action && (
            <GradientButton
              onClick={() => setView('create')}
              className="!min-w-0 !px-4 !py-2 !text-xs !rounded-lg !font-light"
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              {meta.action}
            </GradientButton>
          )}
        </div>

        {/* Page content */}
        <div className="flex-1 px-8 py-8">
          {/* Section heading (only on manage view, not forms/tags/domains/typography) */}
          {view === 'manage' && isContentSection && (
            <div className="mb-7">
              <h1 className="font-sans font-light text-2xl text-white mb-1">{meta.title}</h1>
              <p className="font-body text-gray-600 text-sm">{meta.description}</p>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeSection}-${view}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
