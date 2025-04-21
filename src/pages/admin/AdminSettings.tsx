
import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Check } from 'lucide-react';
import { OrganizationCard } from '@/components/admin/settings/OrganizationCard';
import { NotificationsCard } from '@/components/admin/settings/NotificationsCard';
import { ExportFormatCard } from '@/components/admin/settings/ExportFormatCard';

export interface SettingsFormData {
  organizationName: string;
  contactEmail: string;
  saleAlert: boolean;
  lotAlert: boolean;
  paymentErrorAlert: boolean;
  emailNotifications: boolean;
  exportFormat: 'csv' | 'excel';
}

const AdminSettings = () => {
  const [isSaving, setIsSaving] = useState(false);

  const defaultValues: SettingsFormData = {
    organizationName: 'EventHub Produções',
    contactEmail: 'contato@eventhub.com.br',
    saleAlert: true,
    lotAlert: true,
    paymentErrorAlert: true,
    emailNotifications: true,
    exportFormat: 'csv',
  };

  const { register, handleSubmit, setValue, watch } = useForm<SettingsFormData>({
    defaultValues
  });

  const onSubmit = async (data: SettingsFormData) => {
    setIsSaving(true);
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Settings saved:', data);
      
      toast.success('Configurações salvas com sucesso', {
        description: 'Suas preferências foram atualizadas.',
        icon: <Check className="h-4 w-4" />,
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Erro ao salvar configurações', {
        description: 'Por favor, tente novamente mais tarde.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
          <p className="text-muted-foreground">
            Gerencie suas preferências e notificações
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <OrganizationCard register={register} />
          <NotificationsCard watch={watch} setValue={setValue} />
          <ExportFormatCard watch={watch} setValue={setValue} />

          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Salvando...' : 'Salvar Configurações'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
