'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getTypographySettings, saveTypographySettings, TypographySettings } from '@/lib/firebase'
import { getTypography, clearTypographyCache } from '@/lib/typography'
import { GradientButton } from '@/components/ui/gradient-button'
import toast from 'react-hot-toast'

const inputCls = "w-full px-4 py-2.5 bg-transparent border border-white/8 rounded-lg text-white placeholder-gray-700 font-sans text-sm focus:outline-none focus:border-cobalt-blue/50 transition-colors"
const labelCls = "block font-sans text-[10px] tracking-widest uppercase text-gray-600 mb-2"

const FONT_OPTIONS = [
  { value: '', label: 'Default (Space Grotesk)' },
  { value: 'Space Grotesk', label: 'Space Grotesk' },
  { value: 'Inter', label: 'Inter' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Montserrat Alternates', label: 'Montserrat Alternates' },
  { value: 'Georgia, serif', label: 'Georgia (Serif)' },
  { value: 'system-ui, sans-serif', label: 'System UI' },
]

const ELEMENT_OPTIONS = [
  { value: 'h1', label: '<h1>' },
  { value: 'h2', label: '<h2>' },
  { value: 'h3', label: '<h3>' },
  { value: 'h4', label: '<h4>' },
  { value: 'p', label: '<p>' },
  { value: 'span', label: '<span>' },
]

const DEFAULT_ELEMENTS: Record<string, string> = {
  heading1: 'h1',
  heading2: 'h2',
  heading3: 'h3',
  body: 'p',
  caption: 'span',
}

const styleKeys: Array<keyof Omit<TypographySettings, 'id' | 'updatedAt'>> = [
  'heading1', 'heading2', 'heading3', 'body', 'caption',
]

const styleLabels: Record<string, string> = {
  heading1: 'Heading 1',
  heading2: 'Heading 2',
  heading3: 'Heading 3',
  body: 'Body Text',
  caption: 'Caption',
}

const PREVIEW_TEXT: Record<string, string> = {
  heading1: 'The Frontiers of Artificial Intelligence',
  heading2: 'Emerging Signals & Research',
  heading3: 'Section Overview',
  body: 'Cutting-edge developments at the intersection of AI, policy, and society — curated weekly for researchers and practitioners.',
  caption: 'Published · Freezing Point AI · 2026',
}

export default function TypographyPanel() {
  const [settings, setSettings] = useState<TypographySettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadSettings() }, [])

  const loadSettings = async () => {
    try {
      setSettings(await getTypography())
    } catch {
      toast.error('Failed to load typography settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!settings) return
    setSaving(true)
    try {
      await saveTypographySettings({
        heading1: settings.heading1,
        heading2: settings.heading2,
        heading3: settings.heading3,
        body: settings.body,
        caption: settings.caption,
      })
      clearTypographyCache()
      toast.success('Typography settings saved!')
    } catch {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const updateStyle = (
    styleKey: keyof Omit<TypographySettings, 'id' | 'updatedAt'>,
    property: string,
    value: string,
    device?: 'desktop' | 'mobile'
  ) => {
    if (!settings) return
    const current = settings[styleKey] as any
    setSettings({
      ...settings,
      [styleKey]: {
        ...current,
        ...(property === 'fontSize' && device
          ? { fontSize: { ...current.fontSize, [device]: value } }
          : { [property]: value }),
      },
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-5 w-5 border-b border-cobalt-blue" />
      </div>
    )
  }

  if (!settings) {
    return <p className="font-sans text-sm text-red-400">Failed to load settings</p>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-sans font-light text-2xl text-white mb-1">Typography</h1>
        <p className="font-body text-gray-600 text-sm">
          Configure font families, sizes, weights, and HTML elements for all text styles.
        </p>
      </div>

      <div className="space-y-4">
        {styleKeys.map((styleKey, i) => {
          const style = settings[styleKey] as any
          return (
            <motion.div
              key={styleKey}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="border border-white/8 rounded-xl overflow-hidden"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-cobalt-light">
                  {styleLabels[styleKey]}
                </p>
                <span className="font-mono text-[9px] text-gray-700 bg-white/4 px-2 py-1 rounded">
                  {`<${style.htmlElement || DEFAULT_ELEMENTS[styleKey]}>`}
                </span>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Font Family */}
                  <div>
                    <label className={labelCls}>Font Family</label>
                    <select
                      value={style.fontFamily || ''}
                      onChange={(e) => updateStyle(styleKey, 'fontFamily', e.target.value)}
                      className={inputCls}
                    >
                      {FONT_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value} className="bg-[#0e0e12]">{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* HTML Element */}
                  <div>
                    <label className={labelCls}>HTML Element</label>
                    <select
                      value={style.htmlElement || DEFAULT_ELEMENTS[styleKey]}
                      onChange={(e) => updateStyle(styleKey, 'htmlElement', e.target.value)}
                      className={inputCls}
                    >
                      {ELEMENT_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value} className="bg-[#0e0e12]">{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Font Weight */}
                  <div>
                    <label className={labelCls}>Weight</label>
                    <select
                      value={style.fontWeight}
                      onChange={(e) => updateStyle(styleKey, 'fontWeight', e.target.value)}
                      className={inputCls}
                    >
                      {['100', '200', '300', '400', '500', '600', '700', '800', '900'].map(w => (
                        <option key={w} value={w} className="bg-[#0e0e12]">{w}</option>
                      ))}
                    </select>
                  </div>

                  {/* Font Size Desktop */}
                  <div>
                    <label className={labelCls}>Size — Desktop</label>
                    <input
                      type="text"
                      value={style.fontSize.desktop}
                      onChange={(e) => updateStyle(styleKey, 'fontSize', e.target.value, 'desktop')}
                      placeholder="3rem"
                      className={inputCls}
                    />
                  </div>

                  {/* Font Size Mobile */}
                  <div>
                    <label className={labelCls}>Size — Mobile</label>
                    <input
                      type="text"
                      value={style.fontSize.mobile}
                      onChange={(e) => updateStyle(styleKey, 'fontSize', e.target.value, 'mobile')}
                      placeholder="2rem"
                      className={inputCls}
                    />
                  </div>

                  {/* Line Height */}
                  <div>
                    <label className={labelCls}>Line Height</label>
                    <input
                      type="text"
                      value={style.lineHeight}
                      onChange={(e) => updateStyle(styleKey, 'lineHeight', e.target.value)}
                      placeholder="1.5"
                      className={inputCls}
                    />
                  </div>

                  {/* Letter Spacing */}
                  <div>
                    <label className={labelCls}>Letter Spacing</label>
                    <input
                      type="text"
                      value={style.letterSpacing || ''}
                      onChange={(e) => updateStyle(styleKey, 'letterSpacing', e.target.value)}
                      placeholder="0em"
                      className={inputCls}
                    />
                  </div>

                  {/* Color */}
                  <div className="col-span-2">
                    <label className={labelCls}>Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={style.color}
                        onChange={(e) => updateStyle(styleKey, 'color', e.target.value)}
                        className="w-10 h-10 rounded-lg cursor-pointer border border-white/8 bg-transparent p-0.5 flex-shrink-0"
                      />
                      <input
                        type="text"
                        value={style.color}
                        onChange={(e) => updateStyle(styleKey, 'color', e.target.value)}
                        placeholder="#ffffff"
                        className={`${inputCls} flex-1`}
                      />
                    </div>
                  </div>
                </div>

                {/* Live preview */}
                <div className="mt-5 px-5 py-5 border border-white/5 rounded-xl bg-white/[0.02]">
                  <p className="font-sans text-[9px] text-gray-700 mb-3 tracking-[0.3em] uppercase">Live Preview</p>
                  <div
                    style={{
                      fontSize: style.fontSize.desktop,
                      fontWeight: style.fontWeight,
                      color: style.color,
                      lineHeight: style.lineHeight,
                      fontFamily: style.fontFamily || undefined,
                      letterSpacing: style.letterSpacing || undefined,
                    }}
                  >
                    {PREVIEW_TEXT[styleKey]}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="flex justify-end pt-6 pb-4">
        <GradientButton
          onClick={handleSave}
          disabled={saving}
          className="!min-w-0 !px-8 !py-3 !text-sm !rounded-lg !font-light"
        >
          {saving ? 'Saving…' : 'Save Settings'}
        </GradientButton>
      </div>
    </div>
  )
}
