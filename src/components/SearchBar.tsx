
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const SearchBar = () => {
  return (
    <div className="w-full max-w-4xl mx-auto relative">
      <div className="relative">
        <Input 
          type="text" 
          placeholder="Buscar eventos..." 
          className="pl-10 py-3 bg-white/10 backdrop-blur-lg border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-primary/50 transition-all duration-300"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
      </div>
    </div>
  )
}

export default SearchBar
