import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"

interface SearchBarProps {
  onSearch?: (query: string) => void;
  defaultQuery?: string;
}

const SearchBar = ({ onSearch, defaultQuery = "" }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState(defaultQuery)
  const navigate = useNavigate()
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      console.log(`Searching for: ${searchQuery}`)
      
      if (onSearch) {
        // If there's an onSearch handler, use it
        onSearch(searchQuery.trim())
      } else {
        // Otherwise navigate to the homepage with search query
        navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`)
      }
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto relative">
      <form onSubmit={handleSearch}>
        <div className="relative">
          <Input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar eventos..." 
            className="pl-10 py-6 bg-white border border-gray-200 text-black placeholder-gray-500 focus:ring-2 focus:ring-primary/50 rounded-lg shadow-sm transition-all duration-300"
          />
          <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  )
}

export default SearchBar
