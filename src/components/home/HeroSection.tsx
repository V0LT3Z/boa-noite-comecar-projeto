
import React from 'react';
import SearchBar from "@/components/SearchBar";
import CategoryCarousel from "@/components/CategoryCarousel";

interface HeroSectionProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
  searchSuggestions: Array<{ id: number; title: string; date: string; location: string }>;
}

const HeroSection = ({ 
  searchQuery, 
  onSearch, 
  selectedCategory, 
  onCategorySelect,
  searchSuggestions
}: HeroSectionProps) => {
  return (
    <section className="relative bg-gradient-to-r from-purple-100 to-blue-100 pt-24 pb-16 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-10 top-10 w-40 h-40 rounded-full bg-purple-300 opacity-20 blur-3xl"></div>
        <div className="absolute right-10 top-40 w-60 h-60 rounded-full bg-blue-300 opacity-20 blur-3xl"></div>
        <div className="absolute left-1/2 bottom-0 w-80 h-80 rounded-full bg-pink-300 opacity-10 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-5">
            Encontre eventos para você
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Shows, festivais, workshops e muito mais
          </p>
          <SearchBar 
            onSearch={onSearch} 
            defaultQuery={searchQuery}
            suggestions={searchSuggestions}
          />
          <div className="mt-6">
            <CategoryCarousel 
              selectedCategory={selectedCategory} 
              onCategorySelect={onCategorySelect} 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
