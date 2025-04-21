
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { roleOptions } from "./team-constants";

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  onEmailChange: (email: string) => void;
  role: string;
  onRoleChange: (role: string) => void;
  onSubmit: () => void;
}

export const AddMemberDialog = ({
  open,
  onOpenChange,
  email,
  onEmailChange,
  role,
  onRoleChange,
  onSubmit
}: AddMemberDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar novo membro</DialogTitle>
          <DialogDescription>
            Envie um convite por e-mail para adicionar um novo membro à sua equipe.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="E-mail do novo membro"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              className="pl-9"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Nível de permissão
            </label>
            <Select
              value={role}
              onValueChange={onRoleChange}
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
            <div className="mt-2 text-xs text-muted-foreground">
              <p><strong>Leitura:</strong> Apenas visualização das informações.</p>
              <p><strong>Edição completa:</strong> Acesso total para gerenciar eventos.</p>
              <p><strong>Somente check-in:</strong> Apenas validação de ingressos na entrada.</p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onSubmit}>
            Convidar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
