
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TeamMember } from "@/types/admin";
import { roleOptions } from "./team-constants";

interface EditMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: TeamMember | null;
  onMemberChange: (member: TeamMember | null) => void;
  onSubmit: () => void;
}

export const EditMemberDialog = ({
  open,
  onOpenChange,
  member,
  onMemberChange,
  onSubmit
}: EditMemberDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar permissões</DialogTitle>
          <DialogDescription>
            Alterar o nível de permissão para {member?.name}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Nível de permissão
            </label>
            <Select
              value={member?.role || ''}
              onValueChange={(value) => onMemberChange(member ? { ...member, role: value } : null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um nível de permissão" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onSubmit}>
            Salvar alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
