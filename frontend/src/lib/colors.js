// oklch()/oklab()/color()/color-mix() → rgb() conversion + a DOM pre-pass so
// html2canvas can render Tailwind v4 colors (which are oklch/oklab-based)
// without throwing, while KEEPING the template's real colors (the old approach
// forced everything to black).
//
// Why oklab/color-mix matter: Tailwind v4 compiles opacity modifiers such as
// `border-[#1e7280]/50` into `color-mix(in oklab, …)`. Chrome resolves those
// computed values to `oklab(…)`, which html2canvas cannot parse — it threw
// "Attempting to parse an unsupported color function" and the PDF download
// failed entirely for the templates that used them.

function srgbGamma(c) {
  if (c <= 0.0031308) return 12.92 * c;
  return 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

// OKLab (L 0-1, a, b) → linear-light rgb triplet (0-1)
function oklabToLinearRgb(L, a, b) {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l3 = l_ * l_ * l_;
  const m3 = m_ * m_ * m_;
  const s3 = s_ * s_ * s_;

  let r = 4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  let g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  let bb = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3;

  return [
    Math.min(1, Math.max(0, r)),
    Math.min(1, Math.max(0, g)),
    Math.min(1, Math.max(0, bb)),
  ];
}

// OKLCH (L 0-1, C chroma, H hue-deg) → "r, g, b" (0-255)
export function oklchToRgbString(l, c, h) {
  const hr = (h * Math.PI) / 180;
  const rgb = oklabToLinearRgb(l, c * Math.cos(hr), c * Math.sin(hr));
  return rgb.map((v) => Math.round(srgbGamma(v) * 255)).join(", ");
}

function parseNum(tok) {
  tok = String(tok || "").trim();
  if (tok.endsWith("%")) return parseFloat(tok) / 100;
  if (tok === "none" || tok === "") return 0;
  const v = parseFloat(tok);
  return Number.isNaN(v) ? null : v;
}

// Parse a single already-flat color into { r, g, b, a } (0-255, 0-1).
// Handles rgb()/rgba(), hex, #rgb, named "transparent", and nested modern
// functions via recursion.
function parseFlatColor(str) {
  const s = String(str || "").trim();
  if (!s) return null;
  if (s === "transparent") return { r: 0, g: 0, b: 0, a: 0 };
  if (s === "currentcolor") return { r: 0, g: 0, b: 0, a: 1 };
  if (s.startsWith("#")) {
    let h = s.slice(1);
    if (h.length === 3 || h.length === 4) h = h.split("").map((c) => c + c).join("");
    const n = parseInt(h.slice(0, 6), 16);
    const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
    if (Number.isNaN(n)) return null;
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a };
  }
  const m = s.match(/^(rgba?|hsla?|oklch|oklab|color)\(([^]*)\)$/i);
  if (!m) return null;
  const fn = m[1].toLowerCase();
  const parts = m[2].split("/").map((p) => p.trim());
  const alpha = parts[1] ? parseNum(parts[1]) : 1;
  const nums = parts[0].split(/[\s,]+/).map(parseNum);
  if (alpha === null || nums.some((n) => n === null)) return null;
  let r, g, b;
  if (fn === "rgb" || fn === "rgba") {
    r = nums[0]; g = nums[1]; b = nums[2];
    if (parts[0].includes("%")) { r *= 2.55; g *= 2.55; b *= 2.55; }
    r = Math.round(r); g = Math.round(g); b = Math.round(b);
  } else if (fn === "hsl" || fn === "hsla") {
    const h = ((nums[0] % 360) + 360) % 360, sat = nums[1], li = nums[2];
    const c = (1 - Math.abs(2 * li - 1)) * sat;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const mm = li - c / 2;
    const seg = [[c, x, 0], [x, c, 0], [0, c, x], [0, x, c], [x, 0, c], [c, 0, x]][Math.floor(h / 60)] || [0, 0, 0];
    r = Math.round((seg[0] + mm) * 255); g = Math.round((seg[1] + mm) * 255); b = Math.round((seg[2] + mm) * 255);
  } else if (fn === "oklch") {
    const rgb = oklabToLinearRgb(nums[0], nums[1] * Math.cos((nums[2] * Math.PI) / 180), nums[1] * Math.sin((nums[2] * Math.PI) / 180));
    r = Math.round(srgbGamma(rgb[0]) * 255); g = Math.round(srgbGamma(rgb[1]) * 255); b = Math.round(srgbGamma(rgb[2]) * 255);
  } else if (fn === "oklab") {
    const rgb = oklabToLinearRgb(nums[0], nums[1], nums[2]);
    r = Math.round(srgbGamma(rgb[0]) * 255); g = Math.round(srgbGamma(rgb[1]) * 255); b = Math.round(srgbGamma(rgb[2]) * 255);
  } else {
    // color(srgb r g b) — only srgb supported; other gammas approximated as srgb
    r = Math.round(srgbGamma(Math.min(1, Math.max(0, nums[0]))) * 255);
    g = Math.round(srgbGamma(Math.min(1, Math.max(0, nums[1]))) * 255);
    b = Math.round(srgbGamma(Math.min(1, Math.max(0, nums[2]))) * 255);
  }
  return { r, g, b, a: alpha };
}

function rgbaStr({ r, g, b, a }) {
  return a < 1 ? `rgba(${r}, ${g}, ${b}, ${Number(a.toFixed(4))})` : `rgb(${r}, ${g}, ${b})`;
}

// Split top-level commas (not inside parens) — for color-mix argument lists.
function splitTopLevel(str) {
  const out = [];
  let depth = 0, cur = "";
  for (const ch of str) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === "," && depth === 0) { out.push(cur); cur = ""; } else cur += ch;
  }
  if (cur.trim()) out.push(cur);
  return out.map((s) => s.trim());
}

const MODERN_FN = /(oklch|oklab|color-mix|color)\(/i;

// Convert any modern CSS color function html2canvas can't parse into rgb()/rgba().
export function convertModernColorCall(colorValue) {
  if (!colorValue || typeof colorValue !== "string" || !MODERN_FN.test(colorValue)) return colorValue;

  let current = colorValue;
  // Multi-pass replacement so nested calls (like color-mix with oklch) and multiple
  // colors within a single property (e.g. linear-gradient or box-shadow) resolve properly
  for (let pass = 0; pass < 5 && MODERN_FN.test(current); pass++) {
    const prev = current;
    // Pass 1: Resolve leaf modern color functions: oklch(...), oklab(...), color(...)
    // [^()]+ guarantees we only match single non-nested function calls
    current = current.replace(/(oklch|oklab|color)\(([^()]+)\)/gi, (match) => {
      try {
        const parsed = parseFlatColor(match);
        return parsed ? rgbaStr(parsed) : match;
      } catch {
        return match;
      }
    });

    // Pass 2: Resolve color-mix(...) calls whose inner colors are now converted to standard colors
    current = current.replace(/color-mix\(([^()]+|\([^()]*\))*\)/gi, (match) => {
      try {
        const open = match.indexOf("(");
        const inner = match.slice(open + 1, match.lastIndexOf(")"));
        const args = splitTopLevel(inner).filter((a) => !/^in\s+/i.test(a));
        if (args.length < 2) return match;
        const items = args.map((arg) => {
          const m = arg.match(/^(.*?)(?:\s+([\d.]+%))?$/);
          const color = (m[1] || "").trim();
          const pct = m[2] ? parseFloat(m[2]) / 100 : null;
          const parsed = parseFlatColor(color);
          return parsed ? { color: parsed, pct } : null;
        });
        if (items.some((i) => !i)) return match;
        const p1 = items[0].pct ?? (items[1].pct != null ? 1 - items[1].pct : 0.5);
        const p2 = items[1].pct ?? 1 - p1;
        const tot = p1 + p2 || 1;
        const w1 = p1 / tot, w2 = p2 / tot;
        const A = items[0].color, B = items[1].color;
        return rgbaStr({
          r: Math.round(A.r * w1 + B.r * w2),
          g: Math.round(A.g * w1 + B.g * w2),
          b: Math.round(A.b * w1 + B.b * w2),
          a: A.a * w1 + B.a * w2,
        });
      } catch {
        return match;
      }
    });

    if (current === prev) break;
  }
  return current;
}

// Back-compat alias (older callers passed oklch-only strings)
export function convertOklchCall(colorValue) {
  return convertModernColorCall(colorValue);
}

// Convert every `--color-*: oklch(...)`-style custom property defined in the
// document's stylesheets to rgb, and inject an override style into the LIVE
// document head. Returns the injected <style> element (remove it after use)
// so html2canvas — which clones the live DOM — never resolves modern colors.
export function convertOklchVarsInDocument(doc) {
  const overrides = [];
  const walkRules = (rules) => {
    for (const rule of rules) {
      if (rule.cssRules) {
        try {
          walkRules(rule.cssRules);
        } catch {
          /* nested access error */
        }
        continue;
      }
      if (rule.style) {
        for (const prop of rule.style) {
          if (!prop.startsWith("--")) continue;
          const val = rule.style.getPropertyValue(prop);
          if (val && MODERN_FN.test(val)) {
            overrides.push([prop, convertModernColorCall(val)]);
          }
        }
      }
    }
  };
  for (const sheet of doc.styleSheets) {
    try {
      walkRules(sheet.cssRules);
    } catch {
      /* cross-origin stylesheet — skip */
    }
  }
  if (!overrides.length) return null;
  const style = doc.createElement("style");
  style.dataset.oklchOverride = "true";
  style.textContent = `:root, :host { ${overrides
    .map(([p, v]) => `${p}: ${v};`)
    .join(" ")} }`;
  doc.head.appendChild(style);
  return style;
}

// Walk a DOM subtree and replace every oklch()/oklab()/color()/color-mix()
// computed color with its rgb() equivalent (inline styles on the tree —
// html2canvas can then parse it).
export function convertOklchInTree(root) {
  if (!root) return;
  const els = [root, ...root.querySelectorAll("*")];
  const props = [
    "color", "backgroundColor", "backgroundImage", "boxShadow",
    "borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor",
    "outlineColor", "textDecorationColor", "columnRuleColor", "fill", "stroke", "caretColor",
  ];
  for (const el of els) {
    let cs;
    try {
      cs = window.getComputedStyle(el);
    } catch {
      continue;
    }
    for (const prop of props) {
      let val;
      try {
        val = cs[prop];
      } catch {
        continue;
      }
      if (val && typeof val === "string" && MODERN_FN.test(val)) {
        try {
          el.style[prop] = convertModernColorCall(val);
        } catch {
          /* ignore read-only props */
        }
      }
    }
    if (el instanceof SVGElement) {
      for (const attr of ["fill", "stroke"]) {
        const v = el.getAttribute(attr);
        if (v && MODERN_FN.test(v)) el.setAttribute(attr, convertModernColorCall(v));
      }
    }
  }
}
