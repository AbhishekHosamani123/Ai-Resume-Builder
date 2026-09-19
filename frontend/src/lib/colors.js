// oklch() → rgb() conversion + a DOM pre-pass so html2canvas can render
// Tailwind v4 colors (which are oklch-based) without throwing, while KEEPING
// the template's real colors (the old approach forced everything to black).

function srgbGamma(c) {
  if (c <= 0.0031308) return 12.92 * c;
  return 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

// OKLCH (L 0-1, C chroma, H hue-deg) → "r, g, b" (0-255)
export function oklchToRgbString(l, c, h) {
  const hr = (h * Math.PI) / 180;
  const a = c * Math.cos(hr);
  const b = c * Math.sin(hr);

  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;

  const L = l_ * l_ * l_;
  const M = m_ * m_ * m_;
  const S = s_ * s_ * s_;

  let r = 4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S;
  let g = -1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S;
  let bb = -0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S;

  r = Math.round(Math.min(255, Math.max(0, srgbGamma(Math.min(1, Math.max(0, r)))) * 255));
  g = Math.round(Math.min(255, Math.max(0, srgbGamma(Math.min(1, Math.max(0, g)))) * 255));
  bb = Math.round(Math.min(255, Math.max(0, srgbGamma(Math.min(1, Math.max(0, bb)))) * 255));
  return `${r}, ${g}, ${bb}`;
}

// "0.596 0.135 264.9" | "55% 0.1 260 / 0.5" → converted oklch(...) call
export function convertOklchCall(colorValue) {
  return colorValue.replace(/oklch\(([^)]+)\)/gi, (match, inner) => {
    try {
      const parts = inner.split("/").map((s) => s.trim());
      const nums = parts[0].split(/\s+/).map((tok) => {
        if (tok.endsWith("%")) return (parseFloat(tok) / 100).toString();
        return tok === "none" ? "0" : tok;
      });
      if (nums.length < 3 || nums.some((n) => n === "" || Number.isNaN(parseFloat(n)))) return match;
      const rgb = oklchToRgbString(parseFloat(nums[0]), parseFloat(nums[1]), parseFloat(nums[2]));
      const alpha = parts[1] ? `, ${parts[1].endsWith("%") ? parseFloat(parts[1]) / 100 : parseFloat(parts[1])}` : "";
      return `rgb${alpha ? "a" : ""}(${rgb}${alpha})`;
    } catch {
      return match;
    }
  });
}

// Walk a DOM subtree and replace every oklch() computed color with its rgb()
// equivalent (inline styles on the tree — html2canvas can then parse it).
export function convertOklchInTree(root) {
  if (!root) return;
  const els = [root, ...root.querySelectorAll("*")];
  const props = [
    "color", "backgroundColor", "borderTopColor", "borderRightColor",
    "borderBottomColor", "borderLeftColor", "outlineColor",
    "textDecorationColor", "columnRuleColor", "fill", "stroke", "caretColor",
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
      if (val && typeof val === "string" && val.includes("oklch")) {
        try {
          el.style[prop] = convertOklchCall(val);
        } catch {
          /* ignore read-only props */
        }
      }
    }
    if (el instanceof SVGElement) {
      for (const attr of ["fill", "stroke"]) {
        const v = el.getAttribute(attr);
        if (v && v.includes("oklch")) el.setAttribute(attr, convertOklchCall(v));
      }
    }
  }
}
