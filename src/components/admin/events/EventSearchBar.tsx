
import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EventItem } from "@/types/admin";

interface EventSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  events?: EventItem[];
  autoFocus?: boolean;
}

export const EventSearchBar = ({ 
  searchQuery, 
  onSearchChange, 
  events = [],
  autoFocus = false
}: EventSearchBarProps) => {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if ((open || autoFocus) && inputRef.current) {
      // Pequeno atraso para garantir que o foco funcione
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 10);
    }
  }, [open, autoFocus]);
  
  // Filter events based on search query
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleSelect = (value: string) => {
    onSearchChange(value);
    setOpen(false);
  };

  const handleInputClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
    // Manter o foco no input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="p-4 border-b">
      <div className="relative">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div 
              className="flex items-center border rounded-md pl-2 bg-white cursor-text"
              onClick={handleInputClick}
            >
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                ref={inputRef}
                placeholder="Buscar eventos..."
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onClick={handleInputClick}
              />
            </div>
          </PopoverTrigger>
          
          {events.length > 0 && (
            <PopoverContent 
              className="w-[300px] p-0 max-h-[300px] overflow-y-auto" 
              align="start"
              sideOffset={5}
              onInteractOutside={() => {
                if (inputRef.current && document.activeElement === inputRef.current) {
                  // Não fecha o popover se o input estiver em foco
                  return;
                }
                setOpen(false);
              }}
            >
              <Command>
                <CommandList>
                  <CommandEmpty>Nenhum evento encontrado</CommandEmpty>
                  <CommandGroup>
                    {filteredEvents.map((event) => (
                      <CommandItem
                        key={event.id}
                        value={event.title}
                        onSelect={() => handleSelect(event.title)}
                        className="flex justify-between items-center cursor-pointer"
                      >
                        <span>{event.title}</span>
                        <span className="text-xs text-muted-foreground">{event.date}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          )}
        </Popover>
      </div>
    </div>
  );
};
