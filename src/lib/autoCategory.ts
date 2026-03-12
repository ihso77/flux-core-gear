import { categories } from "@/components/CategoryFilter";

// Keyword maps for auto-categorization
const categoryKeywords: Record<string, string[]> = {
  keyboards: [
    "keyboard", "keycap", "keycaps", "keyswitch", "mechanical", "membrane",
    "60%", "65%", "75%", "tkl", "tenkeyless", "full-size", "numpad",
    "cherry mx", "gateron", "kailh", "hot-swap", "hotswap", "rgb keyboard",
    "gaming keyboard", "wireless keyboard", "bluetooth keyboard",
  ],
  mouse: [
    "mouse", "mice", "dpi", "sensor", "optical", "laser mouse",
    "gaming mouse", "wireless mouse", "ergonomic mouse", "lightweight mouse",
    "drag click", "claw grip", "palm grip", "fingertip grip",
  ],
  headsets: [
    "headset", "headphone", "earphone", "earbud", "audio",
    "surround sound", "noise cancelling", "microphone", "mic",
    "gaming headset", "wireless headset", "bluetooth headset",
    "over-ear", "on-ear", "in-ear",
  ],
  monitors: [
    "monitor", "display", "screen", "panel", "ips", "va panel",
    "tn panel", "oled", "qled", "4k", "1440p", "1080p", "ultrawide",
    "curved", "gaming monitor", "refresh rate", "144hz", "240hz", "360hz",
  ],
  controllers: [
    "controller", "gamepad", "joystick", "d-pad", "analog stick",
    "xbox controller", "ps5 controller", "pro controller",
    "wireless controller", "fight stick", "arcade stick",
  ],
  accessories: [
    "mousepad", "mouse pad", "desk mat", "wrist rest", "cable",
    "usb hub", "stand", "arm", "mount", "webcam", "capture card",
    "stream deck", "key puller", "lube", "stabilizer", "foam",
    "carrying case", "adapter", "dongle", "extension",
  ],
  bundles: [
    "bundle", "kit", "set", "combo", "package", "collection",
    "starter kit", "pro kit", "essential",
  ],
};

/**
 * Auto-categorize a product based on its title and description.
 * Returns the best matching category ID.
 */
export function autoCategorize(title: string, description: string = ""): string {
  const text = `${title} ${description}`.toLowerCase();
  
  let bestMatch = "all";
  let bestScore = 0;
  
  for (const [categoryId, keywords] of Object.entries(categoryKeywords)) {
    let score = 0;
    for (const keyword of keywords) {
      if (text.includes(keyword.toLowerCase())) {
        // Title matches weigh more
        if (title.toLowerCase().includes(keyword.toLowerCase())) {
          score += 3;
        } else {
          score += 1;
        }
      }
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestMatch = categoryId;
    }
  }
  
  return bestMatch;
}

/**
 * Get category label for display
 */
export function getCategoryLabel(categoryId: string): string {
  const category = categories.find(c => c.id === categoryId);
  return category?.label || "Uncategorized";
}

/**
 * Auto-categorize multiple products and return a map
 */
export function autoCategorizeProducts(
  products: Array<{ title: string; description?: string }>
): Map<string, string> {
  const result = new Map<string, string>();
  
  for (const product of products) {
    const category = autoCategorize(product.title, product.description);
    result.set(product.title, category);
  }
  
  return result;
}
