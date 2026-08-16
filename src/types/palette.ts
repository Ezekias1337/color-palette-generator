export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface HSV {
  h: number;
  s: number;
  v: number;
}

export type ShadeKey = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

export interface ShadeValues {
  [key: number]: string;
}

export interface Palette {
  primary: ShadeValues;
  success: ShadeValues;
  warning: ShadeValues;
  error: ShadeValues;
  info: ShadeValues;
  neutral: ShadeValues;
}

export interface HarmonyResult {
  primary: ShadeValues;
  success: ShadeValues;
  warning: ShadeValues;
  error: ShadeValues;
  info: ShadeValues;
  neutral: ShadeValues;
  transparentBlack: ShadeValues;
}

export interface PaletteSlot {
  color: string;
  locked: boolean;
}

export interface PaletteState {
  baseColor: string;
  slots: PaletteSlot[];
}

export interface ExportData {
  type: 'css' | 'tailwind' | 'json' | 'scss';
  content: string;
}
