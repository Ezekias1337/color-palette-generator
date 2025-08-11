const chroma = require("chroma-js");
const fs = require("fs");

const primary500 = process.argv[2] || "#ff6406";

// Generate shade by HSV curve
function makeColor(h, s, v) {
  return chroma.hsv(h, s / 100, v / 100).hex();
}

function mix(a, b, t) {
  return {
    s: a.s + (b.s - a.s) * t,
    v: a.v + (b.v - a.v) * t,
  };
}

function makeShades(baseColor) {
  const [h, s, v] = chroma(baseColor).hsv();
  const sat = Math.min(Math.max(s * 100, 0), 100);
  const bri = Math.min(Math.max(v * 100, 0), 100);

  const shade500 = { s: sat, v: bri };
  const shade900 = { s: 95, v: 25 };
  const shade100 = { s: 8, v: 98 };

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

function makeNeutral() {
  const h = 0;
  const shade500 = { s: 0, v: 38 };
  const shade900 = { s: 0, v: 0 };
  const shade100 = { s: 0, v: 99 };

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

// Create palettes
const primary = makeShades(primary500);
const success = makeShades(chroma(primary500).set("hsv.h", 150));
const warning = makeShades(chroma(primary500).set("hsv.h", 45));
const error   = makeShades(chroma(primary500).set("hsv.h", 0));
const info    = makeShades(chroma(primary500).set("hsv.h", 210));
const neutral = makeNeutral();

// Transparent blacks
function transparentBlacks() {
  return Object.fromEntries(
    Object.keys(neutral).map(key => [
      key,
      `rgba($neutral-900, 0.${key[0]})`
    ])
  );
}
const transparentBlack = transparentBlacks();

// Helper to output SCSS variables
function toSassVars(name, obj) {
  return Object.entries(obj)
    .map(([k, v]) => `$${name}-${k}: ${v};`)
    .join("\n");
}

const scssContent = `
/* Primary */
${toSassVars("primary", primary)}

/* Success */
${toSassVars("success", success)}

/* Warning */
${toSassVars("warning", warning)}

/* Error */
${toSassVars("error", error)}

/* Info */
${toSassVars("info", info)}

/* Neutral */
${toSassVars("neutral", neutral)}

/* Transparent black variants */
${toSassVars("transparent-black", transparentBlack)}

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
`;

fs.writeFileSync("_variables.scss", scssContent.trim());
console.log(`✅ Generated _variables.scss with primary ${primary500}`);
