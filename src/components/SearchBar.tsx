
import { Search, MapPin, Calendar, List } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const SearchBar = () => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar eventos..."
          className="pl-10"
        />
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1 md:flex-none">
          <MapPin className="mr-2 h-4 w-4" />
          Localização
        </Button>
        <Button variant="outline" className="flex-1 md:flex-none">
          <Calendar className="mr-2 h-4 w-4" />
          Data
        </Button>
        <Button variant="outline" className="flex-1 md:flex-none">
          <List className="mr-2 h-4 w-4" />
          Categoria
        </Button>
      </div>
    </div>
  )
}

export default SearchBar
