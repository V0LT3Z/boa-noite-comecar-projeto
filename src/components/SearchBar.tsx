
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

const SearchBar = () => {
  return (
    <div className="w-full max-w-4xl mx-auto relative">
      <div className="relative">
        <Input 
          type="text" 
          placeholder="Buscar eventos..." 
          className="pl-10 py-3 bg-gray-100 border-gray-300 text-black placeholder-gray-500 focus:ring-2 focus:ring-primary/50 rounded-lg transition-all duration-300"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
      </div>
    </div>
  )
}

export default SearchBar
