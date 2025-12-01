'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import TextAlign from '@tiptap/extension-text-align'
import FontFamily from '@tiptap/extension-font-family'
import Heading from '@tiptap/extension-heading'
import Image from '@tiptap/extension-image'
import { Bold, Italic, Underline, Strikethrough, Heading1, Heading2, Heading3, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Image as ImageIcon, Palette, Type } from 'lucide-react'
import { useState } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  className?: string
}

export default function RichTextEditor({ value, onChange, placeholder, className = '' }: RichTextEditorProps) {
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showFontPicker, setShowFontPicker] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false, // We'll use custom heading
      }),
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      FontFamily,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[300px] p-4',
      },
    },
  })

  if (!editor) {
    return null
  }

  const colors = [
    '#ffffff', '#e5e7eb', '#9ca3af', '#6b7280',
    '#136fd7', '#4da6ff', '#ff6b6b', '#51cf66',
    '#ffd43b', '#ae3ec9', '#fd7e14', '#20c997',
  ]

  const fonts = [
    'Montserrat',
    'Montserrat Alternates',
    'Arial',
    'Times New Roman',
    'Courier New',
    'Georgia',
    'Verdana',
  ]

  return (
    <div className={`border border-gray-600 rounded-lg bg-space-gray ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-3 border-b border-gray-700 bg-gray-800 rounded-t-lg">
        {/* Text Formatting */}
        <div className="flex items-center gap-1 border-r border-gray-700 pr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-700 transition-colors ${
              editor.isActive('bold') ? 'bg-cobalt-blue text-white' : 'text-gray-300'
            }`}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-700 transition-colors ${
              editor.isActive('italic') ? 'bg-cobalt-blue text-white' : 'text-gray-300'
            }`}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-2 rounded hover:bg-gray-700 transition-colors ${
              editor.isActive('strike') ? 'bg-cobalt-blue text-white' : 'text-gray-300'
            }`}
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-1 border-r border-gray-700 pr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-2 rounded hover:bg-gray-700 transition-colors ${
              editor.isActive('heading', { level: 1 }) ? 'bg-cobalt-blue text-white' : 'text-gray-300'
            }`}
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded hover:bg-gray-700 transition-colors ${
              editor.isActive('heading', { level: 2 }) ? 'bg-cobalt-blue text-white' : 'text-gray-300'
            }`}
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-2 rounded hover:bg-gray-700 transition-colors ${
              editor.isActive('heading', { level: 3 }) ? 'bg-cobalt-blue text-white' : 'text-gray-300'
            }`}
            title="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </button>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 border-r border-gray-700 pr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-700 transition-colors ${
              editor.isActive('bulletList') ? 'bg-cobalt-blue text-white' : 'text-gray-300'
            }`}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-700 transition-colors ${
              editor.isActive('orderedList') ? 'bg-cobalt-blue text-white' : 'text-gray-300'
            }`}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-1 border-r border-gray-700 pr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-2 rounded hover:bg-gray-700 transition-colors ${
              editor.isActive({ textAlign: 'left' }) ? 'bg-cobalt-blue text-white' : 'text-gray-300'
            }`}
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-2 rounded hover:bg-gray-700 transition-colors ${
              editor.isActive({ textAlign: 'center' }) ? 'bg-cobalt-blue text-white' : 'text-gray-300'
            }`}
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`p-2 rounded hover:bg-gray-700 transition-colors ${
              editor.isActive({ textAlign: 'right' }) ? 'bg-cobalt-blue text-white' : 'text-gray-300'
            }`}
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </button>
        </div>

        {/* Color Picker */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowColorPicker(!showColorPicker)}
            className={`p-2 rounded hover:bg-gray-700 transition-colors ${
              editor.isActive('textStyle') ? 'bg-cobalt-blue text-white' : 'text-gray-300'
            }`}
            title="Text Color"
          >
            <Palette className="w-4 h-4" />
          </button>
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg p-3 z-50 shadow-xl">
              <div className="grid grid-cols-6 gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      editor.chain().focus().setColor(color).run()
                      setShowColorPicker(false)
                    }}
                    className="w-8 h-8 rounded border-2 border-gray-600 hover:border-cobalt-blue transition-colors"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
              <input
                type="color"
                onChange={(e) => {
                  editor.chain().focus().setColor(e.target.value).run()
                  setShowColorPicker(false)
                }}
                className="mt-2 w-full h-8 rounded cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Font Family */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowFontPicker(!showFontPicker)}
            className="p-2 rounded hover:bg-gray-700 transition-colors text-gray-300"
            title="Font Family"
          >
            <Type className="w-4 h-4" />
          </button>
          {showFontPicker && (
            <div className="absolute top-full left-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg p-2 z-50 shadow-xl min-w-[200px]">
              {fonts.map((font) => (
                <button
                  key={font}
                  type="button"
                  onClick={() => {
                    editor.chain().focus().setFontFamily(font).run()
                    setShowFontPicker(false)
                  }}
                  className="w-full text-left px-3 py-2 rounded hover:bg-gray-700 text-gray-300 text-sm"
                  style={{ fontFamily: font }}
                >
                  {font}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Image */}
        <div className="flex items-center gap-1">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                const reader = new FileReader()
                reader.onload = (event) => {
                  const src = event.target?.result as string
                  editor.chain().focus().setImage({ src }).run()
                }
                reader.readAsDataURL(file)
              }
            }}
            className="hidden"
            id="editor-image-upload"
          />
          <label
            htmlFor="editor-image-upload"
            className="p-2 rounded hover:bg-gray-700 transition-colors text-gray-300 cursor-pointer"
            title="Insert Image"
          >
            <ImageIcon className="w-4 h-4" />
          </label>
        </div>
      </div>

      {/* Editor Content */}
      <div className="bg-space-gray rounded-b-lg">
        <EditorContent editor={editor} />
      </div>

      {placeholder && !editor.getText() && (
        <div className="absolute top-16 left-4 text-gray-500 pointer-events-none">
          {placeholder}
        </div>
      )}
    </div>
  )
}

