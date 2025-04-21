
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

const SearchBar = () => {
  return (
    <div className="w-full max-w-4xl mx-auto relative">
      <div className="relative">
        <Input 
          type="text" 
          placeholder="Buscar eventos..." 
          className="pl-10 py-6 bg-white border border-gray-200 text-black placeholder-gray-500 focus:ring-2 focus:ring-primary/50 rounded-lg shadow-sm transition-all duration-300"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
      </div>
    </div>
  )
}

export default SearchBar
