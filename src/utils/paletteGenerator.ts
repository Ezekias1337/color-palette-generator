import chroma from 'chroma-js';
import type { ShadeValues } from '../types/palette';

interface ShadePoint {
  s: number;
  v: number;
}

function makeColor(h: number, s: number, v: number): string {
  return chroma.hsv(h, s / 100, v / 100).hex();
}

function mix(a: ShadePoint, b: ShadePoint, t: number): ShadePoint {
  return {
    s: a.s + (b.s - a.s) * t,
    v: a.v + (b.v - a.v) * t,
  };
}

function makeShades(baseColor: string): ShadeValues {
  const hsv = chroma(baseColor).hsv();
  const h = hsv[0];
  const s = Math.min(Math.max(hsv[1] * 100, 0), 100);
  const v = Math.min(Math.max(hsv[2] * 100, 0), 100);

  const shade500: ShadePoint = { s, v };
  const shade900: ShadePoint = { s: 95, v: 25 };
  const shade100: ShadePoint = { s: 8, v: 98 };

  const shade300 = mix(shade100, shade500, 0.5);
  const shade700 = mix(shade500, shade900, 0.5);
  const shade200 = mix(shade100, shade300, 0.5);
  const shade400 = mix(shade300, shade500, 0.5);
  const shade600 = mix(shade500, shade700, 0.5);
  const shade800 = mix(shade700, shade900, 0.5);

  return {
    100: makeColor(h, shade100.s, shade100.v),
    200: makeColor(h, shade200.s, shade200.v),
    300: makeColor(h, shade300.s, shade300.v),
    400: makeColor(h, shade400.s, shade400.v),
    500: makeColor(h, shade500.s, shade500.v),
    600: makeColor(h, shade600.s, shade600.v),
    700: makeColor(h, shade700.s, shade700.v),
    800: makeColor(h, shade800.s, shade800.v),
    900: makeColor(h, shade900.s, shade900.v),
  };
}

function makeNeutral(): ShadeValues {
  const h = 0;
  const shade500: ShadePoint = { s: 0, v: 38 };
  const shade900: ShadePoint = { s: 0, v: 0 };
  const shade100: ShadePoint = { s: 0, v: 99 };

  const shade300 = mix(shade100, shade500, 0.5);
  const shade700 = mix(shade500, shade900, 0.5);
  const shade200 = mix(shade100, shade300, 0.5);
  const shade400 = mix(shade300, shade500, 0.5);
  const shade600 = mix(shade500, shade700, 0.5);
  const shade800 = mix(shade700, shade900, 0.5);

  return {
    100: makeColor(h, shade100.s, shade100.v),
    200: makeColor(h, shade200.s, shade200.v),
    300: makeColor(h, shade300.s, shade300.v),
    400: makeColor(h, shade400.s, shade400.v),
    500: makeColor(h, shade500.s, shade500.v),
    600: makeColor(h, shade600.s, shade600.v),
    700: makeColor(h, shade700.s, shade700.v),
    800: makeColor(h, shade800.s, shade800.v),
    900: makeColor(h, shade900.s, shade900.v),
  };
}

function makeTransparentBlacks(): ShadeValues {
  const neutral = makeNeutral();
  const result: ShadeValues = {};
  for (const [key, _value] of Object.entries(neutral)) {
    const shadeNum = parseInt(key, 10);
    result[shadeNum] = `rgba(0, 0, 0, 0.${shadeNum})`;
  }
  return result;
}

interface HarmonyResult {
  primary: ShadeValues;
  success: ShadeValues;
  warning: ShadeValues;
  error: ShadeValues;
  info: ShadeValues;
  neutral: ShadeValues;
  transparentBlack: ShadeValues;
}

export function generatePalette(baseColor: string): HarmonyResult {
  const primary = makeShades(baseColor);
  const success = makeShades(chroma(baseColor).set('hsv.h', 150).hex());
  const warning = makeShades(chroma(baseColor).set('hsv.h', 45).hex());
  const error = makeShades(chroma(baseColor).set('hsv.h', 0).hex());
  const info = makeShades(chroma(baseColor).set('hsv.h', 210).hex());
  const neutral = makeNeutral();
  const transparentBlack = makeTransparentBlacks();

  return {
    primary,
    success,
    warning,
    error,
    info,
    neutral,
    transparentBlack,
  };
}

export function generateSCSS(palettes: HarmonyResult): string {
  const shadeKeys = [100, 200, 300, 400, 500, 600, 700, 800, 900];

  function toSassVars(name: string, obj: ShadeValues): string {
    return shadeKeys
      .map((k) => {
        const value = obj[k];
        return value ? `$${name}-${k}: ${value};` : '';
      })
      .filter(Boolean)
      .join('\n');
  }

  return `
/* Primary */
${toSassVars('primary', palettes.primary)}

/* Success */
${toSassVars('success', palettes.success)}

/* Warning */
${toSassVars('warning', palettes.warning)}

/* Error */
${toSassVars('error', palettes.error)}

/* Info */
${toSassVars('info', palettes.info)}

/* Neutral */
${toSassVars('neutral', palettes.neutral)}

/* Transparent black variants */
${toSassVars('transparent-black', palettes.transparentBlack)}

/* Font sizes */
$header-1: 53.75px;
$header-2: 44.79px;
$header-3: 37.32px;
$header-4: 31.1px;
$header-5: 25.92px;
$header-6: 21.6px;
$paragraph: 18px;
$small: 15px;
$extra-small: 12.5px;

$border-radius: 40px;
$surface-border-radius: 20px;

/* Shadows & glows */
$primary-shadow: 0px 0px 5px rgba($primary-500, 1);
$success-shadow: 0px 0px 5px rgba($success-500, 1);
$warning-shadow: 0px 0px 5px rgba($warning-500, 1);
$error-glow: 0px 0px 5px rgba($error-500, 1);
$info-glow: 0px 0px 5px rgba($info-500, 1);
$neutral-shadow: 0px 0px 5px rgba($neutral-100, 1);
$neutral-dark-shadow: 0px 0px 5px rgba($neutral-800, 1);
`.trim();
}
