
import { Search, MapPin, Calendar, List } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const SearchBar = () => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-[1fr,auto] gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar eventos..."
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
            />
          </div>
          <div className="flex gap-2 flex-wrap md:flex-nowrap">
            <Button variant="outline" className="flex-1 md:flex-none bg-white/5 border-white/10 hover:bg-white/10">
              <MapPin className="mr-2 h-4 w-4" />
              Local
            </Button>
            <Button variant="outline" className="flex-1 md:flex-none bg-white/5 border-white/10 hover:bg-white/10">
              <Calendar className="mr-2 h-4 w-4" />
              Data
            </Button>
            <Button variant="outline" className="flex-1 md:flex-none bg-white/5 border-white/10 hover:bg-white/10">
              <List className="mr-2 h-4 w-4" />
              Categoria
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchBar

