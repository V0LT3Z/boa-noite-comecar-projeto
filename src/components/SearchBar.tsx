
import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface SearchBarProps {
  onSearch?: (query: string) => void;
  defaultQuery?: string;
  suggestions?: Array<{
    id: number;
    title: string;
    date: string;
    location: string;
  }>;
}

const SearchBar = ({ onSearch, defaultQuery = "", suggestions = [] }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState(defaultQuery)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  // Quando searchQuery for limpo, mostra novamente todos eventos
  useEffect(() => {
    if (searchQuery.trim() === "") {
      if (onSearch) {
        onSearch("");
      } else {
        // Remove o parâmetro de busca da URL
        navigate(`/`);
      }
    }
    // Só disparar quando searchQuery mudar (e não em cada render)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setOpen(false)
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

  const handleSelect = (value: string) => {
    setSearchQuery(value)
    setOpen(false)
    if (onSearch) {
      onSearch(value)
    } else {
      navigate(`/?q=${encodeURIComponent(value)}`)
    }
  }

  const filteredSuggestions = suggestions.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="w-full max-w-4xl mx-auto relative">
      <form onSubmit={handleSearch}>
        <div className="relative">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <div className="relative">
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setOpen(true)
                  }}
                  placeholder="Buscar eventos..."
                  className="pl-10 py-6 bg-white border border-gray-200 text-black placeholder-gray-500 focus:ring-2 focus:ring-primary/50 rounded-lg shadow-sm transition-all duration-300"
                />
                <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </PopoverTrigger>
            {suggestions.length > 0 && (
              <PopoverContent className="w-[400px] p-0" align="start">
                <Command>
                  <CommandList>
                    <CommandEmpty>Nenhum evento encontrado.</CommandEmpty>
                    <CommandGroup>
                      {filteredSuggestions.map((event) => (
                        <CommandItem
                          key={event.id}
                          value={event.title}
                          onSelect={handleSelect}
                          className="cursor-pointer"
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{event.title}</span>
                            <span className="text-sm text-gray-500">
                              {event.date} • {event.location}
                            </span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            )}
          </Popover>
        </div>
      </form>
    </div>
  )
}

export default SearchBar
