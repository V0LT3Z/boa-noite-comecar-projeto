
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { SettingsFormData } from '@/pages/admin/AdminSettings';

interface NotificationsCardProps {
  watch: UseFormWatch<SettingsFormData>;
  setValue: UseFormSetValue<SettingsFormData>;
}

export const NotificationsCard = ({ watch, setValue }: NotificationsCardProps) => {
  const watchEmailNotifications = watch('emailNotifications');

  return (
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
  );
};
