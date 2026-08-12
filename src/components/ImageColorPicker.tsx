import { useRef, useState, useCallback } from 'react'

interface ImageColorPickerProps {
  onColorSelect: (color: string) => void
}

export default function ImageColorPicker({ onColorSelect }: ImageColorPickerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [hoverColor, setHoverColor] = useState<string | null>(null)

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        ctx.drawImage(img, 0, 0)
        setImageLoaded(true)
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }, [])

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = Math.floor((e.clientX - rect.left) * (canvas.width / rect.width))
    const y = Math.floor((e.clientY - rect.top) * (canvas.height / rect.height))

    const pixel = ctx.getImageData(x, y, 1, 1).data
    const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1)}`
    setHoverColor(hex)
  }, [])

  const handleCanvasClick = useCallback((_e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!hoverColor) return
    onColorSelect(hoverColor)
  }, [hoverColor, onColorSelect])

  const handleFileInputClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={handleFileInputClick}
        className="btn-secondary w-full"
      >
        Upload Image
      </button>

      <div className={`relative ${imageLoaded ? '' : 'hidden'}`}>
        <canvas
          ref={canvasRef}
          onMouseMove={handleCanvasMouseMove}
          onClick={handleCanvasClick}
          className="w-full rounded-lg border border-neutral-700 cursor-crosshair"
        />
        {imageLoaded && hoverColor && (
          <div className="absolute top-2 right-2 flex items-center gap-2 bg-neutral-900/90 px-3 py-2 rounded-lg border border-neutral-700">
            <div
              className="w-6 h-6 rounded border border-neutral-600"
              style={{ backgroundColor: hoverColor }}
            />
            <span className="text-xs font-mono">{hoverColor}</span>
          </div>
        )}
        {imageLoaded && (
          <div className="absolute bottom-2 left-2 text-xs text-neutral-400 bg-neutral-900/90 px-2 py-1 rounded">
            Click to select color
          </div>
        )}
      </div>
    </div>
  )
}
