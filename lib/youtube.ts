// YouTube URL utilities

/**
 * Extract YouTube video ID from various URL formats
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://m.youtube.com/watch?v=VIDEO_ID
 */
export function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Check if a URL is a YouTube link
 */
export function isYouTubeUrl(url: string): boolean {
  if (!url) return false;
  return /(?:youtube\.com|youtu\.be)/.test(url) || getYouTubeVideoId(url) !== null;
}

/**
 * Get YouTube embed URL from video ID or URL
 * @param urlOrId - YouTube URL or video ID
 * @param autoplay - Whether to autoplay (default: true)
 */
export function getYouTubeEmbedUrl(urlOrId: string, autoplay: boolean = true): string | null {
  const videoId = getYouTubeVideoId(urlOrId);
  if (!videoId) return null;
  
  // Clean embed with no branding, no title, no controls, high quality
  const params = [
    `autoplay=${autoplay ? '1' : '0'}`,
    'mute=1',
    'loop=1',
    `playlist=${videoId}`, // Required for loop
    'controls=0', // Hide controls
    'modestbranding=1', // Minimal YouTube branding
    'rel=0', // Don't show related videos
    'showinfo=0', // Hide title
    'iv_load_policy=3', // Hide annotations
    'disablekb=1', // Disable keyboard controls
    'fs=0', // Hide fullscreen button
    'playsinline=1', // Play inline on mobile
    'vq=hd1080' // Request 1080p quality (YouTube will use best available)
  ];
  
  return `https://www.youtube.com/embed/${videoId}?${params.join('&')}`;
}

/**
 * Get YouTube thumbnail URL
 */
export function getYouTubeThumbnail(urlOrId: string, quality: 'default' | 'hq' | 'mq' | 'sd' | 'maxres' = 'maxres'): string | null {
  const videoId = getYouTubeVideoId(urlOrId);
  if (!videoId) return null;
  
  const qualityMap = {
    'default': 'default',
    'mq': 'mqdefault',
    'hq': 'hqdefault',
    'sd': 'sddefault',
    'maxres': 'maxresdefault'
  };
  
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
}
