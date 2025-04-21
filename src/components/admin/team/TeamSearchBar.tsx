
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TeamSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const TeamSearchBar = ({ searchQuery, onSearchChange }: TeamSearchBarProps) => {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <Search className="w-4 h-4 text-muted-foreground" />
      <Input
        placeholder="Buscar por nome ou e-mail"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-sm"
      />
    </div>
  );
};
