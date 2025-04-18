
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"

const SearchBar = () => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <Button 
        variant="ghost" 
        className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <Search className="h-5 w-5" />
        <span>Buscar eventos...</span>
      </Button>
    </div>
  )
}

export default SearchBar
