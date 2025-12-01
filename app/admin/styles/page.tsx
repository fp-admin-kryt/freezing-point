'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getTypographySettings, saveTypographySettings, TypographySettings } from '@/lib/firebase'
import { getTypography, clearTypographyCache } from '@/lib/typography'
import toast from 'react-hot-toast'
import Navigation from '@/components/Navigation'

export default function TypographyPage() {
  const [settings, setSettings] = useState<TypographySettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const typography = await getTypography()
      setSettings(typography)
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
      toast.success('Typography settings saved successfully!')
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
          ? {
              fontSize: {
                ...settings[styleKey].fontSize,
                [device]: value,
              },
            }
          : {
              [property]: value,
            }),
      },
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-space-black flex items-center justify-center">
        <div className="text-cobalt-light">Loading...</div>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="min-h-screen bg-space-black flex items-center justify-center">
        <div className="text-red-400">Failed to load settings</div>
      </div>
    )
  }

  const styleKeys: Array<keyof Omit<TypographySettings, 'id' | 'updatedAt'>> = [
    'heading1',
    'heading2',
    'heading3',
    'body',
    'caption',
  ]

  const styleLabels: Record<string, string> = {
    heading1: 'Heading 1',
    heading2: 'Heading 2',
    heading3: 'Heading 3',
    body: 'Body Text',
    caption: 'Caption',
  }

  return (
    <div className="min-h-screen bg-space-black">
      <Navigation />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-white mb-2 font-montserrat">Typography Settings</h1>
            <p className="text-gray-400 font-montserrat">
              Configure font styles for headings, body text, and captions. Changes apply to all rich text editors and public pages.
            </p>
          </motion.div>

          <div className="space-y-6">
            {styleKeys.map((styleKey) => {
              const style = settings[styleKey]
              return (
                <motion.div
                  key={styleKey}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-morphism rounded-2xl p-6"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 font-montserrat">
                    {styleLabels[styleKey]}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Font Size - Desktop */}
                    <div>
                      <label className="block text-sm font-medium text-white mb-2 font-montserrat">
                        Font Size (Desktop)
                      </label>
                      <input
                        type="text"
                        value={style.fontSize.desktop}
                        onChange={(e) => updateStyle(styleKey, 'fontSize', e.target.value, 'desktop')}
                        placeholder="e.g., 3rem"
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cobalt-blue"
                      />
                    </div>

                    {/* Font Size - Mobile */}
                    <div>
                      <label className="block text-sm font-medium text-white mb-2 font-montserrat">
                        Font Size (Mobile)
                      </label>
                      <input
                        type="text"
                        value={style.fontSize.mobile}
                        onChange={(e) => updateStyle(styleKey, 'fontSize', e.target.value, 'mobile')}
                        placeholder="e.g., 2rem"
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cobalt-blue"
                      />
                    </div>

                    {/* Font Weight */}
                    <div>
                      <label className="block text-sm font-medium text-white mb-2 font-montserrat">
                        Font Weight
                      </label>
                      <select
                        value={style.fontWeight}
                        onChange={(e) => updateStyle(styleKey, 'fontWeight', e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cobalt-blue"
                      >
                        <option value="100">100 - Thin</option>
                        <option value="200">200 - Extra Light</option>
                        <option value="300">300 - Light</option>
                        <option value="400">400 - Normal</option>
                        <option value="500">500 - Medium</option>
                        <option value="600">600 - Semi Bold</option>
                        <option value="700">700 - Bold</option>
                        <option value="800">800 - Extra Bold</option>
                        <option value="900">900 - Black</option>
                      </select>
                    </div>

                    {/* Color */}
                    <div>
                      <label className="block text-sm font-medium text-white mb-2 font-montserrat">
                        Color
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={style.color}
                          onChange={(e) => updateStyle(styleKey, 'color', e.target.value)}
                          className="w-16 h-10 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={style.color}
                          onChange={(e) => updateStyle(styleKey, 'color', e.target.value)}
                          placeholder="#ffffff"
                          className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cobalt-blue"
                        />
                      </div>
                    </div>

                    {/* Line Height */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-white mb-2 font-montserrat">
                        Line Height
                      </label>
                      <input
                        type="text"
                        value={style.lineHeight}
                        onChange={(e) => updateStyle(styleKey, 'lineHeight', e.target.value)}
                        placeholder="e.g., 1.5"
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cobalt-blue"
                      />
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="mt-4 p-4 bg-gray-900 rounded-lg">
                    <p className="text-sm text-gray-400 mb-2 font-montserrat">Preview:</p>
                    <div
                      style={{
                        fontSize: style.fontSize.desktop,
                        fontWeight: style.fontWeight,
                        color: style.color,
                        lineHeight: style.lineHeight,
                      }}
                      className="font-montserrat"
                    >
                      {styleLabels[styleKey]} Preview Text
                    </div>
                    <div
                      className="md:hidden mt-2 font-montserrat"
                      style={{
                        fontSize: style.fontSize.mobile,
                        fontWeight: style.fontWeight,
                        color: style.color,
                        lineHeight: style.lineHeight,
                      }}
                    >
                      Mobile: {styleLabels[styleKey]} Preview Text
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex justify-end"
          >
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-3 bg-cobalt-blue text-white rounded-lg hover:bg-cobalt-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-montserrat"
            >
              {saving ? 'Saving...' : 'Save Typography Settings'}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

