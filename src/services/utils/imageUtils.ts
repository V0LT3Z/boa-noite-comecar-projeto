/**
 * Utility functions for handling event images
 */

// Helper function to generate fallback image URLs based on event ID
export const generateFallbackImageUrl = (eventId: number) => {
  return `https://picsum.photos/seed/${eventId}/800/500`;
};

// Helper function to process image URLs - preserves the original URL if available
export const processImageUrl = (imageUrl: string | null | undefined, eventId: number) => {
  // If there's a valid image URL, use it directly
  if (imageUrl && imageUrl.trim().length > 0 && !imageUrl.includes('undefined')) {
    return imageUrl;
  }
  
  // Otherwise, use a fallback URL based on event ID
  return generateFallbackImageUrl(eventId);
};
