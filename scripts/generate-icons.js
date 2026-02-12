// Simple script to generate placeholder PWA icons as SVG-based PNGs
// Replace these with your actual logo files

const fs = require("fs");
const path = require("path");

function createSvgIcon(size) {
  const fontSize = Math.round(size * 0.35);
  const subFontSize = Math.round(size * 0.09);
  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#2c1810" rx="${Math.round(size * 0.15)}"/>
  <text x="50%" y="45%" text-anchor="middle" dominant-baseline="middle"
    font-family="serif" font-size="${fontSize}" font-weight="bold" fill="#c8952e">TCF</text>
  <text x="50%" y="70%" text-anchor="middle" dominant-baseline="middle"
    font-family="sans-serif" font-size="${subFontSize}" fill="#fdf6ec">CHOCOLATE</text>
</svg>`;
}

const iconsDir = path.join(__dirname, "..", "public", "icons");

const sizes = [
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
  { name: "icon-maskable-512.png", size: 512 },
  { name: "apple-touch-icon.png", size: 180 },
];

for (const { name, size } of sizes) {
  // Save as SVG (browsers will render them fine even with .png extension in development)
  // For production, convert these SVGs to actual PNGs using your logo
  const svgName = name.replace(".png", ".svg");
  fs.writeFileSync(path.join(iconsDir, svgName), createSvgIcon(size));
  console.log(`Generated ${svgName} (${size}x${size})`);
}

console.log(
  "\nNote: Replace these placeholder SVGs with your actual TCF logo as PNG files for production."
);
