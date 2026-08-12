import type { HarmonyResult } from '../types/palette'

interface ExportModalProps {
  harmony: HarmonyResult
  onClose: () => void
  onExport: (type: 'css' | 'tailwind' | 'json') => void
}

export default function ExportModal({ harmony, onClose, onExport }: ExportModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 rounded-2xl border border-neutral-800 max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
          <h2 className="text-xl font-bold">Export Palette</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => onExport('css')}
              className="btn-secondary flex flex-col items-center gap-2 py-4"
            >
              <span className="text-2xl">{'</>'}</span>
              <span className="text-sm font-medium">CSS Variables</span>
            </button>
            <button
              onClick={() => onExport('tailwind')}
              className="btn-secondary flex flex-col items-center gap-2 py-4"
            >
              <span className="text-2xl">TW</span>
              <span className="text-sm font-medium">Tailwind Config</span>
            </button>
            <button
              onClick={() => onExport('json')}
              className="btn-secondary flex flex-col items-center gap-2 py-4"
            >
              <span className="text-2xl">JSON</span>
              <span className="text-sm font-medium">JSON</span>
            </button>
          </div>

          <div className="bg-neutral-950 rounded-lg p-4 border border-neutral-800">
            <h3 className="text-sm font-medium text-neutral-400 mb-3">Preview</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(harmony).map(([name, shades]) => {
                if (name === 'transparentBlack') return null
                return (
                  <div key={name} className="space-y-1">
                    <span className="text-xs text-neutral-500 capitalize">{name}</span>
                    <div className="flex gap-1">
                      {Object.entries(shades).map(([shade, color]) => {
                        const colorStr = color as string
                        return (
                          <div
                            key={shade}
                            className="w-8 h-8 rounded border border-neutral-700"
                            style={{ backgroundColor: colorStr }}
                            title={`${shade}: ${colorStr}`}
                          />
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
