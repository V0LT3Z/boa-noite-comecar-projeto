
import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // In a real application, this would navigate to a search results page with the query
      console.log(`Searching for: ${searchQuery}`)
      // navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      
      // For now, we'll just log the search and reset the query
      setSearchQuery("")
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
