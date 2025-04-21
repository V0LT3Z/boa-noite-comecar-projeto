
import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { TeamMember } from "@/types/admin";
import { TeamMembersTable } from "@/components/admin/team/TeamMembersTable";
import { AddMemberDialog } from "@/components/admin/team/AddMemberDialog";
import { EditMemberDialog } from "@/components/admin/team/EditMemberDialog";
import { DeleteMemberDialog } from "@/components/admin/team/DeleteMemberDialog";
import { TeamSearchBar } from "@/components/admin/team/TeamSearchBar";

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

        <TeamSearchBar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <div className="border rounded-md">
          <TeamMembersTable 
            members={filteredMembers}
            onEdit={(member) => {
              setSelectedMember(member);
              setEditDialogOpen(true);
            }}
            onDelete={(member) => {
              setSelectedMember(member);
              setDeleteDialogOpen(true);
            }}
          />
        </div>
      </div>

      <AddMemberDialog 
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        email={newMemberEmail}
        onEmailChange={setNewMemberEmail}
        role={newMemberRole}
        onRoleChange={setNewMemberRole}
        onSubmit={handleAddMember}
      />

      <EditMemberDialog 
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        member={selectedMember}
        onMemberChange={setSelectedMember}
        onSubmit={handleEditMember}
      />

      <DeleteMemberDialog 
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        member={selectedMember}
        onConfirm={handleDeleteMember}
      />
    </AdminLayout>
  );
};

export default AdminTeamManagement;
