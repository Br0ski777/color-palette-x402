import type { ApiConfig } from "./shared";

export const API_CONFIG: ApiConfig = {
  name: "color-palette",
  slug: "color-palette",
  description: "Generate harmonious color palettes from a base color — complementary, analogous, triadic, split-complementary, tetradic schemes.",
  version: "1.0.0",
  routes: [
    {
      method: "POST",
      path: "/api/palette",
      price: "$0.001",
      description: "Generate a color palette from a base hex color",
      toolName: "design_generate_color_palette",
      toolDescription: "Use this when you need to generate a harmonious color palette from a base color. Supports complementary, analogous, triadic, split-complementary, and tetradic schemes. Returns hex codes, RGB values, HSL values, and CSS variables for each color. Do NOT use for image processing — use media_extract_text_from_image instead. Do NOT use for favicon generation — use utility_generate_qr_code instead.",
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
