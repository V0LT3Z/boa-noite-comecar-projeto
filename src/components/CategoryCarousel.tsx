
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"

const categories = [
  "Música",
  "Teatro",
  "Esportes",
  "Stand-up",
  "Festivais",
  "Shows",
  "Workshops",
  "Congressos"
]

interface CategoryCarouselProps {
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

const CategoryCarousel = ({ selectedCategory, onCategorySelect }: CategoryCarouselProps) => {
  const handleCategoryClick = (category: string) => {
    onCategorySelect(category === selectedCategory ? null : category);
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Carousel
        opts={{
          align: "start",
          dragFree: true
        }}
        className="w-full"
      >
        <CarouselContent>
          {categories.map((category) => (
            <CarouselItem key={category} className="basis-1/3 md:basis-1/4 lg:basis-1/6">
              <Button
                variant={selectedCategory === category ? "default" : "outline"}
                className={`w-full whitespace-nowrap text-sm font-gooddog ${
                  selectedCategory === category 
                    ? "bg-primary text-white" 
                    : "bg-white hover:bg-primary hover:text-white"
                }`}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}

export default CategoryCarousel
