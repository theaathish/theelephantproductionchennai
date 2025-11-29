// Utility to generate placeholder SVG images
export function generatePlaceholder(
  width: number,
  height: number,
  text: string,
  bgColor: string = '#e5e7eb',
  textColor: string = '#6b7280'
): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${bgColor}"/>
      <text 
        x="50%" 
        y="50%" 
        dominant-baseline="middle" 
        text-anchor="middle" 
        font-family="Arial, sans-serif" 
        font-size="24" 
        fill="${textColor}"
      >
        ${text}
      </text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

// Common placeholder URLs
export const PLACEHOLDERS = {
  service1: generatePlaceholder(800, 600, 'Photography', '#a67b5b', '#ffffff'),
  service2: generatePlaceholder(800, 600, 'Videography', '#a67b5b', '#ffffff'),
  service3: generatePlaceholder(800, 600, 'Production', '#a67b5b', '#ffffff'),
  portfolio1: generatePlaceholder(1200, 800, 'Portfolio 1', '#2c2420', '#ffffff'),
  portfolio2: generatePlaceholder(1200, 800, 'Portfolio 2', '#2c2420', '#ffffff'),
  portfolio3: generatePlaceholder(1200, 800, 'Portfolio 3', '#2c2420', '#ffffff'),
  portfolio4: generatePlaceholder(1200, 800, 'Portfolio 4', '#2c2420', '#ffffff'),
  hero: generatePlaceholder(1920, 1080, 'Hero Image', '#2c2420', '#ffffff'),
};

// Get image URL with fallback to placeholder
export function getImageUrl(url: string | undefined, placeholderKey: keyof typeof PLACEHOLDERS = 'hero'): string {
  if (!url || url === '') {
    return PLACEHOLDERS[placeholderKey];
  }
  return url;
}
