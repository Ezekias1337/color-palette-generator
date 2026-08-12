import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import ImageColorPicker from '../ImageColorPicker'

const MINIMAL_PNG_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='

function createImageFile(): File {
  const byteCharacters = atob(MINIMAL_PNG_BASE64)
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)
  const blob = new Blob([byteArray], { type: 'image/png' })
  return new File([blob], 'test.png', { type: 'image/png' })
}

describe('ImageColorPicker', () => {
  const mockOnColorSelect = vi.fn()
  let originalImage: typeof Image
  let originalFileReader: typeof FileReader
  let originalGetContext: typeof HTMLCanvasElement.prototype.getContext

  beforeEach(() => {
    vi.clearAllMocks()
    mockOnColorSelect.mockClear()
    originalImage = globalThis.Image
    originalFileReader = globalThis.FileReader

    // Mock Image to simulate image loading with known dimensions
    const MockImageClass = vi.fn(() => {
      let _src = ''
      const img: {
        width: number
        height: number
        onload: ((e: Event) => void) | null
        onerror: ((e: Event) => void) | null
        _src: string
      } = {
        width: 1,
        height: 1,
        onload: null,
        onerror: null,
        _src: '',
      }
      Object.defineProperty(img, 'src', {
        get: () => _src,
        set: (value: string) => {
          _src = value
          // Simulate synchronous onload when src is set (cached image behavior)
          if (img.onload) {
            img.onload(new Event('load'))
          }
        },
        configurable: true,
      })
      return img
    })
    MockImageClass.prototype = Object.create(originalImage.prototype)

    globalThis.Image = MockImageClass as unknown as typeof Image

    // Mock FileReader to return base64 data synchronously via async callback
    const MockFileReaderClass = vi.fn(() => {
      const reader = {
        onload: null as ((e: Event) => void) | null,
        onerror: null as ((e: Event) => void) | null,
        readAsDataURL: vi.fn(),
      }
      reader.readAsDataURL = vi.fn((_file: File) => {
        // Simulate async file reading by using setTimeout
        setTimeout(() => {
          const result = `data:image/png;base64,${MINIMAL_PNG_BASE64}`
          if (reader.onload) {
            reader.onload({
              target: { result },
            } as unknown as Event)
          }
        }, 0)
      })
      return reader
    })
    MockFileReaderClass.prototype = Object.create(originalFileReader.prototype)

    globalThis.FileReader = MockFileReaderClass as unknown as typeof FileReader

    // Mock canvas getContext since jsdom doesn't implement it
    originalGetContext = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      drawImage: vi.fn(),
      getImageData: vi.fn(() => ({ data: new Uint8ClampedArray([255, 0, 0, 255]) })),
      fillRect: vi.fn(),
      clearRect: vi.fn(),
      fillText: vi.fn(),
      measureText: vi.fn(() => ({ width: 0 })),
      createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
    })) as unknown as typeof originalGetContext
  })

  afterEach(() => {
    globalThis.Image = originalImage
    globalThis.FileReader = originalFileReader
    HTMLCanvasElement.prototype.getContext = originalGetContext
    vi.restoreAllMocks()
  })

  describe('file selection and image loading', () => {
    it('should render the upload button', () => {
      render(<ImageColorPicker onColorSelect={mockOnColorSelect} />)
      expect(screen.getByRole('button', { name: /upload image/i })).toBeInTheDocument()
    })

    it('should not show canvas before image is loaded', () => {
      render(<ImageColorPicker onColorSelect={mockOnColorSelect} />)
      const hiddenContainer = document.querySelector('.relative')
      expect(hiddenContainer).toHaveClass('hidden')
    })

    it('should show canvas and update imageLoaded state after file selection', async () => {
      const file = createImageFile()
      const { container } = render(<ImageColorPicker onColorSelect={mockOnColorSelect} />)

      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement
      fireEvent.change(fileInput, { target: { files: [file] } })

      await vi.waitFor(() => {
        const containerEl = document.querySelector('.relative')
        expect(containerEl).not.toHaveClass('hidden')
      }, { timeout: 3000 })
    })

    it('should render a canvas element after image loads', async () => {
      const file = createImageFile()
      const { container } = render(<ImageColorPicker onColorSelect={mockOnColorSelect} />)

      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement
      fireEvent.change(fileInput, { target: { files: [file] } })

      await vi.waitFor(() => {
        const canvas = document.querySelector('canvas')
        expect(canvas).toBeInTheDocument()
      }, { timeout: 3000 })
    })

    it('should set canvas dimensions matching the loaded image', async () => {
      const file = createImageFile()
      const { container } = render(<ImageColorPicker onColorSelect={mockOnColorSelect} />)

      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement
      fireEvent.change(fileInput, { target: { files: [file] } })

      await vi.waitFor(() => {
        const canvas = document.querySelector('canvas')
        expect(canvas).toHaveAttribute('width', '1')
        expect(canvas).toHaveAttribute('height', '1')
      }, { timeout: 3000 })
    })

    it('should handle no file gracefully', () => {
      const { container } = render(<ImageColorPicker onColorSelect={mockOnColorSelect} />)
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement

      expect(() => {
        fireEvent.change(fileInput, { target: { files: null } })
      }).not.toThrow()
    })

    it('should handle empty file list gracefully', () => {
      const { container } = render(<ImageColorPicker onColorSelect={mockOnColorSelect} />)
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement

      expect(() => {
        fireEvent.change(fileInput, { target: { files: [] } })
      }).not.toThrow()
    })
  })
})
