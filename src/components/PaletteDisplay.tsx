import { useEffect, useRef } from 'react'
import { getContrastColor } from '../utils/colorUtils'
import type { HarmonyResult } from '../types/palette'

interface PaletteDisplayProps {
  harmony: HarmonyResult
  harmonyNames: readonly string[]
  shadeKeys: readonly number[]
  onRegenerate: (slotName: string) => void
  onToggleLock: (slotName: string) => void
  onCopy: (text: string) => void
  slots: Record<string, boolean>
}

export default function PaletteDisplay({
  harmony,
  harmonyNames,
  shadeKeys,
  onRegenerate,
  onToggleLock,
  onCopy,
  slots,
}: PaletteDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault()
        for (const name of harmonyNames) {
          const slotName = `${name}-500`
          if (!slots[slotName]) {
            onRegenerate(slotName)
          }
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [harmonyNames, slots, onRegenerate])

  const getSlotName = (harmonyName: string, shade: number) => `${harmonyName}-${shade}`

  return (
    <div ref={containerRef} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Generated Palette</h2>
        <span className="text-sm text-neutral-400">Press Space to regenerate unlocked</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {harmonyNames.map(harmonyName => (
          <div key={harmonyName} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium capitalize text-neutral-300">{harmonyName}</h3>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg border border-neutral-700"
                  style={{ backgroundColor: harmony[harmonyName as keyof HarmonyResult]?.[500] }}
                />
                <span className="text-xs font-mono text-neutral-400">
                  {harmony[harmonyName as keyof HarmonyResult]?.[500]}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              {shadeKeys.map(shade => {
                const color = harmony[harmonyName as keyof HarmonyResult]?.[shade]
                if (!color) return null
                const slotName = getSlotName(harmonyName, shade)
                const isLocked = slots[slotName]
                const textColor = getContrastColor(color)

                return (
                  <div
                    key={slotName}
                    className={`swatch ${isLocked ? 'swatch-locked' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      if (isLocked) {
                        onToggleLock(slotName)
                      } else {
                        onCopy(color)
                      }
                    }}
                    onDoubleClick={() => onToggleLock(slotName)}
                  >
                    <span
                      className="font-mono text-sm font-medium"
                      style={{ color: textColor }}
                    >
                      {shade}: {color}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
