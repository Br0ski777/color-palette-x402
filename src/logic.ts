import type { Hono } from "hono";

function hexToHsl(hex: string): [number, number, number] {
  hex = hex.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  const toHex = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  hex = hex.replace("#", "");
  return { r: parseInt(hex.slice(0, 2), 16), g: parseInt(hex.slice(2, 4), 16), b: parseInt(hex.slice(4, 6), 16) };
}

function generatePalette(baseHex: string, scheme: string, count: number) {
  const [h, s, l] = hexToHsl(baseHex);
  const hues: number[] = [];
  switch (scheme) {
    case "complementary": hues.push(h, h + 180); break;
    case "analogous": for (let i = -2; i <= 2; i++) hues.push(h + i * 30); break;
    case "triadic": hues.push(h, h + 120, h + 240); break;
    case "split-complementary": hues.push(h, h + 150, h + 210); break;
    case "tetradic": hues.push(h, h + 90, h + 180, h + 270); break;
    default: hues.push(h, h + 180);
  }
  const colors: Array<{ hex: string; rgb: { r: number; g: number; b: number }; hsl: { h: number; s: number; l: number }; css: string }> = [];
  let idx = 0;
  while (colors.length < count) {
    const hue = hues[idx % hues.length];
    const lightness = idx < hues.length ? l : l + (idx - hues.length + 1) * (l > 50 ? -10 : 10);
    const hex = hslToHex(hue, s, Math.max(10, Math.min(90, lightness)));
    const rgb = hexToRgb(hex);
    colors.push({
      hex, rgb,
      hsl: { h: ((Math.round(hue) % 360) + 360) % 360, s, l: Math.max(10, Math.min(90, Math.round(lightness))) },
      css: `--color-${colors.length + 1}: ${hex};`,
    });
    idx++;
  }
  return colors;
}

export function registerRoutes(app: Hono) {
  app.post("/api/palette", async (c) => {
    const body = await c.req.json().catch(() => null);
    if (!body?.color) return c.json({ error: "Missing required field: color" }, 400);
    const hex = body.color.replace("#", "").toUpperCase();
    if (!/^[0-9A-F]{6}$/.test(hex)) return c.json({ error: "Invalid hex color. Use format: #FF5733 or FF5733" }, 400);
    const scheme = (body.scheme || "complementary").toLowerCase();
    const validSchemes = ["complementary", "analogous", "triadic", "split-complementary", "tetradic"];
    if (!validSchemes.includes(scheme)) return c.json({ error: `Invalid scheme. Supported: ${validSchemes.join(", ")}` }, 400);
    const count = Math.min(10, Math.max(2, body.count || 5));
    const colors = generatePalette(`#${hex}`, scheme, count);
    return c.json({ baseColor: `#${hex}`, scheme, count: colors.length, colors, cssVariables: colors.map((c) => c.css).join("\n") });
  });
}
