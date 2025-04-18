
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

const SearchBar = () => {
  return (
    <div className="w-full max-w-4xl mx-auto relative">
      <div className="relative">
        <Input 
          type="text" 
          placeholder="Buscar eventos..." 
          className="pl-10 py-3 bg-[#1e293b]/40 backdrop-blur-lg border-primary/20 text-white placeholder-white/60 focus:ring-2 focus:ring-primary-light/50 rounded-lg transition-all duration-300"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-light w-5 h-5" />
      </div>
    </div>
  )
}

export default SearchBar
