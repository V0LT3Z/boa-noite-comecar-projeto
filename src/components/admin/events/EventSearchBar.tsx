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
  
  // Focus input when component mounts if autoFocus is true
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);
  
  // Filter events based on search query
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleSelect = (value: string) => {
    onSearchChange(value);
    setOpen(false);
    
    // Keep focus on input after selection
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Prevent losing focus when clicking input container
  const handleContainerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Set popover open state
    setOpen(true);
    
    // Keep focus on input
    if (inputRef.current) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    }
  };

  // Handle change in input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
    if (!open) {
      setOpen(true);
    }
  };

  return (
    <div className="p-4 border-b">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div 
            className="flex items-center border rounded-md pl-2 bg-white cursor-text"
            onClick={handleContainerClick}
          >
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder="Buscar eventos..."
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={() => setOpen(true)}
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
                // Don't close if input has focus
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
  );
};
