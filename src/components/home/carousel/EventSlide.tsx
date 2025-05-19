
import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { fetchEventById } from '@/services/events';

interface EventSlideProps {
  id: number;
  title: string;
  date: string;
  location: string;
  image: string;
  isActive?: boolean;
}

const EventSlide = ({ id, title, date, location, image, isActive = false }: EventSlideProps) => {
  const [isValidEvent, setIsValidEvent] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  // Verificar se o evento existe no banco de dados
  useEffect(() => {
    const checkEventValidity = async () => {
      try {
        const eventDetails = await fetchEventById(id);
        setIsValidEvent(!!eventDetails);
      } catch (error) {
        console.error(`Erro ao verificar evento ${id}:`, error);
        setIsValidEvent(false);
      }
    };
    
    checkEventValidity();
  }, [id]);
  
  // Se o evento não for válido, não renderiza nada
  if (!isValidEvent) {
    return null;
  }
  
  // Usar uma imagem padrão SOMENTE se a URL original for inválida
  const handleImageError = () => {
    setImageError(true);
  };
  
  // Usar a imagem original e só cair para o fallback se houver erro
  const imageUrl = imageError 
    ? `https://picsum.photos/seed/${id}/800/500`
    : image;
  
  return (
    <div 
      className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
      style={{ 
        willChange: 'opacity, transform',
      }}
    >
      <div className="relative h-[420px] w-full overflow-hidden group">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="eager"
          style={{
            transition: 'transform 500ms ease-in-out',
            transform: isActive ? 'scale(1)' : 'scale(1.05)'
          }}
          onError={handleImageError}
        />
        {/* Subtle overlay to enhance image visibility */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-50 mix-blend-multiply" 
        />
        <div 
          className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"
        />
        
        {/* Discrete date display with calendar icon */}
        <div className="absolute bottom-6 left-6 z-20">
          <div className="bg-black/30 backdrop-blur-sm text-white px-3 py-2 rounded-lg shadow-md flex items-center gap-2 border border-white/10">
            <Calendar className="h-4 w-4 text-primary-light" />
            <p className="text-sm font-medium">{date}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventSlide;
