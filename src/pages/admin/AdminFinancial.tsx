
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
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, ArrowRight, WalletCards, Clock3, BarChart4, LineChart } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';

// Mock data for financial information
const financialSummary = {
  availableBalance: 12453.75,
  processingAmount: 3250.80,
};

const mockEvents = [
  { id: 1, name: 'Festival de Verão 2023', revenue: 148790.50 },
  { id: 2, name: 'Show do Metallica', revenue: 235640.75 },
  { id: 3, name: 'Feira Gastronômica', revenue: 45980.00 },
  { id: 4, name: 'Conferência Tech', revenue: 89750.25 },
];

const withdrawalHistory = [
  { id: 1, date: subDays(new Date(), 3), amount: 5000.00, status: 'completed' },
  { id: 2, date: subDays(new Date(), 10), amount: 12000.00, status: 'completed' },
  { id: 3, date: subDays(new Date(), 25), amount: 8500.50, status: 'completed' },
  { id: 4, date: subDays(new Date(), 45), amount: 15000.00, status: 'completed' },
];

const AdminFinancial = () => {
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [isRequestingWithdrawal, setIsRequestingWithdrawal] = useState(false);

  const handleWithdrawalRequest = () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error('Valor de saque inválido', {
        description: 'Por favor, insira um valor válido maior que zero.',
      });
      return;
    }

    if (parseFloat(withdrawAmount) > financialSummary.availableBalance) {
      toast.error('Saldo insuficiente', {
        description: 'O valor solicitado é maior que o saldo disponível para saque.',
      });
      return;
    }

    setIsRequestingWithdrawal(true);

    // Simulate API call with timeout
    setTimeout(() => {
      console.log('Requesting withdrawal:', withdrawAmount);
      
      toast.success('Solicitação de saque enviada', {
        description: `Seu saque de R$ ${parseFloat(withdrawAmount).toFixed(2)} foi solicitado e está em processamento.`,
      });
      
      setWithdrawAmount('');
      setIsRequestingWithdrawal(false);
    }, 1500);
  };

  const formatCurrency = (value: number): string => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const formatDate = (date: Date): string => {
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Financeiro</h2>
          <p className="text-muted-foreground">
            Gerencie seus recursos financeiros e acompanhe receitas
          </p>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Saldo Disponível</CardTitle>
              <CardDescription>
                Valor disponível para saque imediato
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center py-6">
              <div className="flex items-center justify-center rounded-full w-16 h-16 bg-green-100 text-green-700 mx-auto mb-4">
                <WalletCards className="h-8 w-8" />
              </div>
              <div className="text-3xl font-bold text-green-600">
                {formatCurrency(financialSummary.availableBalance)}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => setWithdrawAmount(financialSummary.availableBalance.toString())}
              >
                Solicitar Saque Total
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Em Processamento</CardTitle>
              <CardDescription>
                Valores a serem liberados em breve
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center py-6">
              <div className="flex items-center justify-center rounded-full w-16 h-16 bg-blue-100 text-blue-700 mx-auto mb-4">
                <Clock3 className="h-8 w-8" />
              </div>
              <div className="text-3xl font-bold text-blue-600">
                {formatCurrency(financialSummary.processingAmount)}
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground w-full text-center">
                Liberação em até 14 dias úteis
              </p>
            </CardFooter>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Solicitar Saque</CardTitle>
            <CardDescription>
              Solicite transferência do saldo disponível para sua conta bancária
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="withdraw-amount">Valor do Saque</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    R$
                  </span>
                  <Input
                    id="withdraw-amount"
                    type="number"
                    placeholder="0,00"
                    className="pl-8"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Saldo disponível: {formatCurrency(financialSummary.availableBalance)}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleWithdrawalRequest} 
              disabled={isRequestingWithdrawal || !withdrawAmount || parseFloat(withdrawAmount) <= 0}
              className="ml-auto"
            >
              {isRequestingWithdrawal ? 'Processando...' : 'Solicitar Saque'}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>
              Visualize dados financeiros por evento e período
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 grid-cols-1 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="event">Evento</Label>
              <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                <SelectTrigger id="event">
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Arrecadação por Evento</CardTitle>
              <CardDescription>
                Total arrecadado em cada evento
              </CardDescription>
            </div>
            <BarChart4 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockEvents.map(event => (
                <div key={event.id} className="flex items-center">
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-medium leading-none">
                      {event.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(event.revenue)}
                    </p>
                  </div>
                  <div className="ml-auto font-medium">
                    {(event.revenue / mockEvents.reduce((acc, curr) => acc + curr.revenue, 0) * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Histórico de Saques</CardTitle>
            <CardDescription>
              Registro dos últimos saques realizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {withdrawalHistory.map((withdrawal) => (
                  <TableRow key={withdrawal.id}>
                    <TableCell className="font-medium">{formatDate(withdrawal.date)}</TableCell>
                    <TableCell>{formatCurrency(withdrawal.amount)}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                        Concluído
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminFinancial;
