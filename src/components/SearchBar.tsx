
import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"
import {
  Command,
  CommandEmpty,
  CommandGroup,
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

  // Quando searchQuery mudar, dispara a busca em tempo real
  useEffect(() => {
    // Dispara a busca em tempo real (sem precisar pressionar Enter)
    if (onSearch) {
      onSearch(searchQuery);
    } else if (searchQuery.trim() === "") {
      // Remove o parâmetro de busca da URL quando a busca for limpa
      navigate(`/`);
    } else if (!window.location.pathname.includes('/eventos')) {
      // Atualiza a URL com o parâmetro de busca na página inicial
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setOpen(false)
    
    // Não precisamos fazer nada aqui, pois a busca já é disparada no useEffect acima
    // Mantendo apenas para prevenir o comportamento padrão do form
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

  const filteredSuggestions = suggestions?.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="w-full max-w-full mx-auto relative">
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
                    setOpen(e.target.value.length > 0)
                  }}
                  placeholder="Busque por eventos ou artistas"
                  className="pl-10 py-1.5 bg-white border border-gray-200 text-black placeholder-gray-500 focus:ring-2 focus:ring-primary/50 rounded-lg shadow-sm transition-all duration-300 h-9 text-sm font-gooddog"
                />
                <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </PopoverTrigger>
            {suggestions && suggestions.length > 0 && (
              <PopoverContent className="w-[300px] p-0 bg-white border border-gray-200 shadow-md font-gooddog" align="start">
                <Command>
                  <CommandList>
                    <CommandEmpty className="font-gooddog">Nenhum evento encontrado.</CommandEmpty>
                    <CommandGroup>
                      {filteredSuggestions.map((event) => (
                        <CommandItem
                          key={event.id}
                          value={event.title}
                          onSelect={handleSelect}
                          className="cursor-pointer hover:bg-gray-100 font-gooddog"
                        >
                          <div className="flex flex-col">
                            <span className="font-medium font-gooddog">{event.title}</span>
                            <span className="text-sm text-gray-500 font-gooddog">
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
