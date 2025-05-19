
/**
 * Utility functions for handling event images
 */

// Helper function to generate fallback image URLs based on event ID
export const generateFallbackImageUrl = (eventId: number) => {
  return `https://picsum.photos/seed/${eventId}/800/500`;
};

// Helper function to process image URLs - preserves the original URL if available
export const processImageUrl = (imageUrl: string | null | undefined, eventId: number) => {
  // For data URLs (which start with "data:") or http/https URLs, use them directly
  if (imageUrl && 
      (imageUrl.startsWith('data:') || 
       imageUrl.startsWith('http://') || 
       imageUrl.startsWith('https://')) && 
      !imageUrl.includes('undefined')) {
    console.log(`Using original URL for event ${eventId}`);
    return imageUrl;
  }
  
  // If it's a blob URL, we'll need to fall back as these don't persist
  if (imageUrl && imageUrl.startsWith('blob:')) {
    console.log(`Found blob URL for event ${eventId}, it won't persist after refresh`);
  }
  
  // For empty, invalid, or blob URLs, use fallback
  console.log(`Using fallback URL for event ${eventId}`);
  return generateFallbackImageUrl(eventId);
};
