import { describe, it, expect } from 'vitest'
import { generatePalette, generateSCSS } from '../src/utils/paletteGenerator'
import { hexToRgb, getContrastColor, getLuminance, getRelativeContrast } from '../src/utils/colorUtils'

describe('generatePalette', () => {
  it('should generate all 6 harmony categories', () => {
    const result = generatePalette('#ff6406')
    expect(result.primary).toBeDefined()
    expect(result.success).toBeDefined()
    expect(result.warning).toBeDefined()
    expect(result.error).toBeDefined()
    expect(result.info).toBeDefined()
    expect(result.neutral).toBeDefined()
    expect(result.transparentBlack).toBeDefined()
  })

  it('should generate 9 shades for each category', () => {
    const result = generatePalette('#ff6406')
    const shadeKeys = [100, 200, 300, 400, 500, 600, 700, 800, 900]
    
    for (const category of ['primary', 'success', 'warning', 'error', 'info', 'neutral'] as const) {
      shadeKeys.forEach(shade => {
        expect(result[category][shade]).toBeDefined()
        expect(result[category][shade]).toMatch(/^#[0-9a-f]{6}$/)
      })
    }
  })

  it('should produce valid HEX colors', () => {
    const result = generatePalette('#3b82f6')
    const allColors = [
      ...Object.values(result.primary),
      ...Object.values(result.success),
      ...Object.values(result.warning),
      ...Object.values(result.error),
      ...Object.values(result.info),
      ...Object.values(result.neutral),
    ]
    
    allColors.forEach(color => {
      expect(color).toMatch(/^#[0-9a-f]{6}$/)
      const rgb = hexToRgb(color)
      expect(rgb.r).toBeGreaterThanOrEqual(0)
      expect(rgb.r).toBeLessThanOrEqual(255)
      expect(rgb.g).toBeGreaterThanOrEqual(0)
      expect(rgb.g).toBeLessThanOrEqual(255)
      expect(rgb.b).toBeGreaterThanOrEqual(0)
      expect(rgb.b).toBeLessThanOrEqual(255)
    })
  })

  it('should generate neutral with no saturation', () => {
    const result = generatePalette('#ff6406')
    const neutralShades = Object.values(result.neutral)
    
    // Neutral colors should be grayscale (R ≈ G ≈ B)
    neutralShades.forEach(color => {
      const rgb = hexToRgb(color)
      const avg = (rgb.r + rgb.g + rgb.b) / 3
      const maxDiff = Math.max(Math.abs(rgb.r - avg), Math.abs(rgb.g - avg), Math.abs(rgb.b - avg))
      expect(maxDiff).toBeLessThanOrEqual(2)
    })
  })

  it('should produce different hues for different harmony categories', () => {
    const result = generatePalette('#ff6406')
    
    // Primary should be orange-ish, success should be green-ish
    const primaryRgb = hexToRgb(result.primary[500])
    const successRgb = hexToRgb(result.success[500])
    
    // They should be different colors
    expect(result.primary[500]).not.toBe(result.success[500])
    expect(result.primary[500]).not.toBe(result.warning[500])
    expect(result.primary[500]).not.toBe(result.error[500])
    expect(result.primary[500]).not.toBe(result.info[500])
  })

  it('should generate transparent black variants', () => {
    const result = generatePalette('#ff6406')
    
    expect(result.transparentBlack[100]).toBe('rgba(0, 0, 0, 0.100)')
    expect(result.transparentBlack[500]).toBe('rgba(0, 0, 0, 0.500)')
    expect(result.transparentBlack[900]).toBe('rgba(0, 0, 0, 0.900)')
  })

  it('should match CLI output for primary 500', () => {
    const result = generatePalette('#ff6406')
    
    // The primary 500 should match the input color
    expect(result.primary[500]).toBe('#ff6406')
  })
})

describe('generateSCSS', () => {
  it('should generate valid SCSS output', () => {
    const result = generatePalette('#ff6406')
    const scss = generateSCSS(result)
    
    expect(scss).toContain('$primary-500:')
    expect(scss).toContain('$success-500:')
    expect(scss).toContain('$warning-500:')
    expect(scss).toContain('$error-500:')
    expect(scss).toContain('$info-500:')
    expect(scss).toContain('$neutral-500:')
    expect(scss).toContain('$header-1:')
    expect(scss).toContain('$border-radius:')
  })

  it('should include font sizes and shadows', () => {
    const result = generatePalette('#ff6406')
    const scss = generateSCSS(result)
    
    expect(scss).toContain('$header-1: 53.75px')
    expect(scss).toContain('$paragraph: 18px')
    expect(scss).toContain('$primary-shadow:')
    expect(scss).toContain('$success-shadow:')
  })
})

describe('colorUtils', () => {
  describe('getContrastColor', () => {
    it('should return black for light colors', () => {
      expect(getContrastColor('#ffffff')).toBe('#000000')
      expect(getContrastColor('#f0f0f0')).toBe('#000000')
    })

    it('should return white for dark colors', () => {
      expect(getContrastColor('#000000')).toBe('#ffffff')
      expect(getContrastColor('#1a1a1a')).toBe('#ffffff')
    })
  })

  describe('getRelativeContrast', () => {
    it('should return 1 for same colors', () => {
      expect(getRelativeContrast('#ff0000', '#ff0000')).toBe(1)
    })

    it('should return higher values for more contrasting colors', () => {
      const contrast = getRelativeContrast('#000000', '#ffffff')
      expect(contrast).toBeGreaterThan(15)
    })
  })

  describe('getLuminance', () => {
    it('should return 0 for pure black', () => {
      expect(getLuminance('#000000')).toBe(0)
    })

    it('should return 1 for pure white', () => {
      expect(getLuminance('#ffffff')).toBe(1)
    })

    it('should return 0.2126 for pure red', () => {
      expect(getLuminance('#ff0000')).toBeCloseTo(0.2126, 2)
    })
  })
})
