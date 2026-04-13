import type { ApiConfig } from "./shared";

export const API_CONFIG: ApiConfig = {
  name: "color-palette",
  slug: "color-palette",
  description: "Generate harmonious color palettes from any hex color. 5 schemes: complementary, analogous, triadic, split-complementary, tetradic. Returns hex, RGB, HSL, and CSS vars.",
  version: "1.0.0",
  routes: [
    {
      method: "POST",
      path: "/api/palette",
      price: "$0.001",
      description: "Generate a color palette from a base hex color",
      toolName: "design_generate_color_palette",
      toolDescription: `Use this when you need to generate a harmonious color palette from a base hex color. Returns multiple color formats ready for design or code.

1. colors -- array of color objects, each containing hex, rgb (r,g,b), hsl (h,s,l), and cssVar
2. scheme -- the color scheme used (complementary, analogous, triadic, split-complementary, tetradic)
3. baseColor -- the input hex color
4. count -- number of colors in the palette

Example output: {"colors":[{"hex":"#FF5733","rgb":{"r":255,"g":87,"b":51},"hsl":{"h":11,"s":100,"l":60},"cssVar":"--color-1: #FF5733;"}],"scheme":"complementary","baseColor":"#FF5733","count":5}

Use this FOR building design systems, generating theme colors for websites, creating brand color guidelines, or picking accessible color combinations for UI components. Use this BEFORE starting any design project that needs a cohesive palette.

Do NOT use for image processing -- use media_extract_text_from_image instead. Do NOT use for favicon generation -- use utility_generate_qr_code instead. Do NOT use for screenshot capture -- use capture_screenshot instead.`,
      inputSchema: {
        type: "object",
        properties: {
          color: { type: "string", description: "Base hex color (e.g. #FF5733 or FF5733)" },
          scheme: { type: "string", description: "Color scheme: complementary, analogous, triadic, split-complementary, tetradic (default: complementary)" },
          count: { type: "number", description: "Number of colors to generate (default: 5, max: 10)" },
        },
        required: ["color"],
      },
    },
  ],
};
