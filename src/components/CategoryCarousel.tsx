
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
                variant="outline"
                className="w-full whitespace-nowrap text-sm bg-white hover:bg-primary hover:text-white"
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
