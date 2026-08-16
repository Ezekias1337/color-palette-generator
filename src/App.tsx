import { useState, useCallback, useEffect } from 'react'
import { generatePalette, generateSCSS } from './utils/paletteGenerator'
import type { HarmonyResult } from './types/palette'
import BaseColorPicker from './components/BaseColorPicker'
import ImageColorPicker from './components/ImageColorPicker'
import PaletteDisplay from './components/PaletteDisplay'
import ExportModal from './components/ExportModal'

const shadeKeys = [100, 200, 300, 400, 500, 600, 700, 800, 900] as const

export default function App() {
  const [baseColor, setBaseColor] = useState('#ff6406')
  const [harmony, setHarmony] = useState<HarmonyResult | null>(null)
  const [showExport, setShowExport] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'picker' | 'image'>('picker')
  const [slots, setSlots] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const result = generatePalette(baseColor)
    setHarmony(result)
  }, [baseColor])

  const handleRegenerate = useCallback((slotName: string) => {
    if (slots[slotName]) return
    const randomHue = Math.random() * 360
    const newColor = `hsl(${randomHue}, 80%, 55%)`
    setBaseColor(newColor)
  }, [slots])

  const handleToggleLock = useCallback((slotName: string) => {
    setSlots(prev => ({ ...prev, [slotName]: !prev[slotName] }))
  }, [])

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
    setToast(text)
    setTimeout(() => setToast(null), 2000)
  }, [])

  const handleDownload = useCallback((content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [])

  const handleExport = useCallback((type: 'css' | 'tailwind' | 'json' | 'scss') => {
    if (!harmony) return
    let content = ''
    if (type === 'css') {
      content = ':root {\n'
      for (const [category, shades] of Object.entries(harmony)) {
        if (category === 'transparentBlack') continue
        for (const [shade, color] of Object.entries(shades)) {
          content += `  --${category}-${shade}: ${color};\n`
        }
      }
      content += '}'
    } else if (type === 'tailwind') {
      content = 'module.exports = {\n  theme: {\n    extend: {\n      colors: {\n'
      for (const [category, shades] of Object.entries(harmony)) {
        if (category === 'transparentBlack') continue
        for (const [shade, color] of Object.entries(shades)) {
          content += `        '${category}-${shade}': '${color}',\n`
        }
      }
      content += '      }\n    }\n  }\n}'
    } else if (type === 'scss') {
      content = generateSCSS(harmony)
      handleDownload(content, 'palette.scss', 'text/x-scss')
    } else {
      content = JSON.stringify(harmony, null, 2)
    }
    handleCopy(content)
    setShowExport(false)
  }, [harmony, handleCopy])

  const harmonyNames = ['primary', 'success', 'warning', 'error', 'info', 'neutral'] as const

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600" />
            <h1 className="text-xl font-bold">Color Palette Generator</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowExport(true)}
              className="btn-primary"
            >
              Export
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-1">
            <div className="control-panel">
              <h2 className="text-lg font-semibold mb-4">Base Color</h2>
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setActiveTab('picker')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'picker' ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Color Picker
                </button>
                <button
                  onClick={() => setActiveTab('image')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'image' ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Image Picker
                </button>
              </div>
              {activeTab === 'picker' && (
                <BaseColorPicker value={baseColor} onChange={setBaseColor} />
              )}
              {activeTab === 'image' && (
                <ImageColorPicker onColorSelect={setBaseColor} />
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            {harmony && (
              <PaletteDisplay
                harmony={harmony}
                harmonyNames={harmonyNames}
                shadeKeys={shadeKeys}
                onRegenerate={handleRegenerate}
                onToggleLock={handleToggleLock}
                onCopy={handleCopy}
                slots={slots}
              />
            )}
          </div>
        </div>
      </main>

      {showExport && harmony && (
        <ExportModal
          harmony={harmony}
          onClose={() => setShowExport(false)}
          onExport={handleExport}
        />
      )}

      {toast && (
        <div className="toast">
          Copied: {toast}
        </div>
      )}
    </div>
  )
}
