'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Download, Eye, Home, FileText, Radio, RefreshCw } from 'lucide-react'
import {
  getResearchPosts,
  getRadarPosts,
  getSignalPosts,
  getObserverPosts,
  getHomepageViews,
  ResearchPost,
  RadarPost,
  SignalPost,
  ObserverPost,
} from '@/lib/firebase'

type RadarRow = (RadarPost | SignalPost | ObserverPost) & { _type: string; heading: string }

function StatTile({ icon: Icon, label, value, loading }: {
  icon: React.ElementType
  label: string
  value: number
  loading: boolean
}) {
  return (
    <div className="border border-white/6 rounded-xl p-5 flex items-center gap-4">
      <div className="w-9 h-9 rounded-lg bg-cobalt-blue/10 border border-cobalt-blue/20 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-cobalt-light" />
      </div>
      <div>
        <p className="font-sans text-[9px] tracking-[0.45em] uppercase text-gray-600 mb-1">{label}</p>
        {loading
          ? <div className="h-5 w-12 rounded bg-white/5 animate-pulse" />
          : <p className="font-sans text-xl font-light text-white">{value.toLocaleString()}</p>
        }
      </div>
    </div>
  )
}

function RankRow({
  rank, title, sub, views, downloads, loading,
}: {
  rank: number
  title: string
  sub?: string
  views: number
  downloads?: number
  loading?: boolean
}) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-white/[0.04] last:border-0">
      <span className="font-sans text-xs text-gray-700 w-5 text-right flex-shrink-0">{rank}</span>
      <div className="flex-1 min-w-0">
        <p className="font-sans text-sm text-white/85 truncate leading-tight">{title}</p>
        {sub && <p className="font-sans text-[10px] text-gray-600 mt-0.5">{sub}</p>}
      </div>
      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="flex items-center gap-1.5 text-gray-500">
          <Eye className="w-3 h-3" />
          <span className="font-sans text-xs">{views.toLocaleString()}</span>
        </div>
        {downloads !== undefined && (
          <div className="flex items-center gap-1.5 text-gray-500">
            <Download className="w-3 h-3" />
            <span className="font-sans text-xs">{downloads.toLocaleString()}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AnalyticsPanel() {
  const [research, setResearch] = useState<ResearchPost[]>([])
  const [radar, setRadar] = useState<RadarRow[]>([])
  const [homepageViews, setHomepageViews] = useState(0)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const [researchPosts, radarPosts, signals, observers, hpViews] = await Promise.all([
        getResearchPosts(),
        getRadarPosts(),
        getSignalPosts(),
        getObserverPosts(),
        getHomepageViews(),
      ])
      setResearch(
        [...researchPosts].sort(
          (a, b) =>
            ((b.viewCount ?? 0) + (b.downloadCount ?? 0)) -
            ((a.viewCount ?? 0) + (a.downloadCount ?? 0))
        )
      )
      const allRadar: RadarRow[] = [
        ...radarPosts.map(p => ({ ...p, _type: 'Radar' })),
        ...signals.map(p => ({ ...p, _type: 'Signal' })),
        ...observers.map(p => ({ ...p, _type: 'Observer' })),
      ].sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0))
      setRadar(allRadar)
      setHomepageViews(hpViews)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const totalResearchViews = research.reduce((s, p) => s + (p.viewCount ?? 0), 0)
  const totalResearchDownloads = research.reduce((s, p) => s + (p.downloadCount ?? 0), 0)
  const totalRadarViews = radar.reduce((s, p) => s + (p.viewCount ?? 0), 0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-sans font-light text-2xl text-white mb-1">Analytics</h1>
          <p className="font-body text-gray-600 text-sm">Views and downloads across all content</p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 border border-white/8 rounded-lg text-gray-500 hover:text-white hover:border-white/20 transition-colors font-sans text-xs disabled:opacity-40"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatTile icon={Home} label="Homepage Views" value={homepageViews} loading={loading} />
        <StatTile icon={Eye} label="Research Views" value={totalResearchViews} loading={loading} />
        <StatTile icon={Download} label="PDF Downloads" value={totalResearchDownloads} loading={loading} />
        <StatTile icon={TrendingUp} label="Radar Views" value={totalRadarViews} loading={loading} />
      </div>

      {/* Leaderboards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Research */}
        <div className="border border-white/6 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <FileText className="w-3.5 h-3.5 text-cobalt-light" />
            <p className="font-sans text-[9px] tracking-[0.45em] uppercase text-gray-500">Research Rankings</p>
          </div>
          {loading
            ? [...Array(5)].map((_, i) => (
                <div key={i} className="h-12 rounded-lg bg-white/3 animate-pulse mb-2" />
              ))
            : research.length === 0
            ? <p className="font-body text-sm text-gray-600 py-6 text-center">No data yet</p>
            : research.slice(0, 10).map((post, i) => (
                <RankRow
                  key={post.id}
                  rank={i + 1}
                  title={post.title}
                  sub={post.author}
                  views={post.viewCount ?? 0}
                  downloads={post.downloadCount ?? 0}
                />
              ))
          }
        </div>

        {/* Radar */}
        <div className="border border-white/6 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <Radio className="w-3.5 h-3.5 text-cobalt-light" />
            <p className="font-sans text-[9px] tracking-[0.45em] uppercase text-gray-500">Radar Rankings</p>
          </div>
          {loading
            ? [...Array(5)].map((_, i) => (
                <div key={i} className="h-12 rounded-lg bg-white/3 animate-pulse mb-2" />
              ))
            : radar.length === 0
            ? <p className="font-body text-sm text-gray-600 py-6 text-center">No data yet</p>
            : radar.slice(0, 10).map((post, i) => (
                <RankRow
                  key={post.id}
                  rank={i + 1}
                  title={post.heading}
                  sub={post._type}
                  views={post.viewCount ?? 0}
                />
              ))
          }
        </div>
      </div>

      <p className="font-sans text-[10px] text-gray-700 text-center pb-2">
        Counts every page load — includes your own visits. Use for relative ranking only.
      </p>
    </div>
  )
}
