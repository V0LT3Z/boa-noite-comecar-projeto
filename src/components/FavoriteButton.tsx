
import { useState, useEffect, useCallback } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { addToFavorites, removeFromFavorites, isEventFavorited } from "@/services/favorites";
import { toast } from "@/hooks/use-toast";
import { AuthDialog } from "@/components/auth/AuthDialog";

interface FavoriteButtonProps {
  eventId: number;
  variant?: "default" | "outline" | "icon";
}

const FavoriteButton = ({ eventId, variant = "default" }: FavoriteButtonProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  
  // Move the check to a memoized callback to prevent recreating on every render
  const checkFavoriteStatus = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setIsFavorite(false);
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      console.log("Checking favorite status for event:", eventId);
      const favorited = await isEventFavorited(eventId);
      console.log("Is event favorited?", favorited);
      setIsFavorite(favorited);
    } catch (error) {
      console.error("Error checking favorite status:", error);
    } finally {
      setIsLoading(false);
    }
  }, [eventId, isAuthenticated, user]);
  
  useEffect(() => {
    // Only run the effect when the dependencies actually change
    if (isAuthenticated && user) {
      checkFavoriteStatus();
    } else {
      setIsLoading(false);
      setIsFavorite(false);
    }
  }, [checkFavoriteStatus, isAuthenticated, user]);
  
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
    e.stopPropagation(); // Ensure event doesn't propagate
    
    console.log("Toggle favorite clicked, isAuthenticated:", isAuthenticated, "user:", !!user, "eventId:", eventId);
    
    if (!isAuthenticated || !user) {
      console.log("User not authenticated, opening auth dialog");
      // Store current path to redirect back after login
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
      // Open authentication modal
      setIsAuthDialogOpen(true);
      return;
    }
    
    if (isLoading) return; // Prevent multiple clicks
    
    setIsLoading(true);
    
    try {
      let success;
      if (isFavorite) {
        console.log("Removing from favorites, event ID:", eventId);
        success = await removeFromFavorites(eventId);
      } else {
        console.log("Adding to favorites, event ID:", eventId);
        success = await addToFavorites(eventId);
      }
      
      if (success) {
        setIsFavorite(!isFavorite);
        toast({
          title: isFavorite ? "Removido dos favoritos" : "Adicionado aos favoritos",
          description: isFavorite ? "O evento foi removido dos seus favoritos." : "O evento foi adicionado aos seus favoritos.",
          variant: "default"
        });
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        title: "Erro ao atualizar favorito",
        description: "Tente novamente mais tarde",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAuthSuccess = () => {
    setIsAuthDialogOpen(false);
    
    // Check favorite status again after login
    if (isAuthenticated && user) {
      checkFavoriteStatus();
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
          } font-gooddog`}
          onClick={handleToggleFavorite}
          disabled={isLoading}
          data-event-id={eventId}
          aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
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
        } font-gooddog`}
        onClick={handleToggleFavorite}
        disabled={isLoading}
        data-event-id={eventId}
        aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
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
