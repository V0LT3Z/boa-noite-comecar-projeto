
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RoleSelectorProps {
  value: string;
  onChange: (value: string) => void;
  isLoading: boolean;
}

export default function RoleSelector({ value, onChange, isLoading }: RoleSelectorProps) {
  return (
    <div className="space-y-2">
      <Select 
        value={value || 'user'}
        onValueChange={onChange}
        disabled={isLoading}
      >
        <SelectTrigger>
          <SelectValue placeholder="Tipo de conta" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="user">Usuário</SelectItem>
          <SelectItem value="producer">Produtor de Eventos</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
