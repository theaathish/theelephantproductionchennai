/**
 * Utility functions for handling media URLs
 */

// Get the backend base URL (without /api)
export const getBackendBaseUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
  // Remove /api suffix to get base URL
  return apiUrl.replace(/\/api$/, '');
};

/**
 * Normalize media URL to use the correct backend URL
 * Handles cases where URLs are stored with localhost or old domain
 * 
 * @param url - The media URL from the database
 * @returns Normalized URL with correct backend domain
 */
export const normalizeMediaUrl = (url: string | undefined | null): string => {
  if (!url) return '';
  
  // If it's a YouTube URL or external URL (starts with http:// or https://)
  // that's not pointing to localhost or uploads, return as is
  if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com')) {
    return url;
  }
  
  const backendBaseUrl = getBackendBaseUrl();
  
  // If URL is absolute (contains localhost or other domain) and has /uploads/
  if (url.includes('/uploads/')) {
    // Extract just the filename from the URL
    const match = url.match(/\/uploads\/(.+)$/);
    if (match) {
      const filename = match[1];
      return `${backendBaseUrl}/uploads/${filename}`;
    }
  }
  
  // If URL is relative (starts with /uploads/)
  if (url.startsWith('/uploads/')) {
    return `${backendBaseUrl}${url}`;
  }
  
  // If URL is just a filename
  if (!url.startsWith('http') && !url.startsWith('/')) {
    return `${backendBaseUrl}/uploads/${url}`;
  }
  
  // If URL already has correct domain, return as is
  if (url.startsWith(backendBaseUrl)) {
    return url;
  }
  
  // Default: return URL with backend base
  return url.startsWith('/') ? `${backendBaseUrl}${url}` : url;
};

/**
 * Normalize an object containing media URLs
 * Recursively processes all string properties that might be media URLs
 * 
 * @param obj - Object potentially containing media URLs
 * @returns Object with normalized URLs
 */
export const normalizeMediaUrls = <T>(obj: T): T => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => normalizeMediaUrls(item)) as T;
  }

  const normalized: any = {};
  
  for (const [key, value] of Object.entries(obj)) {
    // Check if this is likely a media URL field
    if (
      typeof value === 'string' && 
      (key.toLowerCase().includes('url') || 
       key.toLowerCase().includes('image') || 
       key.toLowerCase().includes('video') ||
       key.toLowerCase().includes('media') ||
       key.toLowerCase().includes('thumbnail') ||
       key.toLowerCase().includes('poster'))
    ) {
      normalized[key] = normalizeMediaUrl(value);
    } else if (value && typeof value === 'object') {
      normalized[key] = normalizeMediaUrls(value);
    } else {
      normalized[key] = value;
    }
  }
  
  return normalized as T;
};
