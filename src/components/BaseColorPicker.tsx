import { useState } from 'react'

interface BaseColorPickerProps {
  value: string
  onChange: (color: string) => void
}

const harmonyPresets = [
  { name: 'Orange', hex: '#ff6406' },
  { name: 'Red', hex: '#ef4444' },
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Green', hex: '#22c55e' },
  { name: 'Purple', hex: '#a855f7' },
  { name: 'Pink', hex: '#ec4899' },
  { name: 'Yellow', hex: '#eab308' },
  { name: 'Teal', hex: '#14b8a6' },
]

export default function BaseColorPicker({ value, onChange }: BaseColorPickerProps) {
  const [hexValue, setHexValue] = useState(value)

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setHexValue(val)
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      onChange(val)
    }
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value
    onChange(color)
    setHexValue(color)
  }

  const handlePresetClick = (hex: string) => {
    onChange(hex)
    setHexValue(hex)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input
          type="color"
          value={value}
          onChange={handleColorChange}
          className="w-16 h-16"
        />
        <div className="flex-1">
          <label className="text-sm text-neutral-400 mb-1 block">HEX Value</label>
          <input
            type="text"
            value={hexValue}
            onChange={handleHexChange}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="#ff6406"
          />
        </div>
      </div>

      <div>
        <label className="text-sm text-neutral-400 mb-2 block">Harmony Presets</label>
        <div className="grid grid-cols-4 gap-2">
          {harmonyPresets.map(preset => (
            <button
              key={preset.name}
              onClick={() => handlePresetClick(preset.hex)}
              className={`h-10 rounded-lg border-2 transition-all hover:scale-105 ${
                value === preset.hex ? 'border-white scale-105' : 'border-neutral-700'
              }`}
              style={{ backgroundColor: preset.hex }}
              title={preset.name}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
