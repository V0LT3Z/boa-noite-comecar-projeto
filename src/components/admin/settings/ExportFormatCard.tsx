
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { SettingsFormData } from '@/pages/admin/AdminSettings';

interface ExportFormatCardProps {
  watch: UseFormWatch<SettingsFormData>;
  setValue: UseFormSetValue<SettingsFormData>;
}

export const ExportFormatCard = ({ watch, setValue }: ExportFormatCardProps) => {
  const watchExportFormat = watch('exportFormat');

  return (
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
  );
};
