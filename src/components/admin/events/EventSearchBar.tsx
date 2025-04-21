
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface EventSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const EventSearchBar = ({ searchQuery, onSearchChange }: EventSearchBarProps) => {
  return (
    <div className="p-4 border-b">
      <div className="flex items-center">
        <Search className="h-4 w-4 mr-2 text-muted-foreground" />
        <Input
          placeholder="Buscar eventos..."
          className="max-w-sm"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
};
