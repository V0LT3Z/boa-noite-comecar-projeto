
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { addToFavorites, removeFromFavorites, isEventFavorited } from "@/services/favorites";
import { toast } from "@/components/ui/sonner";
import { AuthDialog } from "@/components/auth/AuthDialog";

interface FavoriteButtonProps {
  eventId: number;
  variant?: "default" | "outline" | "icon";
}

const FavoriteButton = ({ eventId, variant = "default" }: FavoriteButtonProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (isAuthenticated) {
        setIsLoading(true);
        const favorited = await isEventFavorited(eventId);
        setIsFavorite(favorited);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    };
    
    checkFavoriteStatus();
  }, [eventId, isAuthenticated]);
  
  // Listen for custom event to open auth modal
  useEffect(() => {
    const handleOpenAuthModal = () => {
      setIsAuthDialogOpen(true);
    };
    
    document.addEventListener('openAuthModal', handleOpenAuthModal);
    
    return () => {
      document.removeEventListener('openAuthModal', handleOpenAuthModal);
    };
  }, []);
  
  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent event bubbling when used in cards
    
    if (!isAuthenticated) {
      // Store current path to redirect back after login
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
      // Open authentication modal
      setIsAuthDialogOpen(true);
      return;
    }
    
    setIsLoading(true);
    
    let success;
    if (isFavorite) {
      success = await removeFromFavorites(eventId);
    } else {
      success = await addToFavorites(eventId);
    }
    
    if (success) {
      setIsFavorite(!isFavorite);
    }
    
    setIsLoading(false);
  };
  
  const handleAuthSuccess = () => {
    setIsAuthDialogOpen(false);
    // Refresh favorite status after successful login
    if (isAuthenticated) {
      isEventFavorited(eventId).then((favorited) => {
        setIsFavorite(favorited);
      });
    }
  };
  
  if (variant === "icon") {
    return (
      <>
        <button
          className={`rounded-full p-2 transition-colors ${
            isFavorite 
              ? "bg-soft-pink text-destructive" 
              : "bg-white/80 hover:bg-soft-pink/50"
          }`}
          onClick={handleToggleFavorite}
          disabled={isLoading}
        >
          <Heart 
            className={`h-5 w-5 ${isFavorite ? "fill-destructive" : ""}`} 
          />
        </button>
        
        <AuthDialog 
          open={isAuthDialogOpen} 
          onOpenChange={setIsAuthDialogOpen} 
          onSuccess={handleAuthSuccess} 
        />
      </>
    );
  }
  
  return (
    <>
      <Button
        variant={variant}
        className={`flex items-center gap-2 ${
          isFavorite && variant === "outline" 
            ? "border-destructive text-destructive hover:bg-destructive/10" 
            : ""
        }`}
        onClick={handleToggleFavorite}
        disabled={isLoading}
      >
        <Heart 
          className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} 
        />
        {isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      </Button>
      
      <AuthDialog 
        open={isAuthDialogOpen} 
        onOpenChange={setIsAuthDialogOpen} 
        onSuccess={handleAuthSuccess} 
      />
    </>
  );
};

export default FavoriteButton;
