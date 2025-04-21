
import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Check } from 'lucide-react';

interface SettingsFormData {
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

  // In a real application, these values would be fetched from the backend
  const defaultValues = {
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

  const watchEmailNotifications = watch('emailNotifications');
  const watchExportFormat = watch('exportFormat');

  const onSubmit = async (data: SettingsFormData) => {
    setIsSaving(true);
    
    try {
      // Simulate API call with timeout
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

          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
              <CardDescription>
                Configure quais alertas você deseja receber
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="saleAlert">Alertas de Venda</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba notificações quando houver novas vendas
                    </p>
                  </div>
                  <Switch
                    id="saleAlert"
                    checked={watch('saleAlert')}
                    onCheckedChange={(checked) => setValue('saleAlert', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="lotAlert">Esgotamento de Lote</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba alertas quando um lote estiver próximo do esgotamento
                    </p>
                  </div>
                  <Switch
                    id="lotAlert"
                    checked={watch('lotAlert')}
                    onCheckedChange={(checked) => setValue('lotAlert', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="paymentErrorAlert">Erros de Pagamento</Label>
                    <p className="text-sm text-muted-foreground">
                      Seja notificado quando ocorrerem erros nas transações
                    </p>
                  </div>
                  <Switch
                    id="paymentErrorAlert"
                    checked={watch('paymentErrorAlert')}
                    onCheckedChange={(checked) => setValue('paymentErrorAlert', checked)}
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications">Notificações por Email</Label>
                    <p className="text-sm text-muted-foreground">
                      Habilite para receber todas as notificações por email
                    </p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={watchEmailNotifications}
                    onCheckedChange={(checked) => setValue('emailNotifications', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Formato de Exportação</CardTitle>
              <CardDescription>
                Defina o formato padrão para exportação de relatórios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="exportFormat">Formato Padrão</Label>
                <Select
                  value={watchExportFormat}
                  onValueChange={(value) => setValue('exportFormat', value as 'csv' | 'excel')}
                >
                  <SelectTrigger className="w-full sm:w-[240px]">
                    <SelectValue placeholder="Selecione um formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground pt-2">
                  Esse formato será usado como padrão ao exportar relatórios
                </p>
              </div>
            </CardContent>
          </Card>

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
