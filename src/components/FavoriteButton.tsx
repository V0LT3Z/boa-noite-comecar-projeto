
import { useState, useEffect } from "react";
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
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  
  useEffect(() => {
    // Only check favorite status when user is authenticated
    if (isAuthenticated && user) {
      checkFavoriteStatus();
    } else {
      setIsLoading(false);
      setIsFavorite(false);
    }
  }, [eventId, isAuthenticated, user]);
  
  // Function to check if event is favorited
  const checkFavoriteStatus = async () => {
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
  };
  
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
    
    console.log("Toggle favorite clicked, isAuthenticated:", isAuthenticated, "user:", !!user);
    
    if (!isAuthenticated || !user) {
      console.log("User not authenticated, opening auth dialog");
      // Store current path to redirect back after login
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
      // Open authentication modal
      setIsAuthDialogOpen(true);
      return;
    }
    
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
