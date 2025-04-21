
import { useState } from "react"
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

const CategoryCarousel = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category === selectedCategory ? null : category)
    // In a real application, this would filter events by category
    console.log(`Filtering by category: ${category}`)
    alert(`Categoria selecionada: ${category}`)
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
                className={`w-full whitespace-nowrap text-sm ${
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
