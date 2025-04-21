
import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogFooter, DialogHeader, DialogTitle 
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue
} from "@/components/ui/select";
import { 
  Search, Plus, Edit, Trash2, Check, Mail 
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Interface for team member
interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Role options
const roleOptions = [
  { value: "read", label: "Leitura" },
  { value: "admin", label: "Edição completa" },
  { value: "checkin", label: "Somente check-in" },
];

// Mock data for demonstration
const mockTeamMembers: TeamMember[] = [
  { id: "1", name: "Ana Silva", email: "ana.silva@exemplo.com", role: "admin" },
  { id: "2", name: "Carlos Santos", email: "carlos@exemplo.com", role: "read" },
  { id: "3", name: "Márcia Oliveira", email: "marcia@exemplo.com", role: "checkin" },
  { id: "4", name: "Rafael Pereira", email: "rafael@exemplo.com", role: "read" },
];

const AdminTeamManagement = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [searchQuery, setSearchQuery] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("read");
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Filter team members based on search query
  const filteredMembers = teamMembers.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle add new team member
  const handleAddMember = () => {
    if (!newMemberEmail) {
      toast({
        title: "E-mail obrigatório",
        description: "Por favor, informe o e-mail do novo membro.",
        variant: "destructive",
      });
      return;
    }

    // In a real implementation, you would send an invitation to this email
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: newMemberEmail.split("@")[0], // Temporary name based on email
      email: newMemberEmail,
      role: newMemberRole,
    };

    setTeamMembers([...teamMembers, newMember]);
    setNewMemberEmail("");
    setNewMemberRole("read");
    setAddDialogOpen(false);

    toast({
      title: "Membro adicionado",
      description: "Um convite foi enviado para o novo membro da equipe.",
      variant: "default",
    });
  };

  // Handle edit team member
  const handleEditMember = () => {
    if (!selectedMember) return;

    const updatedMembers = teamMembers.map(member => 
      member.id === selectedMember.id ? { ...member, role: selectedMember.role } : member
    );

    setTeamMembers(updatedMembers);
    setEditDialogOpen(false);
    setSelectedMember(null);

    toast({
      title: "Permissão atualizada",
      description: "As permissões do membro da equipe foram atualizadas.",
      variant: "default",
    });
  };

  // Handle delete team member
  const handleDeleteMember = () => {
    if (!selectedMember) return;

    const updatedMembers = teamMembers.filter(member => member.id !== selectedMember.id);
    setTeamMembers(updatedMembers);
    setDeleteDialogOpen(false);
    setSelectedMember(null);

    toast({
      title: "Membro removido",
      description: "O membro foi removido da sua equipe.",
      variant: "default",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Gerenciamento de Equipe</h1>
            <p className="text-muted-foreground">
              Adicione e gerencie membros da sua equipe com diferentes níveis de permissão.
            </p>
          </div>
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar membro
          </Button>
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou e-mail"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Função</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    Nenhum membro encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>
                      {member.role === "admin" && "Edição completa"}
                      {member.role === "read" && "Leitura"}
                      {member.role === "checkin" && "Somente check-in"}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            setSelectedMember(member);
                            setEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            setSelectedMember(member);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add Member Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
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
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                className="pl-9"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Nível de permissão
              </label>
              <Select
                value={newMemberRole}
                onValueChange={setNewMemberRole}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um nível de permissão" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
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
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddMember}>
              Convidar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Member Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar permissões</DialogTitle>
            <DialogDescription>
              Alterar o nível de permissão para {selectedMember?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Nível de permissão
              </label>
              <Select
                value={selectedMember?.role}
                onValueChange={(value) => setSelectedMember(prev => prev ? { ...prev, role: value } : null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um nível de permissão" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditMember}>
              Salvar alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover membro da equipe</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover {selectedMember?.name} da sua equipe? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteMember}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminTeamManagement;
