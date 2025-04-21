
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UseFormRegister } from 'react-hook-form';
import { SettingsFormData } from '@/pages/admin/AdminSettings';

interface OrganizationCardProps {
  register: UseFormRegister<SettingsFormData>;
}

export const OrganizationCard = ({ register }: OrganizationCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações da Organização</CardTitle>
        <CardDescription>
          Atualize os dados da sua produtora ou organização
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="organizationName">Nome da Organização</Label>
          <Input
            id="organizationName"
            placeholder="Nome da sua produtora"
            {...register('organizationName')}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactEmail">Email de Contato</Label>
          <Input
            id="contactEmail"
            type="email"
            placeholder="contato@seudominio.com"
            {...register('contactEmail')}
          />
        </div>
      </CardContent>
    </Card>
  );
};
