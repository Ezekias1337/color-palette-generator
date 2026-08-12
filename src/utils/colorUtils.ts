import chroma from 'chroma-js';
import type { RGB, HSL, HSV } from '../types/palette';

export function hexToRgb(hex: string): RGB {
  const result = chroma(hex).rgb();
  return {
    r: Math.round(result[0]),
    g: Math.round(result[1]),
    b: Math.round(result[2]),
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  return chroma.rgb(r, g, b).hex();
}

export function hexToHsl(hex: string): HSL {
  const result = chroma(hex).hsl();
  return {
    h: result[0],
    s: result[1],
    l: result[2],
  };
}

export function hslToHex(h: number, s: number, l: number): string {
  return chroma.hsl(h, s, l).hex();
}

export function hexToHsv(hex: string): HSV {
  const result = chroma(hex).hsv();
  return {
    h: result[0],
    s: result[1],
    v: result[2],
  };
}

export function hsvToHex(h: number, s: number, v: number): string {
  return chroma.hsv(h, s, v).hex();
}

export function getLuminance(hex: string): number {
  return chroma(hex).luminance();
}

export function getContrastColor(hex: string): string {
  return getLuminance(hex) > 0.179 ? '#000000' : '#ffffff';
}

export function getRelativeContrast(hex1: string, hex2: string): number {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function isWCAGAAValid(fg: string, bg: string, size: 'normal' | 'large'): boolean {
  const contrast = getRelativeContrast(fg, bg);
  if (size === 'large') return contrast >= 3;
  return contrast >= 4.5;
}

export function isWCAGAAAValid(fg: string, bg: string, size: 'normal' | 'large'): boolean {
  const contrast = getRelativeContrast(fg, bg);
  if (size === 'large') return contrast >= 4.5;
  return contrast >= 7;
}
