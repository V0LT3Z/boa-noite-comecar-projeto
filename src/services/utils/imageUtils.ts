
/**
 * Utility functions for handling event images
 */

// Helper function to generate consistent image URLs based on event ID
export const generatePersistentImageUrl = (eventId: number) => {
  return `https://picsum.photos/seed/${eventId}/800/500`;
};

// Helper function to process image URLs - ensures blob URLs are converted to persistent ones
export const processImageUrl = (imageUrl: string | null | undefined, eventId: number) => {
  // Always use a persistent URL based on event ID for consistency
  return generatePersistentImageUrl(eventId);
};
