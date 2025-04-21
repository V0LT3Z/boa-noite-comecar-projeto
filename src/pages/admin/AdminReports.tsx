
import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Download, FileSpreadsheet, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { toast } from 'sonner';

const mockEvents = [
  { id: 1, name: 'Festival de Verão 2023' },
  { id: 2, name: 'Show do Metallica' },
  { id: 3, name: 'Feira Gastronômica' },
  { id: 4, name: 'Conferência Tech' },
];

const AdminReports = () => {
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel'>('csv');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = (reportType: string) => {
    setIsGenerating(true);

    // Simulate API call with timeout
    setTimeout(() => {
      console.log('Generating report:', {
        reportType,
        selectedEvent,
        startDate,
        endDate,
        exportFormat
      });

      toast.success(`Relatório de ${reportType} gerado com sucesso`, {
        description: `O arquivo ${exportFormat.toUpperCase()} está sendo baixado.`,
      });
      
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Relatórios</h2>
          <p className="text-muted-foreground">
            Exporte dados importantes sobre seus eventos
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>
              Selecione o evento e período para seus relatórios
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="event">Evento</Label>
              <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                <SelectTrigger id="event" className="w-full">
                  <SelectValue placeholder="Selecione um evento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os eventos</SelectItem>
                  {mockEvents.map(event => (
                    <SelectItem key={event.id} value={String(event.id)}>
                      {event.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="start-date">Data Inicial</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="start-date"
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, 'dd/MM/yyyy') : 'Selecione uma data'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">Data Final</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="end-date"
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, 'dd/MM/yyyy') : 'Selecione uma data'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      disabled={(date) => 
                        startDate ? date < startDate : false
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="format">Formato de Exportação</Label>
              <Select value={exportFormat} onValueChange={(value) => setExportFormat(value as 'csv' | 'excel')}>
                <SelectTrigger id="format" className="w-full md:w-[240px]">
                  <SelectValue placeholder="Selecione um formato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="participants" className="w-full">
          <TabsList className="grid grid-cols-3 md:grid-cols-5">
            <TabsTrigger value="participants">Participantes</TabsTrigger>
            <TabsTrigger value="batch-sales">Vendas por Lote</TabsTrigger>
            <TabsTrigger value="ticket-type">Vendas por Ingresso</TabsTrigger>
            <TabsTrigger value="period-sales">Vendas por Período</TabsTrigger>
            <TabsTrigger value="financial">Resumo Financeiro</TabsTrigger>
          </TabsList>

          <TabsContent value="participants" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Relatório de Participantes</CardTitle>
                <CardDescription>
                  Exporta a lista completa de participantes com suas informações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Este relatório inclui nome completo, e-mail, CPF e tipo de ingresso de cada participante.
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  {exportFormat === 'csv' ? (
                    <FileText className="mr-2 h-4 w-4" />
                  ) : (
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                  )}
                  Formato: {exportFormat.toUpperCase()}
                </div>
                <Button 
                  onClick={() => handleGenerateReport('participantes')} 
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    'Gerando...'
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" /> Exportar Lista
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="batch-sales" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Vendas por Lote</CardTitle>
                <CardDescription>
                  Exporta vendas detalhadas por cada lote do evento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Este relatório mostra a quantidade vendida, valor total e tempo médio de venda para cada lote.
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  {exportFormat === 'csv' ? (
                    <FileText className="mr-2 h-4 w-4" />
                  ) : (
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                  )}
                  Formato: {exportFormat.toUpperCase()}
                </div>
                <Button 
                  onClick={() => handleGenerateReport('vendas por lote')} 
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    'Gerando...'
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" /> Exportar Relatório
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="ticket-type" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Vendas por Tipo de Ingresso</CardTitle>
                <CardDescription>
                  Exporta vendas segmentadas por cada tipo de ingresso
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Este relatório analisa a popularidade de cada categoria de ingresso, quantidade vendida e valor arrecadado.
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  {exportFormat === 'csv' ? (
                    <FileText className="mr-2 h-4 w-4" />
                  ) : (
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                  )}
                  Formato: {exportFormat.toUpperCase()}
                </div>
                <Button 
                  onClick={() => handleGenerateReport('tipos de ingresso')} 
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    'Gerando...'
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" /> Exportar Relatório
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="period-sales" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Vendas por Período</CardTitle>
                <CardDescription>
                  Exporta vendas detalhadas dentro do período selecionado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Este relatório mostra a evolução de vendas dia a dia no período selecionado.
                </p>
                {(!startDate || !endDate) && (
                  <p className="text-sm text-amber-500 font-medium">
                    Selecione uma data inicial e final para ativar este relatório.
                  </p>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  {exportFormat === 'csv' ? (
                    <FileText className="mr-2 h-4 w-4" />
                  ) : (
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                  )}
                  Formato: {exportFormat.toUpperCase()}
                </div>
                <Button 
                  onClick={() => handleGenerateReport('vendas por período')} 
                  disabled={isGenerating || !startDate || !endDate}
                >
                  {isGenerating ? (
                    'Gerando...'
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" /> Exportar Relatório
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumo Financeiro</CardTitle>
                <CardDescription>
                  Exporta o resumo completo de movimentações financeiras
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Este relatório apresenta receita bruta, taxas, impostos e receita líquida do evento ou período selecionado.
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  {exportFormat === 'csv' ? (
                    <FileText className="mr-2 h-4 w-4" />
                  ) : (
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                  )}
                  Formato: {exportFormat.toUpperCase()}
                </div>
                <Button 
                  onClick={() => handleGenerateReport('resumo financeiro')} 
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    'Gerando...'
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" /> Exportar Relatório
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
