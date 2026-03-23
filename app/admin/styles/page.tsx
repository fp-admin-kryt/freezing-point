'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { getTypographySettings, saveTypographySettings, TypographySettings } from '@/lib/firebase'
import { getTypography, clearTypographyCache } from '@/lib/typography'
import { GradientButton } from '@/components/ui/gradient-button'
import toast from 'react-hot-toast'

const inputCls = "w-full px-4 py-2.5 bg-transparent border border-white/8 rounded-lg text-white placeholder-gray-700 font-sans text-sm focus:outline-none focus:border-cobalt-blue/50 transition-colors"
const labelCls = "block font-sans text-[10px] tracking-widest uppercase text-gray-600 mb-2"

export default function TypographyPage() {
  const [settings, setSettings] = useState<TypographySettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadSettings() }, [])

  const loadSettings = async () => {
    try {
      setSettings(await getTypography())
    } catch (error) {
      console.error('Error loading typography settings:', error)
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
    } catch (error) {
      console.error('Error saving typography settings:', error)
      toast.error('Failed to save typography settings')
    } finally {
      setSaving(false)
    }
  }

  const updateStyle = (
    styleKey: keyof Omit<TypographySettings, 'id' | 'updatedAt'>,
    property: 'fontSize' | 'fontWeight' | 'color' | 'lineHeight',
    value: string,
    device?: 'desktop' | 'mobile'
  ) => {
    if (!settings) return
    setSettings({
      ...settings,
      [styleKey]: {
        ...settings[styleKey],
        ...(property === 'fontSize' && device
          ? { fontSize: { ...settings[styleKey].fontSize, [device]: value } }
          : { [property]: value }),
      },
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b border-cobalt-blue" />
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center">
        <p className="font-sans text-sm text-red-400">Failed to load settings</p>
      </div>
    )
  }

  const styleKeys: Array<keyof Omit<TypographySettings, 'id' | 'updatedAt'>> = [
    'heading1', 'heading2', 'heading3', 'body', 'caption',
  ]
  const styleLabels: Record<string, string> = {
    heading1: 'Heading 1', heading2: 'Heading 2', heading3: 'Heading 3',
    body: 'Body Text', caption: 'Caption',
  }

  return (
    <div className="min-h-screen bg-[#050508]">
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <a href="/admin"
              className="inline-flex items-center gap-2 font-sans text-[10px] tracking-[0.4em] uppercase text-gray-600 hover:text-cobalt-light transition-colors mb-6">
              <ArrowLeft className="w-3 h-3" /> Back to Dashboard
            </a>
            <p className="font-sans text-[10px] tracking-[0.5em] uppercase text-cobalt-light mb-3">
              Admin
            </p>
            <h1 className="font-sans font-light text-3xl text-white mb-2">Typography Settings</h1>
            <p className="font-body text-gray-500 text-sm">
              Configure font styles for headings, body text, and captions.
            </p>
          </motion.div>

          <div className="space-y-4">
            {styleKeys.map((styleKey, i) => {
              const style = settings[styleKey]
              return (
                <motion.div
                  key={styleKey}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border border-white/8 rounded-xl p-6"
                >
                  <p className="font-sans text-[10px] tracking-widest uppercase text-cobalt-light mb-5">
                    {styleLabels[styleKey]}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Font Size — Desktop</label>
                      <input type="text" value={style.fontSize.desktop}
                        onChange={(e) => updateStyle(styleKey, 'fontSize', e.target.value, 'desktop')}
                        placeholder="e.g. 3rem" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Font Size — Mobile</label>
                      <input type="text" value={style.fontSize.mobile}
                        onChange={(e) => updateStyle(styleKey, 'fontSize', e.target.value, 'mobile')}
                        placeholder="e.g. 2rem" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Font Weight</label>
                      <select value={style.fontWeight}
                        onChange={(e) => updateStyle(styleKey, 'fontWeight', e.target.value)}
                        className={inputCls}>
                        {['100','200','300','400','500','600','700','800','900'].map(w => (
                          <option key={w} value={w} className="bg-[#0e0e12]">{w}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Color</label>
                      <div className="flex items-center gap-2">
                        <input type="color" value={style.color}
                          onChange={(e) => updateStyle(styleKey, 'color', e.target.value)}
                          className="w-10 h-10 rounded-lg cursor-pointer border border-white/8 bg-transparent p-0.5" />
                        <input type="text" value={style.color}
                          onChange={(e) => updateStyle(styleKey, 'color', e.target.value)}
                          placeholder="#ffffff" className={`${inputCls} flex-1`} />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelCls}>Line Height</label>
                      <input type="text" value={style.lineHeight}
                        onChange={(e) => updateStyle(styleKey, 'lineHeight', e.target.value)}
                        placeholder="e.g. 1.5" className={inputCls} />
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="mt-5 px-4 py-3 border border-white/5 rounded-lg">
                    <p className="font-sans text-[10px] text-gray-700 mb-2 tracking-wider uppercase">Preview</p>
                    <div style={{
                      fontSize: style.fontSize.desktop,
                      fontWeight: style.fontWeight,
                      color: style.color,
                      lineHeight: style.lineHeight,
                    }}>
                      {styleLabels[styleKey]} — The quick brown fox
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          <div className="mt-8 flex justify-end">
            <GradientButton
              onClick={handleSave}
              disabled={saving}
              className="!min-w-0 !px-8 !py-3 !text-sm !rounded-lg !font-light"
            >
              {saving ? 'Saving…' : 'Save Settings'}
            </GradientButton>
          </div>
        </div>
      </div>
    </div>
  )
}
