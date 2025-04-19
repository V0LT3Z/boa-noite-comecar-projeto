
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { addToFavorites, removeFromFavorites, isEventFavorited } from "@/services/favorites";

interface FavoriteButtonProps {
  eventId: number;
  variant?: "default" | "outline" | "icon";
}

const FavoriteButton = ({ eventId, variant = "default" }: FavoriteButtonProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
  
  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      // Store current path to redirect back after login
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
      // Redirect to login or show auth dialog
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
  
  if (variant === "icon") {
    return (
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
    );
  }
  
  return (
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
  );
};

export default FavoriteButton;
